from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired, ValidationError, Length, Regexp
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user:
        raise ValidationError('Username is already in use.')

def validate_email(form, field):
    email = field.data
    valid_endings = ['.com', '.net']  # Add more valid endings if needed
    if not email.endswith(tuple(valid_endings)):
        raise ValidationError('Invalid email format')


class SignUpForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired('Full name is required')])
    username = StringField('Username', validators=[DataRequired('Username is required'), Length(min=5), username_exists])
    email = StringField('Email', validators=[DataRequired('Email is required'), user_exists, validate_email])
    password = PasswordField('Password', validators=[DataRequired('Password is required'), Length(min=8)])
    profile_picture = FileField('Profile Picture', validators=[DataRequired('Please upload a profile photo'), FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')])


#  PASSWORD VALIDATION
#  Regexp(r'[A-Za-z0-9@#$%^&+=]+[A-Z]+[0-9]+', message='Password must contain at least 1 uppercase letter and 1 number')
