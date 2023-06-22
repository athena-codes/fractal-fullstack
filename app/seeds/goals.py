from datetime import datetime
from app.models import db, Goal, environment, SCHEMA
from sqlalchemy.sql import text
import os


def seed_goals():
    goal1 = Goal(
        user_id=1,
        title='Complete Project',
        end_date=datetime(2023, 7, 30).date(),
        timeframe=30,
        description='Finish the project before the deadline',
        comments='No specific comments',
    )

    goal2 = Goal(
        user_id=1,
        title='Learn a New Skill',
        end_date=datetime(2023, 12, 31).date(),
        timeframe=365,
        description='Master a new programming language',
        comments='Allocate dedicated time each day for learning',
    )

    goal3 = Goal(
        user_id=1,
        title='Fitness Journey',
        end_date=datetime(2024, 1, 1).date(),
        timeframe=180,
        description='Improve overall fitness and lose weight',
        comments='Follow a balanced diet and exercise regularly',
    )

    goal4 = Goal(
        user_id=1,
        title='Save $5000',
        end_date=datetime(2023, 8, 15).date(),
        timeframe=60,
        description='Put aside $100 a week at least',
        comments='Want to get a new car'
    )

    goal5 = Goal(
        user_id=1,
        title='Read More Books',
        end_date=datetime(2023, 12, 31).date(),
        timeframe=200,
        description='Expand knowledge and read a variety of genres',
        comments='Set aside time for reading every day',
    )

    db.session.add(goal1)
    db.session.add(goal2)
    db.session.add(goal3)
    db.session.add(goal4)
    db.session.add(goal5)
    db.session.commit()


def undo_goals():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.goals RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM goals"))

    db.session.commit()
