from fastapi import FastAPI
from utils import db_hello_world, check_user, hash_new_password, add_user
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


@app.post("/login")
async def login():
    return {"message": "you sent login data"}


class SignUp(BaseModel):
    email: str
    password: str


@app.post("/signup")
async def sign_up(info: SignUp):
    if check_user(info.email):
        return {"message": "A user with this email already exists"}
    pass_hash, salt = hash_new_password(info.password)
    add_user(info.email, pass_hash, salt)
    return {"message": "User created"}


@app.get("/cookies")
async def root():
    return {"message": "you sent cookie data"}
