from typing import List
from datetime import datetime, date, time
from abc import ABC, abstractmethod
from enum import Enum
from user import User
from availability import Availability

import mysql.connector as MySQL
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict

TWO_WEEKS_SQL: str = "DATE_ADD(NOW(), INTERVAL 14 DAY)"


class Duration(Enum):
    QUARTER = 15
    HALF = 30
    HOUR = 60


class Weekday(Enum):
    SUNDAY = 1
    MONDAY = 2
    TUESDAY = 3
    WEDNESDAY = 4
    THURSDAY = 5
    FRIDAY = 6
    SATURDAY = 7


def date_to_weekday(date: date) -> Weekday:
    return Weekday(date.day)


def insert_code(cursor: MySQLCursorDict, code: str, event_id: int) -> None:
    query = f"""
        INSERT INTO
            url_code (
                url_code,
                user_event_id,
                unlocked_at
            )
        VALUES (%s, %s, {TWO_WEEKS_SQL})
    """
    # Intentionally not catching errors here so it propagates to the calling function
    cursor.execute(query, (code, event_id))


def insert_event(
    cursor: MySQLCursorDict,
    conn: MySQLConnection,
    event_query: str,
    event_values: tuple,
    code: str,
) -> bool:
    try:
        cursor.execute(event_query, event_values)
        event_id = cursor.lastrowid
        insert_code(cursor, code, event_id)
        conn.commit()
        return True
    except MySQL.Error as e:
        print(e)
        return False


class Event(ABC):
    def __init__(
        self,
        creator: User,
        title: str,
        description: str,
        start_time: time,
        end_time: time,
        duration: Duration,
        availabilities: List[Availability],
    ) -> None:
        self.creator: User = creator
        self.title: str = title
        self.description: str = description
        self.start_time: time = start_time
        self.end_time: time = end_time
        self.duration: Duration = duration
        self.availabilities: List[Availability] = availabilities

    @staticmethod
    def from_json(json: dict) -> "Event":
        # ERROR CHECKING WOOHOO
        required_fields = [
            "title",
            "description",
            "start_time",
            "end_time",
            "duration",
            "event_type",
        ]
        type_fields = {
            "date_range": ["start_date", "end_date"],
            "generic_week": ["start_day", "end_day"],
        }
        for field in required_fields:
            if field not in json:
                return None
        if json["event_type"] not in type_fields:
            return None
        for field in type_fields[json["event_type"]]:
            if field not in json:
                return None

        creator: User = User(json["account_id"])

        start_time = datetime.strptime(json["start_time"], "%H:%M").time()
        end_time = datetime.strptime(json["end_time"], "%H:%M").time()
        if end_time < start_time:
            return None

        if json["event_type"] == "date_range":
            start_date = datetime.strptime(json["start_date"], "%m/%d/%Y").date()
            end_date = datetime.strptime(json["end_date"], "%m/%d/%Y").date()
            if end_date < start_date:
                return None
            return DateEvent(
                creator,
                json["title"],
                json["description"],
                datetime.strptime(json["start_time"], "%H:%M").time(),
                datetime.strptime(json["end_time"], "%H:%M").time(),
                Duration(json["duration"]),
                [],
                start_date,
                end_date,
            )
        else:
            start_weekday = Weekday[json["start_day"].upper()]
            end_weekday = Weekday[json["end_day"].upper()]
            if end_weekday.value < start_weekday.value:
                return None
            return GenericWeekEvent(
                creator,
                json["title"],
                json["description"],
                datetime.strptime(json["start_time"], "%H:%M").time(),
                datetime.strptime(json["end_time"], "%H:%M").time(),
                Duration(json["duration"]),
                [],
                json["start_day"],
                json["end_day"],
            )

    @staticmethod
    def from_sql(cursor: MySQLCursorDict, code: str) -> "Event":
        query = """
            SELECT
                *
            FROM
                user_event
                INNER JOIN url_code USING (user_event_id)
            WHERE
                url_code = %s
        """
        cursor.execute(query, (code,))
        result = cursor.fetchone()
        if result is None:
            return None
        if result["date_type"] == "Specific":
            return DateEvent(
                User(result["user_account_id"]),
                result["title"],
                result["details"],
                (datetime.min + result["start_time"]).time(),
                (datetime.min + result["end_time"]).time(),
                Duration(result["duration"]),
                [],
                result["start_date"],
                result["end_date"],
            )
        else:
            return GenericWeekEvent(
                User(result["user_account_id"]),
                result["title"],
                result["details"],
                (datetime.min + result["start_time"]).time(),
                (datetime.min + result["end_time"]).time(),
                Duration(result["duration"]),
                [],
                date_to_weekday(result["start_date"]),
                date_to_weekday(result["end_date"]),
            )

    @abstractmethod
    def to_json(self) -> dict:
        pass

    @abstractmethod
    def to_sql_insert(
        self, cursor: MySQLCursorDict, conn: MySQLConnection, code: str
    ) -> tuple[str, List]:
        pass


