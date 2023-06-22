from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class DailyPlannerSlot(db.Model):
    __tablename__ = 'daily_planner_slots'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), nullable=False)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    daily_planner_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('daily_planner.id')), nullable=False)
    todo_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('todos.id')))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='daily_planner_slots')
    daily_planner = db.relationship(
        'DailyPlanner', back_populates='time_slots')
    todo = db.relationship('Todo', back_populates='time_slots')

    def __init__(self, user_id, start_time, end_time, daily_planner, todo=None): 
        self.user_id = user_id
        self.start_time = start_time
        self.end_time = end_time
        self.daily_planner = daily_planner
        self.todo = todo

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'start_time': self.start_time.strftime('%H:%M') if self.start_time else None,
            'end_time': self.end_time.strftime('%H:%M') if self.end_time else None,
            'daily_planner_id': self.daily_planner_id,
            'todo_id': self.todo_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
