from fastapi import FastAPI
import base64
import random
import string

app = FastAPI()

# Function to hash a password and decode it for security purposes:
def encode_string(input_string: str) -> str:
    encoded_bytes = base64.b64encode(input_string.encode())
    return encoded_bytes.decode()

def decode_string(encoded_string: str) -> str:
    # Decode the Base64 encoded string
    decoded_bytes = base64.b64decode(encoded_string.encode())
    return decoded_bytes.decode()

# Function to generate a random link for the user once an event is made
def generate_random_link(length: int = 10) -> str:
    # Define the characters to use: uppercase, lowercase letters, and digits
    characters = string.ascii_letters + string.digits
    # Randomly select 'length' characters from the character set
    random_link = ''.join(random.choice(characters) for _ in range(length))
    return "http://tomeeto.cs.rpi.edu/" + random_link

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/create_event")
async def create_event():
    rows = 0
    cols = 0
    calendar_data = {
        row: rows,
        col: cols,
        free_times: []
    }

    for row in range(rows):
        for col in range(cols):
            if painting[row][col] != 0:
                calendar_data[free_times].append((row, col))

    return {"message": "you sent calendar data"}

@app.get("/login")
async def login():
    return {"message": "you sent login data"}

@app.get("/cookies")
async def root():
    return {"message": "you sent cookie data"}
