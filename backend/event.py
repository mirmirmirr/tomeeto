from datetime import datetime
from abc import ABC, abstractmethod


class Event(ABC):
    def __init__(
        self,
        creator_id: int,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
    ) -> None:
        self.creator_id: int = creator_id
        self.title: str = title
        self.description: str = description
        self.start_time: datetime = start_time
        self.end_time: datetime = end_time

    @abstractmethod
    def sql_create(self) -> str:
        pass

    @abstractmethod
    def add_availability(self, availability) -> str:
        pass


class DateEvent(Event):
    def __init__(
        self,
        creator_id: int,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
        start_date: datetime,
        end_date: datetime,
    ) -> None:
        super().__init__(creator_id, title, description, start_time, end_time)
        self.start_date: datetime = start_date
        self.end_date: datetime = end_date


class GenericWeekEvent(Event):
    def __init__(
        self,
        creator_id: int,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
        start_weekday: int,
        end_weekday: int,
    ) -> None:
        super().__init__(creator_id, title, description, start_time, end_time)
        self.start_weekday: int = start_weekday
        self.end_weekday: int = end_weekday
