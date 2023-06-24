from flask import jsonify, request
from flask import Blueprint, jsonify, request
from flask_login import current_user
from datetime import datetime
from flask_login import login_required
from app.models import Reminder, db


reminder_routes = Blueprint('todos', __name__)
