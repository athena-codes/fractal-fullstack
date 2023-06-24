from datetime import datetime
from app.models import db, Todo, environment, SCHEMA
from sqlalchemy.sql import text
import os

def seed_todos():
    todo1 = Todo(
        user_id=1,
        name='Complete Project Tasks',
        priority=1,
        description='Finish the remaining tasks for the project',
        notes='Refer to project documentation for details',
        reminder=True,
        completed=False,
        goal_id=1,
        time_slot_id=None,
    )

    todo2 = Todo(
        user_id=1,
        name='Enroll in Online Course',
        priority=2,
        description='Find a suitable online course for the new skill',
        notes='Check out popular learning platforms',
        reminder=False,
        completed=False,
        goal_id=2,
        time_slot_id=None,
    )

    todo3 = Todo(
        user_id=1,
        name='Go to the gym',
        priority=3,
        description='1 hour 30 minutes',
        notes='Include cardio and strength training exercises',
        reminder=True,
        completed=False,
        goal_id=3,
        time_slot_id=None,
    )

    todo4 = Todo(
        user_id=1,
        name='Transfer $50 into savings',
        priority=1,
        description='',
        notes='',
        reminder=True,
        completed=False,
        goal_id=4,
        time_slot_id=None,
    )

    todo5 = Todo(
        user_id=1,
        name='Read Lisey''s story for 30 min',
        priority=2,
        description='',
        notes='',
        reminder=False,
        completed=False,
        goal_id=5,
        time_slot_id=None,
    )

    db.session.add(todo1)
    db.session.add(todo2)
    db.session.add(todo3)
    db.session.add(todo4)
    db.session.add(todo5)
    db.session.commit()


def undo_todos():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.todos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM todos"))

    db.session.commit()
