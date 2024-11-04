from fastapi import Request, FastAPI
from utils import (
    db_hello_world,
    check_user_exists,
    hash_new_password,
    add_user,
    check_login,
    new_guest,
    check_code,
    new_event,
)

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
    if check_login(body):
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
    if not check_login(body):
        return {"message": "Login failed"}

    # ERROR CHECKING WOOHOO
    required_fields = [
        "event_name",
        "description",
        "start_time",
        "end_time",
        "duration",
        "event_type",
    ]
    type_fields = {
        "date_range": ["start_date", "end_date"],
        "generic_week": ["start_day", "end_day"],
    }
    for field in required_fields:
        if field not in body:
            return {"message": f"Missing field: {field}"}
    if body["event_type"] not in type_fields:
        return {"message": "Invalid event type"}
    for field in type_fields[body["event_type"]]:
        if field not in body:
            return {"message": f"Missing field: {field}"}
        
    # Add the event to the database
    code = new_event(body)
    if len(code) == 0:
        return {"message": "Unable to create event"}
    
    return {"message": "Event created", "event_code": code}
