from flask import Blueprint, current_app, jsonify, session, request, redirect, url_for
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from datetime import datetime, date
from threading import Semaphore
from flask import g
from ..utils import generate_monthly_daily_planners, generate_daily_planner_slots_for_user
from flask_login import current_user, login_user, logout_user, login_required
import os
from werkzeug.utils import secure_filename

auth_routes = Blueprint('auth', __name__)

# Create a semaphore with an initial count of 1
lock = Semaphore(1)


def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        credential = form.data['credential']
        user = User.query.filter(
            (User.email == credential) | (User.username == credential)
        ).first()
        login_user(user)
        return user.to_dict()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        profile_picture = request.files.get('profilePicture')  # Retrieve the profile picture file

        if profile_picture:
            filename = secure_filename(profile_picture.filename)
            profile_picture_path = os.path.join('profile_pictures', filename)
            # s3.upload_fileobj(profile_picture, current_app.config['AWS_S3_BUCKET'], profile_picture_path)
            # profile_picture_url = s3.generate_presigned_url('get_object', Params={'Bucket': current_app.config['AWS_S3_BUCKET'], 'Key': profile_picture_path})
        else:
            profile_picture_url = None

        user = User(
            username=form.data['username'],
            full_name=form.data['full_name'],
            email=form.data['email'],
            password=form.data['password'],
            profile_picture_url=profile_picture_url
        )

        db.session.add(user)
        db.session.commit()

        login_user(user)

        current_date = date.today()

        # Generate daily planners for the user
        generate_monthly_daily_planners(user, current_date)

        # Redirect the user to generate the daily planner slots
        return redirect(url_for('auth.generate_daily_planner_slots', user_id=user.id))

    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/generate_daily_planner_slots/<int:user_id>', methods=['GET'])
def generate_daily_planner_slots(user_id):
    user = User.query.get(user_id)

    if user is not None:
        generate_daily_planner_slots_for_user(
            user_id)  # Pass the user_id instead of user

        return redirect(url_for('auth.authenticate'))

    return {'message': 'User not found.'}, 404



@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
