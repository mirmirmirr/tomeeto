from fastapi import FastAPI
from utils import execute_query

app = FastAPI()


@app.get("/")
async def root():
    result = execute_query("SELECT 'Hello, World!' AS message")
    return result[0]


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


@app.get("/login")
async def login():
    return {"message": "you sent login data"}


@app.get("/cookies")
async def root():
    return {"message": "you sent cookie data"}
