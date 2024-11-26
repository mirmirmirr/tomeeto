from threading import Thread, Event as ThreadEvent
import signal

from dotenv import load_dotenv
import os
import bcrypt

import random
import string

from event import Event
from availability import Availability

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
