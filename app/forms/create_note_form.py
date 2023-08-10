from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length

class NoteForm(FlaskForm):
    content = StringField('Content', validators=[DataRequired(), Length(max=255)])
    title = StringField('Title', validators=[DataRequired() ,Length(max=40)])
