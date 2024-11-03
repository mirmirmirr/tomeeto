from typing import Tuple
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
def hash_new_password(password: str) -> Tuple[str, str]:
    salt: bytes = bcrypt.gensalt()
    pw_hash: str = bcrypt.hashpw(password.encode(), salt).decode()
    return pw_hash, salt.decode()


# Adds a user to the database
def add_user(email: str, pass_hash: str, salt: str) -> bool:
    try:
        DB_CURSOR.execute(
            """
                INSERT INTO
                    user_account (email, salt, password_hash, is_guest)
                VALUES
                    (%s, %s, %s, FALSE)
            """,
            (email, salt, pass_hash),
        )
        DB_CONN.commit()
    except MySQL.Error as e:
        print(e)
        return False
    return True


# Checks if a user's login info is correct
def check_login(email: str, password: str) -> bool:
    DB_CURSOR.execute(
        "SELECT password_hash FROM user_account WHERE email = %s", (email,)
    )
    pw_hash: str = DB_CURSOR.fetchone()["password_hash"]
    return bcrypt.checkpw(password.encode(), pw_hash.encode())


# Function to generate a random link for the user once an event is made
def generate_random_link(length: int = 10) -> str:
    # Define the characters to use: uppercase, lowercase letters, and digits
    characters = string.ascii_letters + string.digits
    # Randomly select 'length' characters from the character set
    random_link = "".join(random.choice(characters) for _ in range(length))
    return "http://tomeeto.cs.rpi.edu/" + random_link
