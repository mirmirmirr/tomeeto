from fastapi import FastAPI
import base64

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



# Function to Hash a Password:
def encode_string(input_string: str) -> str:
    # Encode the string in Base64
    encoded_bytes = base64.b64encode(input_string.encode())
    return encoded_bytes.decode()

def decode_string(encoded_string: str) -> str:
    # Decode the Base64 encoded string
    decoded_bytes = base64.b64decode(encoded_string.encode())
    return decoded_bytes.decode()


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


