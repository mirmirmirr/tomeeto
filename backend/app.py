from fastapi import FastAPI
from utils import (
    db_hello_world,
    check_user_exists,
    hash_new_password,
    add_user,
    check_login,
)
from pydantic import BaseModel

app = FastAPI()


@app.get("/")
async def root():
    return db_hello_world()


@app.get("/create_event")
async def create_event():
    rows = 0
    cols = 0
    calendar_data = {row: rows, col: cols, free_times: []}

    for row in range(rows):
        for col in range(cols):
            if painting[row][col] != 0:
                calendar_data[free_times].append((row, col))

    return {"message": "you sent calendar data"}


class AuthInfo(BaseModel):
    email: str
    password: str


@app.post("/signup")
async def sign_up(info: AuthInfo):
    result: str = check_user_exists(info.email)
    if len(result) > 0:
        return {"message": result}
    pass_hash = hash_new_password(info.password)
    add_user(info.email, pass_hash)
    return {"message": "User created"}


@app.post("/login")
async def login(info: AuthInfo):
    if check_login(info.email, info.password):
        return {"message": "Login successful"}
    return {"message": "Login failed"}
