from fastapi import FastAPI

app = FastAPI()



class Event:
    def __init__(self, generic_week):
        self.generic = generic_week
        
class SpecificDates(Event):
    def __init__(self, generic_week, something):
        super().__init__(generic_week)
        self.something = something


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/calendar_data")
async def root():
    return {"message": "you sent calendar data"}

@app.get("/cookies")
async def root():
    return {"message": "you sent cookie data"}

@app.get("/time")
async def root():
    return {"message": "you sent time data"}

@app.get("/availability_painting")
async def root():
    return {"message": "you sent painting data"}