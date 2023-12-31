from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Reminder(db.Model):
    __tablename__ = 'reminders'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), nullable=False)
    todo_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('todos.id')))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='reminders')
    todo = db.relationship('Todo', back_populates='reminders')


    def __init__(self, user_id, todo_id):
        self.user_id = user_id
        self.todo_id = todo_id

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'todo_id': self.todo_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'todo': self.todo.to_dict() if self.todo else None
        }
