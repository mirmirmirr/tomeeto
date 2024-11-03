class User:
    def __init__(self, id: int) -> None:
        self.id: int = id


class AccountUser(User):
    def __init__(self, id: int, email: str) -> None:
        super().__init__(id)
        self.email: str = email
