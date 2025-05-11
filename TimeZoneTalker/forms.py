from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField, HiddenField
from wtforms.validators import DataRequired, Email, EqualTo, Length, ValidationError
import pytz

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=3, max=64)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=6)])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    timezone = SelectField('Timezone', choices=[(tz, tz) for tz in pytz.common_timezones], default='UTC')
    submit = SubmitField('Register')

class ProjectForm(FlaskForm):
    name = StringField('Project Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description')
    color = StringField('Color', default='#6c757d')
    submit = SubmitField('Save Project')

class TaskForm(FlaskForm):
    name = StringField('Task Name', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description')
    project_id = SelectField('Project', coerce=int, validators=[DataRequired()])
    submit = SubmitField('Save Task')

class TimeEntryForm(FlaskForm):
    project_id = SelectField('Project', coerce=int, validators=[DataRequired()])
    task_id = SelectField('Task', coerce=int)
    description = TextAreaField('Description')
    submit = SubmitField('Start Timer')

class TimeEntryEditForm(FlaskForm):
    project_id = SelectField('Project', coerce=int, validators=[DataRequired()])
    task_id = SelectField('Task', coerce=int)
    description = TextAreaField('Description')
    duration = StringField('Duration (HH:MM:SS)', validators=[DataRequired()])
    status = SelectField('Status', choices=[
        ('running', 'Running'),
        ('paused', 'Paused'),
        ('completed', 'Completed')
    ])
    submit = SubmitField('Update')

class TimezoneConverterForm(FlaskForm):
    source_timezone = SelectField('From Timezone', choices=[(tz, tz) for tz in pytz.common_timezones], default='UTC')
    target_timezone = SelectField('To Timezone', choices=[(tz, tz) for tz in pytz.common_timezones], default='UTC')
    date_time = StringField('Date and Time (YYYY-MM-DD HH:MM)', validators=[DataRequired()])
    submit = SubmitField('Convert')
