from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime


class Goal(db.Model):
    __tablename__ = 'goals'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        'users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    end_date = db.Column(db.Date)
    timeframe = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String)
    comments = db.Column(db.String)
    progress = db.Column(db.Numeric(5, 2), default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='goals',
                           lazy=True, foreign_keys=[user_id])
    todos = db.relationship('Todo', back_populates='goal', lazy=True)

    def __init__(self, user_id, title, timeframe, description=None, end_date=None, comments=None):
        self.user_id = user_id
        self.title = title
        self.timeframe = timeframe
        self.description = description
        self.end_date = end_date
        self.comments = comments

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'end_date': self.end_date,
            'timeframe': self.timeframe,
            'description': self.description,
            'comments': self.comments,
            'progress': self.progress,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
