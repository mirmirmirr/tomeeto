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

