"""Initialize mkisan_products table if it doesn't exist."""
import sys
import os
import sqlite3

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from jansetu_platform.config import settings

def init_mkisan_products_table():
    """Create mkisan_products table if it doesn't exist."""
    try:
        if not settings.DATABASE_URL.startswith('sqlite'):
            print("This script is for SQLite databases only.")
            return
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        print(f"Connecting to SQLite database: {db_path}")
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='mkisan_products'")
        if cursor.fetchone():
            print("[OK] mkisan_products table already exists")
            conn.close()
            return
        
        print("Creating mkisan_products table...")
        
        # Create the table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mkisan_products (
                product_id TEXT PRIMARY KEY,
                mkisan_citizen_id TEXT NOT NULL,
                product_name TEXT NOT NULL,
                product_type TEXT NOT NULL,
                category TEXT NOT NULL,
                quantity TEXT NOT NULL,
                price_per_unit REAL NOT NULL,
                location TEXT,
                description TEXT,
                created_at TEXT DEFAULT (datetime('now')) NOT NULL,
                updated_at TEXT DEFAULT (datetime('now')) NOT NULL,
                FOREIGN KEY (mkisan_citizen_id) REFERENCES mkisan_citizens(mkisan_citizen_id) ON DELETE CASCADE
            )
        """)
        
        # Create indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_mkisan_citizen_id ON mkisan_products(mkisan_citizen_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_category ON mkisan_products(category)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_mkisan_products_product_type ON mkisan_products(product_type)")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] mkisan_products table created successfully!")
        
    except Exception as e:
        print(f"Error creating mkisan_products table: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    init_mkisan_products_table()
