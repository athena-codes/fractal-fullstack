from flask import jsonify, request
from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Todo, db

todo_routes = Blueprint('todos', __name__)


# Create a new To-do
@todo_routes.route('/', methods=['POST'])
@login_required
def create_todo():
    data = request.get_json()
    name = data.get('name')
    priority = data.get('priority')
    description = data.get('description')
    notes = data.get('notes')
    reminder = data.get('reminder')
    completed = data.get('completed')
    goal_id = data.get('goal_id')
    # daily_planner_slot_id = data.get('daily_planner_slot_id')


    todo = Todo(user_id=current_user.id, goal_id=goal_id, name=name, priority=priority,
                description=description, notes=notes, reminder=reminder, completed=completed)

    db.session.add(todo)
    db.session.commit()

    return jsonify(todo.to_dict()), 200


# Get details of specific to-do
@todo_routes.route('/<int:todo_id>', methods=['GET'])
@login_required
def get_todo_details(todo_id):
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'message': 'To-do not found'}), 404

    return jsonify(todo.to_dict()), 200


# Update details of a specific to-do
@todo_routes.route('/<int:todo_id>', methods=['PUT'])
@login_required
def update_todo_details(todo_id):
    todo = Todo.query.get(todo_id)

    if not todo:
        return jsonify({'message': 'To-do not found'}), 404

    if todo.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()

    todo.name = data.get('name', todo.name)
    todo.priority = data.get('priority', todo.priority)
    todo.description = data.get('description', todo.description)
    todo.notes = data.get('notes', todo.notes)
    todo.reminder = data.get('reminder', todo.reminder)
    todo.completed = data.get('completed', todo.completed)
    todo.goal_id = data.get('goal_id', todo.goal_id)
    # todo.daily_planner_slot_id = data.get(
    #     'daily_planner_slot_id', todo.daily_planner_slot_id)

    db.session.commit()

    return jsonify(todo.to_dict()), 200


# Delete a To-do
@todo_routes.route('/<int:todo_id>', methods=['DELETE'])
@login_required
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)

    if todo.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 401

    if not todo:
        return jsonify({'message': 'To-do not found'}), 404

    db.session.delete(todo)
    db.session.commit()

    return jsonify({'message': f'To-Do with ID {todo_id} has been deleted successfully.'}), 200



# Get all Current User Todo's
@todo_routes.route('/', methods=['GET'])
@login_required
def get_all_todos_for_user():
    user_id = current_user.id
    todos = Todo.query.filter_by(user_id=user_id).all()
    todos_data = [todo.to_dict() for todo in todos]

    if not todos:
        return jsonify({'message': 'No to-do items found for the user'}), 404

    return jsonify(todos_data), 200
