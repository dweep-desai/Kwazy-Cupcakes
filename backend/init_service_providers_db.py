"""Initialize service providers database tables from SQL schema."""
import sys
import os
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings

def init_service_providers_schema():
    """Execute the service providers schema SQL file to create tables."""
    try:
        if not settings.DATABASE_URL.startswith('sqlite'):
            print("This script is for SQLite databases only.")
            return
        
        schema_file = os.path.join(os.path.dirname(__file__), 'schema', 'service_providers_schema_sqlite.sql')
        
        if not os.path.exists(schema_file):
            print(f"Error: Schema file not found at {schema_file}")
            sys.exit(1)
        
        print(f"Reading schema file: {schema_file}")
        with open(schema_file, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        print(f"Connecting to SQLite database: {db_path}")
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        print("Creating service provider tables...")
        statements = [stmt.strip() for stmt in schema_sql.split(';') if stmt.strip()]
        
        for statement in statements:
            if statement and not statement.startswith('--'):
                try:
                    cursor.execute(statement)
                except Exception as e:
                    if 'already exists' not in str(e).lower():
                        print(f"Warning: {e}")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Service providers schema created successfully!")
        
    except Exception as e:
        print(f"Error initializing service providers database: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    init_service_providers_schema()
