from datetime import datetime, time, timedelta
from app.models import db, DailyPlannerSlot, DailyPlanner, environment, SCHEMA
from sqlalchemy.sql import text
from ..utils import generate_time_slots
import os


def seed_daily_planner_slots():
    daily_planners = DailyPlanner.query.all()

    for daily_planner in daily_planners:
        existing_slots = len(daily_planner.time_slots)
        # Calculate the number of slots to seed
        num_slots_to_seed = 24 - existing_slots

        if num_slots_to_seed <= 0:
            continue

        start_time = time(0, 0)
        end_time = time(0, 0)

        current_time = start_time

        for _ in range(num_slots_to_seed):
            next_time = (datetime.combine(
                datetime.min, current_time) + timedelta(hours=1)).time()

            daily_planner_slot = DailyPlannerSlot(
                user_id=1,
                todo_id=None,
                start_time=current_time,
                end_time=next_time,
                daily_planner=daily_planner,
            )
            db.session.add(daily_planner_slot)
            # Add the time slot to the daily planner's time_slots relationship
            daily_planner.time_slots.append(daily_planner_slot)

            current_time = next_time

    db.session.commit()



def undo_daily_planner_slots():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.daily_planner_slots RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM daily_planner_slots"))

    db.session.commit()
