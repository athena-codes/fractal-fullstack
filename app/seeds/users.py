from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from werkzeug.security import generate_password_hash, check_password_hash
import os


# Adds fake users
def seed_users():
    # Deletes existing users
    undo_users()

    # Add demo user
    demo = User(
        username='Demo',
        email='demo@aa.io',
        password='password',
        profile_picture_url=os.path.join('assets/images', 'user.png'),
        dark_mode_enabled=False
    )
    db.session.add(demo)

    # Manually add random users
    users = [
        {
            'username': 'John',
            'email': 'john@example.com',
            'password': 'password',
            'profile_picture_url': os.path.join('assets/images', 'user.png'),
            'dark_mode_enabled': False
        },
        {
            'username': 'Alice',
            'email': 'alice@example.com',
            'password': 'password',
            'profile_picture_url': os.path.join('assets/images', 'user.png'),
            'dark_mode_enabled': True
        },
        {
            'username': 'Bob',
            'email': 'bob@example.com',
            'password': 'password',
            'profile_picture_url': os.path.join('assets/images', 'user.png'),
            'dark_mode_enabled': False
        },
        {
            'username': 'Emily',
            'email': 'emily@example.com',
            'password': 'password',
            'profile_picture_url': os.path.join('assets/images', 'user.png'),
            'dark_mode_enabled': True
        },
        {
            'username': 'Michael',
            'email': 'michael@example.com',
            'password': 'password',
            'profile_picture_url': os.path.join('assets/images', 'user.png'),
            'dark_mode_enabled': False
        }
    ]

    for user_data in users:
        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            profile_picture_url=user_data['profile_picture_url'],
            dark_mode_enabled=user_data['dark_mode_enabled']
        )
        db.session.add(user)

    db.session.commit()


# Rest of the code remains the same...

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
