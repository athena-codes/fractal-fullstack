from flask import jsonify, request
from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Reminder, Todo, db


reminder_routes = Blueprint('reminders', __name__)

# Create a new Reminder for a Todo item
@reminder_routes.route('/', methods=['POST'])
@login_required
def create_reminder():
    data = request.get_json()
    todo_id = data.get('todo_id')

    todo = Todo.query.filter_by(id=todo_id, user_id=current_user.id).first()

    if not todo:
        return jsonify({'message': 'To-do not found'}), 404

    if todo.user_id != current_user.id:
       return jsonify({'message': 'Unauthorized'}), 401

    reminder = Reminder(user_id=current_user.id, todo_id=todo_id)

    db.session.add(reminder)
    db.session.commit()

    return jsonify(reminder.to_dict()), 200


# Get details for a specific Reminder
@reminder_routes.route('/<int:reminder_id>', methods=['GET'])
@login_required
def get_reminder_details(reminder_id):
    reminder = Reminder.query.get(reminder_id)

    if not reminder:
        return jsonify({'message': 'Reminder not found'}), 404

    if reminder.user_id != current_user.id:
       return jsonify({'message': 'Unauthorized'}), 401

    return jsonify(reminder.to_dict()), 200


# Update details of a specific reminder
@reminder_routes.route('/<int:reminder_id>', methods=['PUT'])
@login_required
def update_reminder_details(reminder_id):
    reminder = Reminder.query.get(reminder_id)

    if not reminder:
        return jsonify({'message': 'Reminder not found'}), 404

    if reminder.user_id != current_user.id:
       return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    todo_id = data.get('todo_id')

    reminder.todo_id = todo_id
    reminder.updated_at = datetime.utcnow()

    db.session.commit()

    return jsonify(reminder.to_dict()), 200


# Delete a Reminder
@reminder_routes.route('/<int:reminder_id>', methods=['DELETE'])
@login_required
def delete_reminder(reminder_id):
    reminder = Reminder.query.get(reminder_id)

    if not reminder:
        return jsonify({'message': 'Reminder not found'}), 404

    if reminder.user_id != current_user.id:
       return jsonify({'message': 'Unauthorized'}), 401

    db.session.delete(reminder)
    db.session.commit()

    return jsonify({'message': f'Reminder with ID {reminder_id} has been deleted successfully.'}), 200


# Get all Reminders for Current User
@reminder_routes.route('/', methods=['GET'])
@login_required
def get_all_reminders_for_user():
    user_id = current_user.id
    reminders = Reminder.query.filter_by(user_id=user_id).all()

    if not reminders:
        return jsonify({'message': 'No reminders found for the user'}), 404

    reminders_list = [reminder.to_dict() for reminder in reminders]
    response_body = {'reminders': reminders_list}

    return jsonify(response_body), 200
