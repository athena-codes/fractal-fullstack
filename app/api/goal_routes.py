from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Goal, Todo,  db
from app.forms import GoalForm
goal_routes = Blueprint('goals', __name__)


# Create new goal
@goal_routes.route('/', methods=['POST'])
@login_required
def create_goal():
    form = GoalForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        end_date =  form.end_date.data
        title = form.title.data
        timeframe = form.timeframe.data
        description = form.description.data
        print('FORM DATA -------->', form.data)
        print('TIMEFRAME -------->', timeframe)

        user_id = current_user.id

    # Automatically calculate timeframe value
        # today = datetime.now().date()

        # timeframe = (end_date - today).days
        # timeframe_str = f"{timeframe} days"

        goal = Goal(user_id=user_id, title=title, description=description,
                    end_date=end_date, timeframe=timeframe)

        db.session.add(goal)
        db.session.commit()

        return jsonify(goal.to_dict()), 200
    else:
        # Form validation failed
        errors = form.errors
        return jsonify(errors), 400


# Get details of specific goal
@goal_routes.route('/<goal_id>', methods=['GET'])
@login_required
def get_goal(goal_id):
    goal = Goal.query.get(goal_id)

    if not goal:
        return jsonify({'message': 'Goal not found'}), 404

    if goal.user_id != current_user.id:
       return jsonify({'message': 'Unauthorized'}), 401

    return jsonify(goal.to_dict()), 200


# Update a specific goal
@goal_routes.route('/<goal_id>', methods=['PUT'])
@login_required
def update_goal(goal_id):
    goal = Goal.query.get(goal_id)

    if not goal:
        return jsonify({'message': 'Goal not found'}), 404

    if goal.user_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    goal.title = data.get('title')
    goal.description = data.get('description')
    goal.end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
    goal.timeframe = data.get('timeframe')

    db.session.commit()

    return jsonify(goal.to_dict()), 200


# Delete a Goal
@goal_routes.route('/<goal_id>', methods=['DELETE'])
@login_required
def delete_goal(goal_id):
    goal = Goal.query.get(goal_id)

    if goal:
        if goal.user_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 401

    if not goal:
        return jsonify({'message': 'Goal not found'}), 404

    db.session.delete(goal)
    db.session.commit()

    return jsonify({'message': 'Goal deleted successfully'}), 200


# Get all Current User Goals
@goal_routes.route('/', methods=['GET'])
@login_required
def get_all_goals():
    user_id = current_user.id
    goals = Goal.query.filter_by(user_id=user_id).all()
    goals_data = [goal.to_dict() for goal in goals]

    if not goals_data:
        return jsonify({'message': 'No goals found'}), 404

    return jsonify(goals_data), 200


# Get All To-Dos for a Specific Goal
@goal_routes.route('<int:goal_id>/todos', methods=['GET'])
@login_required
def get_todos_for_goal(goal_id):
    todos = Todo.query.filter_by(goal_id=goal_id).all()

    if not todos:
        return jsonify({'message': 'No to-do items found for the goal'}), 404

    todos_list = [todo.to_dict() for todo in todos]
    response_body = {'goal_id': goal_id, 'todos': todos_list}

    return jsonify(response_body), 200
