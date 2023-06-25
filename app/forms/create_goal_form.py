from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, TextAreaField, DateField, HiddenField
from wtforms.validators import DataRequired

class GoalForm(FlaskForm):
    
    title = StringField('Title', validators=[DataRequired()])
    description = TextAreaField('Description')
    end_date = DateField('End Date', validators=[DataRequired()])
    timeframe = IntegerField('Timeframe', validators=[DataRequired()])
