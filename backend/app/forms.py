from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, FileField
from wtforms.validators import DataRequired, Email, Length, ValidationError, Optional
from app.models import User

class RegistrationForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired(), Length(min=4, max=64)])
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8)])
    email = StringField('Email', validators=[DataRequired(), Email()])
    firstname = StringField('First Name', validators=[Optional(), Length(max=64)])
    lastname = StringField('Last Name', validators=[Optional(), Length(max=64)])
    location = StringField('Location', validators=[Optional(), Length(max=255)])
    profile_photo = FileField('Profile Photo')
    
    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username is already taken. Please choose a different one.')
    
    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email is already registered. Please use a different one.')

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

