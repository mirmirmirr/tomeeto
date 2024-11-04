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
    body: dict = await request.json()
    email: str = body["email"]
    password: str = body["password"]

    result: str = check_user_exists(email)
    if len(result) > 0:
        return {"message": result}
    pass_hash: str = hash_new_password(password)
    if not add_user(email, pass_hash):
        return {"message": "Database error"}
    return {"message": "User created"}


@app.post("/login")
async def login(request: Request):
    body: dict = await request.json()
    if check_login(body):
        return {"message": "Login successful"}
    return {"message": "Login failed"}


@app.post("/create_event")
async def create_event(request: Request):
    body = await request.json()
    if not check_login(body):
        return {"message": "Login failed"}

    # Placeholder
    return {"message": "event created"}
