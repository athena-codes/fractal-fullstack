from flask import jsonify, request
from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import DailyPlanner, DailyPlannerSlot, Todo, db

daily_planner_routes = Blueprint('daily_planners', __name__)

# Get all Daily Planners for current user
@daily_planner_routes.route('/', methods=['GET'])
def get_daily_planners():
    user_id = current_user.id  
    daily_planners = DailyPlanner.query.filter_by(user_id=user_id).all()
    daily_planner_slots = DailyPlannerSlot.query.filter_by(user_id=user_id).all()
    daily_planners_data = [daily_planner.to_dict() for daily_planner in daily_planners]
    return jsonify(daily_planners_data), 200


# Get Daily Planner for a specific date
@daily_planner_routes.route('/<dailyPlannerId>', methods=['GET'])
@login_required
def get_daily_planner(dailyPlannerId):
    user_id = current_user.id
    daily_planner = DailyPlanner.query.filter_by(user_id=user_id, id=dailyPlannerId).first()

    if not daily_planner:
        return jsonify({'message': 'Daily planner not found'}), 404

    return jsonify(daily_planner.to_dict()), 200


# Get Time Slots for a Daily Planner
@daily_planner_routes.route('/<dailyPlannerId>/slots', methods=['GET'])
@login_required
def get_daily_planner_slots(dailyPlannerId):
    user_id = current_user.id
    daily_planner_slots = DailyPlannerSlot.query.filter_by(user_id=user_id, daily_planner_id=dailyPlannerId).all()

    if not daily_planner_slots:
        return jsonify({'message': 'No time slots found for the specified date'}), 404

    slots = [slot.to_dict() for slot in daily_planner_slots]
    return jsonify({'slots': slots}), 200


# Get specific Time Slot for a Daily Planner
@daily_planner_routes.route('/<dailyPlannerId>/slots/<int:slot_id>', methods=['GET'])
@login_required
def get_daily_planner_slot_by_id(dailyPlannerId, slot_id):
    user_id = current_user.id
    daily_planner_slot = DailyPlannerSlot.query.filter_by(
        user_id=user_id, daily_planner_id=dailyPlannerId, id=slot_id).all()

    if not daily_planner_slot :
        return jsonify({'message': 'No time slot found'}), 404

    slots = [slot.to_dict() for slot in daily_planner_slot]
    return jsonify({'slots': slots}), 200


 # Add ToDo to a time slot
@daily_planner_routes.route('/<dailyPlannerId>/slots/<slot_id>', methods=['PUT'])
@login_required
def assign_todo_to_slot(dailyPlannerId, slot_id):
    user_id = current_user.id

    daily_planner_slot = DailyPlannerSlot.query.filter_by(
        id=slot_id, user_id=user_id, daily_planner_id=dailyPlannerId).first()

    if not daily_planner_slot:
        return jsonify({'message': 'Daily planner slot not found'}), 404

    todo_id = request.json.get('todo_id')
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()

    if not todo:
        return jsonify({'message': 'To-do not found'}), 404

    daily_planner_slot.todo_id = todo.id
    db.session.commit()

    return jsonify({"time_slot": daily_planner_slot.to_dict()}), 200
