from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Todo(db.Model):
    __tablename__ = 'todos'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    priority = db.Column(db.Integer)
    description = db.Column(db.String)
    notes = db.Column(db.String)
    reminder = db.Column(db.Boolean)
    completed = db.Column(db.Boolean)
    goal_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('goals.id')))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    goal = db.relationship('Goal', back_populates='todos')
    reminders = db.relationship('Reminder', back_populates='todo')
    time_slots = db.relationship(
        'DailyPlannerSlot', back_populates='todo')

    def __init__(self, name, priority=None, description=None, notes=None, reminder=False, completed=False):
        self.name = name
        self.priority = priority
        self.description = description
        self.notes = notes
        self.reminder = reminder
        self.completed = completed

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'priority': self.priority,
            'description': self.description,
            'notes': self.notes,
            'reminder': self.reminder,
            'completed': self.completed,
            'goal_id': self.goal_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'goal': self.goal.to_dict() if self.goal else None,
            'reminders': [reminder.to_dict() for reminder in self.reminders],
            'time_slots': [slot.to_dict() for slot in self.time_slots]
        }