class DateEvent(Event):
    def __init__(
        self,
        creator: User,
        title: str,
        description: str,
        start_time: time,
        end_time: time,
        duration: Duration,
        availabilities: List[Availability],
        start_date: date,
        end_date: date,
    ) -> None:
        super().__init__(
            creator, title, description, start_time, end_time, duration, availabilities
        )
        self.start_date: date = start_date
        self.end_date: date = end_date

    def to_json(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "start_time": self.start_time.strftime("%H:%M"),
            "end_time": self.end_time.strftime("%H:%M"),
            "duration": self.duration.value,
            "event_type": "date_range",
            "start_date": self.start_date.strftime("%m/%d/%Y"),
            "end_date": self.end_date.strftime("%m/%d/%Y"),
        }

    def to_sql_insert(
        self, cursor: MySQLCursorDict, conn: MySQLConnection, code: str
    ) -> bool:
        query = """
            INSERT INTO
                user_event (
                    user_account_id,
                    title,
                    details,
                    date_type,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                    duration
                )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            self.creator.id,
            self.title,
            self.description,
            "Specific",
            self.start_date.isoformat(),
            self.end_date.isoformat(),
            self.start_time.isoformat(),
            self.end_time.isoformat(),
            self.duration.value,
        )
        return insert_event(cursor, conn, query, values, code)


class GenericWeekEvent(Event):
    def __init__(
        self,
        creator: User,
        title: str,
        description: str,
        start_time: time,
        end_time: time,
        duration: Duration,
        availabilities: List[Availability],
        start_weekday: str | int,
        end_weekday: str | int,
    ) -> None:
        super().__init__(
            creator, title, description, start_time, end_time, duration, availabilities
        )
        if isinstance(start_weekday, str):
            self.start_weekday: int = Weekday[start_weekday.upper()].value
        else:
            self.start_weekday: int = start_weekday
        if isinstance(end_weekday, str):
            self.end_weekday: int = Weekday[end_weekday.upper()].value
        else:
            self.end_weekday: int = end_weekday

    def to_json(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "start_time": self.start_time.strftime("%H:%M"),
            "end_time": self.end_time.strftime("%H:%M"),
            "duration": self.duration.value,
            "event_type": "generic_week",
            "start_day": Weekday(self.start_weekday).name.title(),
            "end_day": Weekday(self.end_weekday).name.title(),
        }

    def to_sql_insert(
        self, cursor: MySQLCursorDict, conn: MySQLConnection, code: str
    ) -> bool:
        query = """
            INSERT INTO
                user_event (
                    user_account_id,
                    title,
                    details,
                    date_type,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                    duration
                )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            self.creator.id,
            self.title,
            self.description,
            "Generic",
            "2023-01-0" + str(self.start_weekday),
            "2023-01-0" + str(self.end_weekday),
            self.start_time.isoformat(),
            self.end_time.isoformat(),
            self.duration.value,
        )
        return insert_event(cursor, conn, query, values, code)
