from typing import List

from threading import Thread, Event as ThreadEvent
import signal

from dotenv import load_dotenv
import os
import bcrypt

import random
import string
from datetime import datetime, timedelta
from collections import defaultdict

from event import Event, Weekday
from availability import Availability
from user import User

# MySQL Connector stuff
import mysql.connector as MySQL
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursorDict

# Load the .env file
load_dotenv()

HOST: str = os.getenv("HOST")
PORT: int = os.getenv("PORT")
USERNAME: str = os.getenv("USERNAME")
PASSWORD: str = os.getenv("PASSWORD")
DATABASE: str = os.getenv("DATABASE")

DB_CONN: MySQLConnection = MySQL.connect(
    host=HOST, port=PORT, user=USERNAME, password=PASSWORD, database=DATABASE
)
DB_CURSOR: MySQLCursorDict = DB_CONN.cursor(dictionary=True)


# Thread to query the database every hour
class Repeat(Thread):
    def __init__(self, event):
        Thread.__init__(self)
        self.stopped = event

    def run(self):
        while not self.stopped.wait(1800):
            DB_CURSOR.execute("SELECT 'https://www.youtube.com/watch?v=YAgJ9XugGBo'")
            DB_CURSOR.fetchone()


# Initialize the thread
stopFlag = ThreadEvent()
thread = Repeat(stopFlag)
thread.start()

signal.signal(signal.SIGINT, lambda *args: stopFlag.set())

TWO_WEEKS_SQL: str = "DATE_ADD(NOW(), INTERVAL 14 DAY)"


# Function to execute a query on the database
def db_hello_world() -> dict:
    try:
        DB_CURSOR.execute("SELECT 'Hello, World!' AS message")
        return DB_CURSOR.fetchone()
    except MySQL.Error as e:
        print(e)
        return {"message": "Database error"}


# Checks if a user already has an account
def check_user_exists(email: str) -> str:
    try:
        DB_CURSOR.execute("SELECT * FROM user_account WHERE email = %s", (email,))
    except MySQL.Error as e:
        print(e)
        return "Database error"
    if DB_CURSOR.fetchone() is not None:
        return "A user with that email already exists"
    return ""


# Hashes a password with a random salt
def hash_new_password(password: str) -> str:
    salt: bytes = bcrypt.gensalt()
    pw_hash: str = bcrypt.hashpw(password.encode(), salt).decode()
    return pw_hash


# Adds a user to the database
def add_user(email: str, pass_hash: str) -> bool:
    try:
        DB_CURSOR.execute(
            """
            INSERT INTO
                user_account (email, password_hash, is_guest)
            VALUES
                (%s, %s, FALSE)
            """,
            (email, pass_hash),
        )
        DB_CONN.commit()
    except MySQL.Error as e:
        print(e)
        return False
    return True


# Checks if a user's login info is correct
def check_login(json: dict) -> int:
    if "email" in json and "password" in json:
        email: str = json["email"]
        password: str = json["password"]
        try:
            DB_CURSOR.execute(
                "SELECT password_hash FROM user_account WHERE email = %s", (email,)
            )
        except MySQL.Error as e:
            print(e)
            return -1
        query_result: dict = DB_CURSOR.fetchone()
        if query_result is None:
            return -1
        pw_hash: str = query_result["password_hash"]
        if bcrypt.checkpw(password.encode(), pw_hash.encode()):
            try:
                DB_CURSOR.execute(
                    "SELECT user_account_id FROM user_account WHERE email = %s",
                    (email,),
                )
                return DB_CURSOR.fetchone()["user_account_id"]
            except MySQL.Error as e:
                print(e)
                return -1
        else:
            return -1
    elif "guest_id" in json and "guest_password" in json:
        try:
            DB_CURSOR.execute(
                """
                SELECT
                    password_hash
                FROM
                    user_account
                WHERE
                    user_account_id = %s
                    AND is_guest = TRUE
                """,
                (json["guest_id"],),
            )
            query_result: dict = DB_CURSOR.fetchone()
        except MySQL.Error as e:
            print(e)
            return -1
        if query_result is None:
            return -1
        else:
            if bcrypt.checkpw(
                json["guest_password"].encode(),
                query_result["password_hash"].encode(),
            ):
                return json["guest_id"]
    else:
        return -1


# Generates a random string of numbers and letters
def generate_random_string(length: int = 10) -> str:
    # Define the characters to use: uppercase, lowercase letters, and digits
    characters = string.ascii_letters + string.digits
    random_string = "".join(random.choice(characters) for _ in range(length))
    return random_string


# Creates a guest account
def new_guest() -> dict:
    password = generate_random_string()
    pass_hash = hash_new_password(password)
    try:
        DB_CURSOR.execute(
            "INSERT INTO user_account (password_hash, is_guest) VALUES (%s, TRUE)",
            (pass_hash,),
        )
        DB_CONN.commit()
        return {
            "guest_id": DB_CURSOR.lastrowid,
            "guest_password": password,
        }
    except MySQL.Error as e:
        print(e)
        return {"message": "Database error"}


# Basically purges old url codes after their grace periods
def clear_unlocked_codes() -> None:
    try:
        DB_CURSOR.execute("DELETE FROM url_code WHERE unlocked_at < NOW()")
        DB_CONN.commit()
    except MySQL.Error as e:
        print(e)


# Checks if a custom code is available
def check_code_avail(code: str) -> bool:
    try:
        clear_unlocked_codes()
        DB_CURSOR.execute("SELECT * FROM url_code WHERE url_code = %s", (code,))
        return DB_CURSOR.fetchone() is None
    except MySQL.Error as e:
        print(e)
        return False


