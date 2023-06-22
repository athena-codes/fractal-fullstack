from datetime import datetime, timedelta
from app.models import db, DailyPlanner, environment, SCHEMA
from sqlalchemy.sql import text
import calendar
import os


def seed_daily_planners():
    start_date = datetime.now().date()
    current_month = start_date.month
    current_year = start_date.year
    next_month = current_month + 1 if current_month < 12 else 1
    next_year = current_year if current_month < 12 else current_year + 1

    current_month_end = calendar.monthrange(current_year, current_month)[1]
    next_month_end = calendar.monthrange(next_year, next_month)[1]

    date_range = (
        start_date + timedelta(days=x)
        for x in range(current_month_end - start_date.day + 1)
    )

    for date in date_range:
        daily_planner = DailyPlanner(user_id=1, date=date)
        db.session.add(daily_planner)

    next_month_start_date = datetime(next_year, next_month, 1).date()
    next_month_date_range = (
        next_month_start_date + timedelta(days=x)
        for x in range(next_month_end)
    )

    for date in next_month_date_range:
        daily_planner = DailyPlanner(user_id=1, date=date)
        db.session.add(daily_planner)

    db.session.commit()
    

def undo_daily_planners():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_planner RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_planner"))

    db.session.commit()
