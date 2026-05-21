import sqlite3
import os

DB_PATH = os.getenv("DB_PATH", "../slotrecovery.sqlite")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn
