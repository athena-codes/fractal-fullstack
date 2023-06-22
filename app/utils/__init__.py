# Utils file to store helper functions to be used app wide.

from datetime import datetime, timedelta
from app.models import DailyPlanner, DailyPlannerSlot, db
from app.seeds.daily_planner_slots import generate_time_slots
import calendar


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

        time_slots = generate_time_slots()
        for start_time, end_time in time_slots:
            daily_planner_slot = DailyPlannerSlot(
                user_id=user.id,
                start_time=datetime.strptime(start_time, '%H:%M').time(),
                end_time=datetime.strptime(end_time, '%H:%M').time(),
                daily_planner=daily_planner
            )
            db.session.add(daily_planner_slot)

        start_date += timedelta(days=1)

    db.session.commit()
