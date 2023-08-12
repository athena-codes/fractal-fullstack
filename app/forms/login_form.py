from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    identifier = field.data
    user = User.query.filter(
        (User.email == identifier) | (User.username == identifier)
    ).first()
    if not user:
        raise ValidationError('Username or email not found.')



def password_matches(form, field):
    # Checking if password matches
    password = field.data
    email = form.data['credential']
    username = form.data['credential']
    user = User.query.filter((User.email == email) |  (User.username == username)).first()
    if not user:
        raise ValidationError('No such user exists.')
    if not user.check_password(password):
        raise ValidationError('Password was incorrect.')


class LoginForm(FlaskForm):
    credential = StringField('Username/Email', validators=[DataRequired('Username or email is required.'), user_exists])
    password = PasswordField('Password', validators=[DataRequired('Password is required.'), password_matches])
