import os
import pyodbc
from dotenv import load_dotenv

# Load database credentials from .env
load_dotenv()

# Database configuration
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "1433")
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_DRIVER = os.getenv("DB_DRIVER", "ODBC Driver 18 for SQL Server")


def get_db_connection():
    try:
        conn_str = (
            f"DRIVER={{{DB_DRIVER}}};"
            f"SERVER={DB_HOST},{DB_PORT};"
            f"DATABASE={DB_NAME};"
            f"UID={DB_USER};"
            f"PWD={DB_PASSWORD};"
            "Encrypt=no;"
            "TrustServerCertificate=yes;"
        )

        conn = pyodbc.connect(conn_str, timeout=10)
        print("Database connection successful!")
        return conn

    except Exception as e:
        print(f"Database connection failed: {e}")
        return None


if __name__ == "__main__":
    get_db_connection()