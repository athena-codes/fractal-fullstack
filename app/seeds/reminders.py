from datetime import datetime
from app.models import db, Reminder, environment, SCHEMA
from sqlalchemy.sql import text
import os


def seed_reminders():
    reminder1 = Reminder(
        user_id=1,
        todo_id=4,
    )

    reminder2 = Reminder(
        user_id=1,
        todo_id=5,
    )

    db.session.add(reminder1)
    db.session.add(reminder2)
    db.session.commit()


def undo_reminders():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.reminders RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reminders"))

    db.session.commit()
