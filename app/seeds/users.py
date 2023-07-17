from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
import os

def seed_users():
    image_filename = 'sample-profile-picture.png'
    image_url = '/assets/images/' + image_filename
    hermoine = User(
        full_name='Hermoine Granger',
        username='hgranger',
        email='griffindor22@hogwarts.com',
        password='password',
        profile_picture_url="https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        dark_mode_enabled=False)
    jane = User(
        full_name='Jane Doe',
        username='justjane',
        email='jane@example.com',
        password='password',
        profile_picture_url=os.path.join('assets/images', 'sample-profile-picture.png'),
        dark_mode_enabled=False)

    db.session.add(hermoine)
    db.session.add(jane)
    db.session.commit()


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
