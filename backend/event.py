from typing import List
from datetime import datetime, date, time
from abc import ABC, abstractmethod
from enum import Enum
from user import User
from availability import Availability


class Duration(Enum):
    QUARTER = 15
    HALF = 30
    HOUR = 60


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

        if json["event_type"] == "date_range":
            start_date = datetime.strptime(json["start_date"], "%m/%d/%Y").date()
            end_date = datetime.strptime(json["end_date"], "%m/%d/%Y").date()
            return DateEvent(
                creator,
                json["title"],
                json["description"],
                datetime.strptime(json["start_time"], "%H:%M").date(),
                datetime.strptime(json["end_time"], "%H:%M").date(),
                Duration(json["duration"]),
                [],
                start_date,
                end_date,
            )
        else:
            return GenericWeekEvent(
                creator,
                json["title"],
                json["description"],
                datetime.strptime(json["start_time"], "%H:%M").date(),
                datetime.strptime(json["end_time"], "%H:%M").date(),
                Duration(json["duration"]),
                [],
                json["start_day"],
                json["end_day"],
            )

    @staticmethod
    def from_sql(sql: dict) -> "Event":
        pass

    @abstractmethod
    def to_json(self) -> dict:
        pass

    @abstractmethod
    def to_sql(self) -> str:
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
        pass

    def to_sql(self) -> str:
        pass


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
        start_weekday: int,
        end_weekday: int,
    ) -> None:
        super().__init__(
            creator, title, description, start_time, end_time, duration, availabilities
        )
        self.start_weekday: int = start_weekday
        self.end_weekday: int = end_weekday

    def to_json(self) -> dict:
        pass

    def to_sql(self) -> str:
        pass
