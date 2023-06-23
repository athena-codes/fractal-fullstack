# Utils file to store helper functions to be used app wider
from datetime import datetime, timedelta, time
from app.models import DailyPlanner, DailyPlannerSlot, db
import calendar


def generate_time_slots():
    start_time = time(0, 0)
    end_time = time(0, 0)

    time_slots = []

    current_time = start_time
    while current_time != end_time:
        next_time = (datetime.combine(
            datetime.min, current_time) + timedelta(hours=1)).time()
        time_slots.append((current_time.strftime(
            '%H:%M'), next_time.strftime('%H:%M')))
        current_time = next_time

    return time_slots


def generate_monthly_daily_planners(user, start_date):
    current_month = start_date.month
    current_year = start_date.year
    next_month = current_month + 1 if current_month < 12 else 1
    next_year = current_year if current_month < 12 else current_year + 1

    current_month_end = calendar.monthrange(current_year, current_month)[1]
    next_month_end = calendar.monthrange(next_year, next_month)[1]

    end_date = datetime(next_year, next_month, next_month_end).date()

    while start_date <= end_date:
        daily_planner = DailyPlanner(user_id=user.id, date=start_date)
        db.session.add(daily_planner)
        db.session.commit()  # Commit to generate the daily_planner.id

        start_date += timedelta(days=1)


def generate_daily_planner_slots_for_user(user_id):
    daily_planners = DailyPlanner.query.filter_by(user_id=user_id).all()

    for daily_planner in daily_planners:
        existing_slots = len(daily_planner.time_slots)
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
                user_id=user_id,
                start_time=current_time,
                end_time=next_time,
                daily_planner=daily_planner,
                todo=None
            )
            db.session.add(daily_planner_slot)
            daily_planner.time_slots.append(daily_planner_slot)

            current_time = next_time

    db.session.commit()
