"""Seed admin data for SQLite."""
import sys
import os
import sqlite3
import hashlib
import uuid
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from jansetu_platform.config import settings

def seed_admins():
    """Seed admin data."""
    try:
        if not settings.DATABASE_URL.startswith('sqlite'):
            print("This script is for SQLite databases only.")
            return
        
        db_path = settings.DATABASE_URL.replace('sqlite:///', '')
        conn = sqlite3.connect(db_path)
        conn.execute('PRAGMA foreign_keys = ON')
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM admins")
        count = cursor.fetchone()[0]
        if count > 0:
            print(f"[INFO] Admins already exist ({count} records). Skipping seed.")
            conn.close()
            return
        
        print("Seeding admin data...")
        
        # Admin 1: Default admin
        admin1_password = "admin123"
        admin1_password_hash = hashlib.sha256(admin1_password.encode()).hexdigest()
        admin1_id = str(uuid.uuid4())
        
        cursor.execute("""
            INSERT INTO admins 
            (admin_id, username, password_hash, full_name, email)
            VALUES (?, ?, ?, ?, ?)
        """, (
            admin1_id,
            "admin",
            admin1_password_hash,
            "Platform Administrator",
            "admin@jansetu.gov.in"
        ))
        
        # Admin 2: Secondary admin
        admin2_password = "admin456"
        admin2_password_hash = hashlib.sha256(admin2_password.encode()).hexdigest()
        admin2_id = str(uuid.uuid4())
        
        cursor.execute("""
            INSERT INTO admins 
            (admin_id, username, password_hash, full_name, email)
            VALUES (?, ?, ?, ?, ?)
        """, (
            admin2_id,
            "admin2",
            admin2_password_hash,
            "Secondary Administrator",
            "admin2@jansetu.gov.in"
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("[OK] Admin data seeded successfully!")
        print("   Admin 1 credentials:")
        print("   Username: admin")
        print("   Password: admin123")
        print("   Admin 2 credentials:")
        print("   Username: admin2")
        print("   Password: admin456")
        print("   ⚠️  WARNING: Change the passwords in production!")
        
    except Exception as e:
        print(f"Error seeding admins: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    seed_admins()
