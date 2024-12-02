from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
import re

from utils import (
    db_hello_world,
    check_user_exists,
    hash_new_password,
    add_user,
    check_login,
    new_guest,
    check_code_avail,
    new_code,
    new_event,
    check_code_event,
    new_availability,
    get_event,
    dashboard_data,
    get_event_results,
    update_avail,
    fix_event,
)
from event import Event
from availability import Availability
from user import User

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return db_hello_world()


@app.post("/signup")
async def signup(request: Request):
    body: dict = await request.json()
    email: str = body["email"]
    password: str = body["password"]

    # This is RFC 5322 compliant, but slimmed down so it's not perfect
    email_regex: str = (
        r"(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"
        r'"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@'
        r"(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\["
        r"(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}"
        r"(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:"
        r"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])"
    )
    if not re.match(email_regex, email):
        return {"message": "Invalid email"}
    elif len(email) > 255:
        return {"message": "Email too long"}
    if len(password) < 6:
        return {"message": "Password too short"}
    elif len(password) > 255:
        return {"message": "Password too long"}

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
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}

    if "code" not in body:
        return {"message": "Missing field: code"}
    code: str = body["code"]
    if len(code) >= 255:
        return {"message": "Code too long"}
    if not code.isalnum():
        return {"message": "Code must be alphanumeric"}

    if check_code_avail(code):
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

    event_obj = Event.from_json(body)
    if event_obj is None:
        return {"message": "Invalid event data"}
    if not new_event(event_obj, code):
        return {"message": "Database error"}

    return {"message": "Event created", "event_code": code}


@app.post("/update_event")
async def update_event(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    if "event_code" not in body:
        return {"message": "Missing field: event_code"}
    if not check_code_event(body["event_code"]):
        return {"message": "Invalid event code"}

    event_obj = Event.from_json(body)
    if event_obj is None:
        return {"message": "Invalid event data"}
    if not fix_event(event_obj, body["event_code"]):
        return {"message": "Database error"}

    return {"message": "Event updated"}


@app.post("/add_availability")
async def add_availability(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    required_fields = ["event_code", "nickname", "availability"]
    for field in required_fields:
        if field not in body:
            return {"message": "Invalid data"}
    if not check_code_event(body["event_code"]):
        return {"message": "Invalid event code"}

    availability = Availability.from_json(body)
    if availability is None:
        return {"message": "Invalid availability data"}
    result = new_availability(availability, body["event_code"])
    if isinstance(result, str):
        return {"message": result}
    elif not result:
        return {"message": "Database error"}

    return {"message": "Availability added"}


@app.post("/update_availability")
async def update_availability(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    required_fields = ["event_code", "nickname", "availability"]
    for field in required_fields:
        if field not in body:
            return {"message": "Invalid data"}
    if not check_code_event(body["event_code"]):
        return {"message": "Invalid event code"}

    availability = Availability.from_json(body)
    if availability is None:
        return {"message": "Invalid availability data"}
    result = update_avail(availability, body["event_code"])
    if isinstance(result, str):
        return {"message": result}
    elif not result:
        return {"message": "Database error"}

    return {"message": "Availability updated"}


@app.post("/event_details")
async def event_details(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    if "event_code" not in body:
        return {"message": "Missing field: event_code"}
    if not check_code_event(body["event_code"]):
        return {"message": "Invalid event code"}

    return get_event(body["event_code"])


@app.post("/dashboard_events")
async def dashboard_events(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    current_user = User.from_json(body)

    return dashboard_data(current_user)


@app.post("/get_results")
async def get_results(request: Request):
    body: dict = await request.json()
    user_id = check_login(body)
    if user_id < 0:
        return {"message": "Login failed"}
    else:
        body["account_id"] = user_id

    if "event_code" not in body:
        return {"message": "Missing field: event_code"}
    if not check_code_event(body["event_code"]):
        return {"message": "Invalid event code"}

    return get_event_results(body["event_code"])
