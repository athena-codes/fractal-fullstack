from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_login import UserMixin
import os

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    profile_picture_url = db.Column(db.String(255))
    dark_mode_enabled = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    goals = db.relationship('Goal', back_populates='user', lazy=True)
    todos = db.relationship('Todo', back_populates='user', lazy=True)
    reminders = db.relationship('Reminder', back_populates='user', lazy=True)
    daily_planners = db.relationship('DailyPlanner', back_populates='user', lazy=True)
    daily_planner_slots = db.relationship(
        'DailyPlannerSlot', back_populates='user', lazy=True)


    def __init__(self, full_name, username, email, password, profile_picture_url=None, dark_mode_enabled=False):
            self.full_name = full_name
            self.username = username
            self.email = email
            self.password = generate_password_hash(password)
            self.profile_picture_url = profile_picture_url or os.path.join('assets/images', 'user.png')
            self.dark_mode_enabled = dark_mode_enabled

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'username': self.username,
            'email': self.email,
            'profile_picture_url': self.profile_picture_url,
            'dark_mode_enabled': self.dark_mode_enabled,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'goals': [goal.to_dict() for goal in self.goals],
            'todos': [todo.to_dict() for todo in self.todos],
            'reminders': [reminder.to_dict() for reminder in self.reminders]
        }
