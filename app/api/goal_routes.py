from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Goal, db

goal_routes = Blueprint('goals', __name__)


# Create new goal
@goal_routes.route('/', methods=['POST'])
def create_goal():
    if not current_user.is_authenticated:
        return jsonify(error='User not authenticated'), 401

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
    timeframe = data.get('timeframe')

    user_id = current_user.id

    goal = Goal(user_id=user_id, title=title, description=description,
                end_date=end_date, timeframe=timeframe)

    db.session.add(goal)
    db.session.commit()

    return jsonify(goal.to_dict()), 200
