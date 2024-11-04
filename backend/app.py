from fastapi import Request, FastAPI
from utils import (
    db_hello_world,
    check_user_exists,
    hash_new_password,
    add_user,
    check_login,
)

app = FastAPI()


@app.get("/")
async def root():
    return db_hello_world()


@app.post("/signup")
async def sign_up(request: Request):
    info = await request.json()
    email = info["email"]
    password = info["password"]

    result: str = check_user_exists(email)
    if len(result) > 0:
        return {"message": result}
    pass_hash = hash_new_password(password)
    add_user(email, pass_hash)
    return {"message": "User created"}


@app.post("/login")
async def login(request: Request):
    info = await request.json()
    email = info["email"]
    password = info["password"]

    if check_login(email, password):
        return {"message": "Login successful"}
    return {"message": "Login failed"}


@app.post("/create_event")
async def create_event():
    rows = 0
    cols = 0
    calendar_data = {row: rows, col: cols, free_times: []}

    for row in range(rows):
        for col in range(cols):
            if painting[row][col] != 0:
                calendar_data[free_times].append((row, col))

    return {"message": "event created"}
