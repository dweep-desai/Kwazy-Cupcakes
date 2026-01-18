"""Initialize admin database tables from SQL schema."""
import sys
import os
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings
from jansetu_platform.database_init import init_admin_schema_on_startup, seed_admin_data_sqlite
from sqlalchemy.orm import Session
from jansetu_platform.database import get_db

def init_admin_schema():
    """Execute the admin schema SQL file to create tables."""
    db_gen = get_db()
    db = next(db_gen)
    try:
        init_admin_schema_on_startup(db)
        seed_admin_data_sqlite()
    finally:
        db.close()

if __name__ == "__main__":
    init_admin_schema()
