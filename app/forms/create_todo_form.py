from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, BooleanField
from wtforms.validators import DataRequired


class TodoForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired()])
    priority = IntegerField('Priority')
    description = TextAreaField('Description')
    notes = TextAreaField('Notes')
    reminder = BooleanField('Reminder')
    completed = BooleanField('Completed')
    goal_id = IntegerField('Goal ID')
