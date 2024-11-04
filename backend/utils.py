from dotenv import load_dotenv
import os
import bcrypt

import random
import string

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


# Function to execute a query on the database
def db_hello_world() -> dict:
    DB_CURSOR.execute("Select 'Hello, World!' AS message")
    return DB_CURSOR.fetchone()


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
def check_login(json: dict) -> bool:
    if "email" in json and "password" in json:
        email: str = json["email"]
        password: str = json["password"]
        DB_CURSOR.execute(
            "SELECT password_hash FROM user_account WHERE email = %s", (email,)
        )
        query_result: dict = DB_CURSOR.fetchone()
        if query_result is None:
            return False
        pw_hash: str = query_result["password_hash"]
        return bcrypt.checkpw(password.encode(), pw_hash.encode())
    elif "guest_id" in json and "guest_password" in json:
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
        if query_result is None:
            return False
        else:
            return bcrypt.checkpw(
                json["guest_password"].encode(),
                query_result["password_hash"].encode(),
            )
    else:
        return False


# Generates a random string of numbers and letters
def generate_random_string(length: int = 10) -> str:
    # Define the characters to use: uppercase, lowercase letters, and digits
    characters = string.ascii_letters + string.digits
    # Randomly select 'length' characters from the character set
    random_string = "".join(random.choice(characters) for _ in range(length))
    return random_string


# Creates a guest account
def create_guest() -> dict:
    password = generate_random_string()
    pass_hash = hash_new_password(password)
    try:
        DB_CURSOR.execute(
            "INSERT INTO user_account (password_hash, is_guest) VALUES (%s, TRUE)",
            (pass_hash,),
        )
        DB_CONN.commit()
        DB_CURSOR.execute("SELECT LAST_INSERT_ID() AS guest_id")
        return {
            "guest_id": DB_CURSOR.fetchone()["guest_id"],
            "guest_password": password,
        }
    except MySQL.Error as e:
        print(e)
        return {"message": "Database error"}
