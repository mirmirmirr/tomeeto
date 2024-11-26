from typing import List

import mysql.connector as MySQL
from mysql.connector.cursor import MySQLCursorDict


class User:
    def __init__(self, id: int) -> None:
        self.id: int = id

    @staticmethod
    def from_json(json: dict) -> "User":
        if "account_id" in json:
            return User(json["account_id"])
        return None

    def get_events(self, cursor: MySQLCursorDict) -> dict:
        # TODO: account for events with url codes that expired
        try:
            my_query = """
                SELECT
                    title,
                    url_code
                FROM
                    user_event
                    INNER JOIN url_code USING (user_event_id)
                WHERE
                    user_account_id = %s
            """
            cursor.execute(my_query, (self.id,))
            my_events = {}
            for row in cursor.fetchall():
                my_events[row["url_code"]] = row["title"]

            other_query = """
                SELECT
                    title,
                    url_code
                FROM
                    user_event
                    INNER JOIN user_event_participant USING (user_event_id)
                    INNER JOIN url_code USING (user_event_id)
                WHERE
                    user_event_participant.user_account_id = %s
                    AND user_event.user_account_id != %s
            """
            cursor.execute(other_query, (self.id, self.id))
            other_events = {}
            for row in cursor.fetchall():
                other_events[row["url_code"]] = row["title"]

            return {"my_events": my_events, "other_events": other_events}
        except MySQL.Error as e:
            print(e)
            return {"message": "Database error"}
