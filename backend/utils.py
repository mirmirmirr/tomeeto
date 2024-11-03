from dotenv import load_dotenv
import os

import base64
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

DB_CONN = MySQL.connect(
    host=HOST, port=PORT, user=USERNAME, password=PASSWORD, database=DATABASE
)
DB_CURSOR: MySQLCursorDict = DB_CONN.cursor(dictionary=True)


# Function to execute a query on the database
def execute_query(query: str) -> dict:
    DB_CURSOR.execute(query)
    results = DB_CURSOR.fetchall()
    return results


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
    random_link = "".join(random.choice(characters) for _ in range(length))
    return "http://tomeeto.cs.rpi.edu/" + random_link
