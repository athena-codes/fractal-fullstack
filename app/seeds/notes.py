from datetime import datetime
import random
from app.models import db, Note, environment, SCHEMA
from sqlalchemy.sql import text
import os

def seed_notes():
    note_titles = [
        "Meeting notes",
        "Ideas for project",
        "Grocery list",
        "Daily journal entry",
        "Quote of the day",
        "Random thoughts",
        "Recipe to try",
        "Travel plans",
        "Book recommendations",
        "To-do list",
    ]

    for _ in range(10):
        note = Note(
            user_id=2,
            title=random.choice(note_titles),
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at fermentum est.",
        )
        db.session.add(note)

    db.session.commit()

def undo_notes():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))

    db.session.commit()
