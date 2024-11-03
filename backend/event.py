from typing import List
from datetime import datetime
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
        start_time: datetime,
        end_time: datetime,
        duration: Duration,
        availabilities: List[Availability],
    ) -> None:
        self.creator: User = creator
        self.title: str = title
        self.description: str = description
        self.start_time: datetime = start_time
        self.end_time: datetime = end_time
        self.duration: Duration = duration
        self.availabilities: List[Availability] = availabilities

    @abstractmethod
    def sql_create(self) -> str:
        pass

    @abstractmethod
    def add_availability(self, availability) -> str:
        pass


class DateEvent(Event):
    def __init__(
        self,
        creator: User,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
        duration: Duration,
        availabilities: List[Availability],
        start_date: datetime,
        end_date: datetime,
    ) -> None:
        super().__init__(
            creator, title, description, start_time, end_time, duration, availabilities
        )
        self.start_date: datetime = start_date
        self.end_date: datetime = end_date


class GenericWeekEvent(Event):
    def __init__(
        self,
        creator: User,
        title: str,
        description: str,
        start_time: datetime,
        end_time: datetime,
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
