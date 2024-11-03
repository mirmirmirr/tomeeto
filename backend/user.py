from typing import List
from event import Event


class User:
    def __init__(self, id: int) -> None:
        self.id: int = id
        self.events: List[Event] = []

    def add_event(self, event: Event) -> None:
        self.events.append(event)


class AccountUser(User):
    def __init__(self, id: int, email: str) -> None:
        super().__init__(id)
        self.email: str = email
