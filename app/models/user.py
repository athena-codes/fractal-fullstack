from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
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
    created_at = db.Column(db.DateTime, nullable=False)
    updated_at = db.Column(db.DateTime, nullable=False)

    def __init__(self, username, email, password, profile_picture_url=None, dark_mode_enabled=False):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)
        self.profile_picture_url = profile_picture_url or os.path.join(
            'assets/images', 'user.png')
        self.dark_mode_enabled = dark_mode_enabled

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_picture_url': self.profile_picture_url,
            'dark_mode_enabled': self.dark_mode_enabled,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
