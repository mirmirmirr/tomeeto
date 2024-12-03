from typing import List
from user import User
from datetime import date, time, timedelta

import mysql.connector as MySQL
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict


class Availability:
    def __init__(
        self, user: User, nickname: str, availability: List[List[bool]]
    ) -> None:
        self.user: User = user
        self.nickname: str = nickname
        self.availability: List[List[bool]] = availability

    @staticmethod
    def from_json(json: dict) -> "Availability":
        user = User(json["account_id"])

        required_fields = ["nickname", "availability"]
        for field in required_fields:
            if field not in json:
                return None

        if len(json["nickname"]) == 0 or len(json["nickname"]) > 255:
            return None

        return Availability(
            user,
            json["nickname"],
            [[bool(time) for time in day] for day in json["availability"]],
        )

    @staticmethod
    def from_sql(cursor: MySQLCursorDict, code: str) -> List["Availability"]:
        query = """
            SELECT
                user_account_id,
                nickname,
                date_column,
                time_row,
                is_available
            FROM
                user_event_availability
                INNER JOIN url_code USING (user_event_id)
                INNER JOIN user_event_participant USING (user_event_id, user_account_id)
            WHERE
                url_code = %s
            ORDER BY
                nickname,
                date_column,
                time_row
        """
        cursor.execute(query, (code,))
        avail_grids = {}
        user_ids = {}
        curr_nickname = None
        curr_date = None
        for row in cursor.fetchall():
            if row["nickname"] not in avail_grids:
                avail_grids[row["nickname"]] = []
                user_ids[row["nickname"]] = row["user_account_id"]
                curr_nickname = row["nickname"]
            if row["date_column"] != curr_date:
                avail_grids[curr_nickname].append([])
                curr_date = row["date_column"]
            avail_grids[curr_nickname][-1].append(bool(row["is_available"]))

        availabilities = []
        for nickname, availability in avail_grids.items():
            user = User(user_ids[nickname])
            availabilities.append(Availability(user, nickname, availability))

        return availabilities

    def to_json(self) -> dict:
        return {
            "nickname": self.nickname,
            "availability": [[int(time) for time in day] for day in self.availability],
        }

    def to_sql_insert(
        self, cursor: MySQLCursorDict, conn: MySQLConnection, code: str
    ) -> bool:
        event_query = """
            SELECT
                user_event_id,
                start_date,
                start_time,
                end_date,
                end_time,
                duration
            FROM
                url_code
                INNER JOIN user_event USING (user_event_id)
            WHERE
                url_code = %s
                AND user_event_id NOT IN (
                    SELECT
                        user_event_id
                    FROM
                        user_event_participant
                    WHERE
                        user_account_id = %s
                        OR nickname = %s
                )
        """
        cursor.execute(event_query, (code, self.user.id, self.nickname))
        result = cursor.fetchone()
        if result is None:
            return "User or nickname already in event or invalid code"
        event_id: int = result["user_event_id"]
        start_time: time = result["start_time"]
        end_time: time = result["end_time"]
        start_date: date = result["start_date"]
        end_date: date = result["end_date"]
        duration: int = result["duration"]
        time_diff: timedelta = end_time - start_time
        date_diff: timedelta = end_date - start_date
        if date_diff.days + 1 != len(self.availability):
            return (
                "Date range should be "
                + str(date_diff.days + 1)
                + " days but is "
                + str(len(self.availability))
            )
        if time_diff.seconds / 60 != len(self.availability[0]) * duration:
            return (
                "Time range should be "
                + str(time_diff.seconds / 60)
                + " minutes but is "
                + str(len(self.availability[0]) * duration)
            )
        query = """
            INSERT INTO
                user_event_availability (
                    user_event_id,
                    user_account_id,
                    date_column,
                    time_row,
                    is_available
                )
            VALUES
        """
        values = []
        current_date = start_date
        current_time = start_time
        for day in self.availability:
            for availability in day:
                query += f"(%s, %s, %s, %s, %s),"
                values += [
                    event_id,
                    self.user.id,
                    current_date,
                    current_time,
                    availability,
                ]
                current_time = current_time + timedelta(minutes=duration)
            current_date = current_date + timedelta(days=1)
            current_time = start_time
        query = query[:-1]
        participant_query = """
            INSERT INTO
                user_event_participant (
                    user_event_id,
                    user_account_id,
                    nickname
                )
            VALUES
                (%s, %s, %s)
        """
        participant_values = [event_id, self.user.id, self.nickname]
        try:
            cursor.execute(query, values)
            cursor.execute(participant_query, participant_values)
            conn.commit()
        except MySQL.Error as e:
            print(e)
            return False
        return True

    def to_sql_update(
        self, cursor: MySQLCursorDict, conn: MySQLConnection, code: str
    ) -> bool:
        # This is a very hacky solution but I can't complain
        # TODO: Make sure it doesn't just delete the data if it's not valid
        delete_query_1 = """
            DELETE FROM user_event_availability
            WHERE
                user_account_id = %s
                AND user_event_id = (
                    SELECT user_event_id
                    FROM url_code
                    WHERE url_code = %s
                )
        """
        delete_query_2 = """
            DELETE FROM user_event_participant
            WHERE
                user_account_id = %s
                AND user_event_id = (
                    SELECT user_event_id
                    FROM url_code
                    WHERE url_code = %s
                )
        """
        cursor.execute(delete_query_1, (self.user.id, code))
        cursor.execute(delete_query_2, (self.user.id, code))
        return self.to_sql_insert(cursor, conn, code)
