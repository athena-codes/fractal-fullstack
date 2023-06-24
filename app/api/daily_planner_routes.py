from flask import jsonify, request
from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import DailyPlanner, DailyPlannerSlot, db


daily_planner_routes = Blueprint('daily_planners', __name__)


# Get Daily Planner for a specific date
@daily_planner_routes.route('/<date>', methods=['GET'])
@login_required
def get_daily_planner(date):
    user_id = current_user.id
    daily_planner = DailyPlanner.query.filter_by(user_id=user_id, date=date).first()

    if not daily_planner:
        return jsonify({'message': 'Daily planner not found'}), 404

    return jsonify(daily_planner.to_dict()), 200

# Get Time Slots for a Daily Planner


@daily_planner_routes.route('/<date>/slots', methods=['GET'])
@login_required
def get_daily_planner_slots(date):
    user_id = current_user.id
    daily_planner_slots = DailyPlannerSlot.query.filter_by(
        user_id=user_id).all()

    if not daily_planner_slots:
        return jsonify({'message': 'No time slots found for the specified date'}), 404

    slots = [slot.to_dict() for slot in daily_planner_slots]
    return jsonify({'slots': slots}), 200
