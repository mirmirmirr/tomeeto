from typing import List
from user import User


class Availability:
    def __init__(
        self, user: User, nickname: str, availability: List[List[bool]]
    ) -> None:
        self.user: User = user
        self.nickname: str = nickname
        self.availability: List[List[bool]] = availability
