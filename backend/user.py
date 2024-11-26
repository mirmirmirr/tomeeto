from typing import List


class User:
    def __init__(self, id: int) -> None:
        self.id: int = id

    @staticmethod
    def from_json(json: dict) -> "User":
        if "account_id" in json:
            return User(json["account_id"])
        return None

    def get_events(self) -> List:
        pass
