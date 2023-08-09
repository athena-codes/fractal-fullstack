from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired


class ReminderForm(FlaskForm):
    todo_id = IntegerField('Todo ID', validators=[DataRequired()])
