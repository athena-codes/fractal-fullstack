from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class DailyPlanner(db.Model):
    __tablename__ = 'daily_planner'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(
        add_prefix_for_prod('users.id')), nullable=False)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='daily_panners')
    time_slots = db.relationship('DailyPlannerSlot', back_populates='daily_planner')

    def __init__(self, user_id, date):
        self.user_id = user_id
        self.date = date

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'time_slots': [slot.to_dict() for slot in self.time_slots]
        }
