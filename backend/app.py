from fastapi import FastAPI

app = FastAPI()

# class Event:
#     def __init__(self, generic_week):
#         self.generic = generic_week

#     # user event availability object
#     # store as a list of objects for availabilites ([Monday 11/5, Tuesday 11/6, ...])

# class SpecificDates(Event):
#     def __init__(self, generic_week, something):
#         super().__init__(generic_week)
#         self.something = something

# class User:
#     def __init__(self):

# class AccountUser(User):
#     def __init__(self):
#         super().__init__()


# Date Range, Time Range, Generic Event (?)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/create_event")
async def create_event():
    return {"message": "you sent calendar data"}


@app.get("/login")
async def login():
    return {"message": "you sent login data"}


@app.get("/cookies")
async def root():
    return {"message": "you sent cookie data"}