# Generates a new url code
def new_code(custom: str = "") -> str:
    if custom != "":
        if not check_code_avail(custom):
            return ""
        return custom
    else:
        new_code = generate_random_string()
        while not check_code_avail(new_code):
            new_code = generate_random_string()
    return new_code


# Adds an event to the database
def new_event(event: Event, code: str) -> bool:
    return event.to_sql_insert(DB_CURSOR, DB_CONN, code)


# Updates an event in the database
def fix_event(event: Event, code: str) -> bool:
    return event.to_sql_update(DB_CURSOR, DB_CONN, code)


# Checks if a code refers to an existing event
def check_code_event(code: str) -> bool:
    try:
        clear_unlocked_codes()
        DB_CURSOR.execute(
            """
            SELECT
                user_event_id
            FROM
                url_code
            WHERE
                url_code = %s
            """,
            (code,),
        )
        return DB_CURSOR.fetchone() is not None
    except MySQL.Error as e:
        print(e)
        return False


def new_availability(availability: Availability, code: str) -> str:
    return availability.to_sql_insert(DB_CURSOR, DB_CONN, code)


def update_avail(availability: Availability, code: str) -> str:
    return availability.to_sql_update(DB_CURSOR, DB_CONN, code)


def get_all_dates(start_date, end_date, generic=False):
    start = datetime.strptime(start_date, "%m/%d/%Y")
    end = datetime.strptime(end_date, "%m/%d/%Y")
    delta = timedelta(days=1)
    all_dates = []

    while start <= end:
        all_dates.append(start.strftime("%m/%d/%Y"))
        start += delta

    grouped_dates = defaultdict(lambda: {"all_dates": [], "weekdayName": []})

    for date_str in all_dates:
        date_obj = datetime.strptime(date_str, "%m/%d/%Y")
        month_year = date_obj.strftime("%B %Y")
        grouped_dates[month_year]["all_dates"].append(date_str)
        grouped_dates[month_year]["weekdayName"].append(date_obj.strftime("%A"))

    if generic:
        result = [
            {
                "weekdayName": data["weekdayName"],
            }
            for month_year, data in grouped_dates.items()
        ]
    else:
        result = [
            {
                "month": month_year,
                "all_dates": data["all_dates"],
                "weekdayName": data["weekdayName"],
            }
            for month_year, data in grouped_dates.items()
        ]

    return result


def weekday_to_date_str(weekday: int) -> str:
    return f"01/0{Weekday[weekday.upper()].value}/2023"


def get_event(code: str) -> dict:
    event = Event.from_sql(DB_CURSOR, code)
    event_data = event.to_json()
    if event_data["event_type"] == "generic_week":
        event_data["all_dates"] = get_all_dates(
            weekday_to_date_str(event_data["start_day"]),
            weekday_to_date_str(event_data["end_day"]),
            generic=True,
        )
    else:
        event_data["all_dates"] = get_all_dates(
            event_data["start_date"], event_data["end_date"]
        )
    return event_data


def dashboard_data(user: User) -> dict:
    return user.get_events(DB_CURSOR)


def get_event_results(code: str) -> List[Availability]:
    avail_query = """
        SELECT
            user_account_id,
            nickname,
            date_column,
            time_row,
            is_available
        FROM
            user_event_availability
            INNER JOIN user_event_participant USING (user_event_id, user_account_id)
            INNER JOIN url_code USING (user_event_id)
        WHERE
            url_code = %s
        ORDER BY
            nickname,
            date_column,
            time_row
    """
    DB_CURSOR.execute(avail_query, (code,))

    availabilities: List[Availability] = []
    # Keep track of the current state
    current_id = None
    current_name = None
    current_date = None
    # Temp variables for the current day and name
    current_availability = []
    current_day = []
    for i, row in enumerate(DB_CURSOR.fetchall()):
        # If the name changed, add the user to the list
        if row["nickname"] != current_name:
            current_availability.append(current_day)
            current_day = []
            # But don't add if its the first user because there's nothing to add
            if i != 0:
                availabilities.append(
                    Availability(
                        User(current_id),
                        current_name,
                        [[bool(time) for time in day] for day in current_availability],
                    )
                )
            current_availability = []
            # Set the state
            current_id = row["user_account_id"]
            current_name = row["nickname"]
            current_date = row["date_column"]
        # If the date changed, add the day to the list
        elif row["date_column"] != current_date:
            current_availability.append(current_day)
            # Make sure to reset the current day after adding to the list
            current_day = []
            current_date = row["date_column"]
        # After each iteration, add the availability to the current day
        current_day.append(row["is_available"])

    # Add the last day since there's no more users to check
    current_availability.append(current_day)
    # Then add the last user
    availabilities.append(
        Availability(
            User(current_id),
            current_name,
            [[bool(time) for time in day] for day in current_availability],
        )
    )

    # Finally convert the availabilities to the desired JSON format
    avail_json = {}
    for avail in availabilities:
        if avail.nickname not in avail_json:
            avail_json[avail.nickname] = avail.to_json()["availability"]

    return avail_json


def check_user_in_event(json: dict) -> dict:
    query = """
        SELECT
            user_account_id
        FROM
            user_event_participant
        WHERE
            user_account_id = %s
            AND user_event_id = (
                SELECT
                    user_event_id
                FROM
                    url_code
                WHERE
                    url_code = %s
            )
    """
    try:
        DB_CURSOR.execute(query, (json["account_id"], json["event_code"]))
        if DB_CURSOR.fetchone() is None:
            return {"message": "User not in event"}
        avails = Availability.from_sql(DB_CURSOR, json["event_code"])
        for avail in avails:
            if avail.user.id == json["account_id"]:
                return avail.to_json()
    except MySQL.Error as e:
        print(e)
        return {"message": "Database error"}
