from typing import List
from user import User

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
                availability
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
                avail_grids[row["nickname"]] = [[]]
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
