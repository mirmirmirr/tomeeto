from fastapi import Request, FastAPI
from utils import (
    db_hello_world,
    check_user_exists,
    hash_new_password,
    add_user,
    check_login,
    new_guest,
    check_code,
    new_code,
)
from event import Event

app = FastAPI()


@app.get("/")
async def root():
    return db_hello_world()


@app.post("/signup")
async def signup(request: Request):
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
    if check_login(body) >= 0:
        return {"message": "Login successful"}
    return {"message": "Login failed"}


@app.get("/create_guest")
async def create_guest():
    return new_guest()


@app.get("/check_custom_code")
async def check_custom_code(request: Request):
    body: dict = await request.json()
    if "code" not in body:
        return {"message": "Missing field: code"}
    code: str = body["code"]
    if len(code) >= 255:
        return {"message": "Code too long"}
    if not code.isalnum():
        return {"message": "Code must be alphanumeric"}

    if check_code(code):
        return {"message": "Custom code is available"}
    return {"message": "Custom code is NOT available"}


@app.post("/create_event")
async def create_event(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id
    
    # Check the custom code or get a new one
    custom_code = ""
    if "custom_code" in body:
        custom_code = body["custom_code"]
    code = new_code(custom_code)
    if len(code) == 0:
        return {"message": "Invalid custom code"}

    new_event = Event.from_json(body)
    print(new_event)

    return {"message": "Event created", "event_code": code}
