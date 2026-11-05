import os

import pyodbc

from dotenv import load_dotenv
 
# Same pattern as the NestJS backend's .env — real credentials live in a

# local .env file (never committed to git), not hardcoded in this file.

load_dotenv()
 
DB_HOST = os.getenv("DB_HOST")

DB_PORT = os.getenv("DB_PORT", "1433")

DB_NAME = os.getenv("DB_NAME")

DB_USER = os.getenv("DB_USER")

DB_PASSWORD = os.getenv("DB_PASSWORD")

DB_DRIVER = os.getenv("DB_DRIVER", "SQL Server")
 
 
def get_db_connection():

    try:

        conn_str = (

            #  Microsoft ODBC Driver 18 is installed in the Linux container.

            # ODBC Driver 17/18 properly later so this file matches

            # everyone else's setup — this is a quick fix, not the

            # long-term standard.

            f'DRIVER={{{DB_DRIVER}}};'

            f'SERVER={DB_HOST},{DB_PORT};'

            f'DATABASE={DB_NAME};'

            f'UID={DB_USER};'

            f'PWD={DB_PASSWORD};'

            r'Encrypt=no;'

            r'TrustServerCertificate=yes;'

        )

        conn = pyodbc.connect(conn_str)

        print("Database connection successful!")

        return conn

    except Exception as e:

        print(f"Database connection failed: {e}")

        return None
 
 
if __name__ == "__main__":

    get_db_connection()
 