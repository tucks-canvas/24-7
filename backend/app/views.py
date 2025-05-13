"""
Flask Documentation:     https://flask.palletsprojects.com/
Jinja2 Documentation:    https://jinja.palletsprojects.com/
Werkzeug Documentation:  https://werkzeug.palletsprojects.com/

This file creates your application.
"""


import os
import jwt
import secrets
from datetime import datetime, timedelta
from functools import wraps
from datetime import datetime
from app import app, db, login_manager
from flask import render_template, request, jsonify, send_file, session, send_from_directory, url_for, redirect, g
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from app.forms import LoginForm, RegistrationForm, NewPostForm
from app.models import User, Post, Follow, Like
from flask_wtf.csrf import generate_csrf


##
# Functions for authorisation.
##

# 
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) # or request.cookies.get('token', None)

    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])

    except jwt.ExpiredSignatureError:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated


# 
@app.route('/')
def index():
    return jsonify(message="This is the beginning of our API")


#
@app.route('/api/v1/register', methods=['POST'])
def register():
    
    """Accepts user information and saves it to the database"""
    registrationForm = RegistrationForm()

    if registrationForm.validate_on_submit():
        # Extract form data
        username = registrationForm.username.data
        password = registrationForm.password.data
        firstname = registrationForm.firstname.data
        lastname = registrationForm.lastname.data
        email = registrationForm.email.data
        location = registrationForm.location.data
        biography = registrationForm.biography.data
        photo = registrationForm.profile_photo.data
        
        if photo:
            # Save the profile photo to the uploads folder
            filename = secure_filename(photo.filename)
            photo.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        else:
            filename = ''  # Set a default value if no photo is uploaded
        
        joined_on = datetime.utcnow()
        
        # Create a new User object with the profile photo path
        user = User(username, password, firstname, lastname, email, location, biography, filename, joined_on)

        # Add the user to the session and commit
        db.session.add(user)
        db.session.commit()

        return jsonify({
            "message": "User successfully registered.",
            "username": username,
            "password": password,
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "location": location,
            "profile_photo": filename,  # Send the path instead of the FileStorage object
            "joined_on": joined_on
        }), 201

    errors = form_errors(registrationForm)
    return jsonify(errors=errors), 400


# 
@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    
    """Accepts login credentials as username and password"""
    loginForm = LoginForm()

    if loginForm.validate_on_submit():
        username = loginForm.username.data
        password = loginForm.password.data
        
        user = db.session.execute(db.select(User).filter_by(username=username)).scalar()
        
        if user is not None and check_password_hash(user.password, password):
            login_user(user)
            jwt_token = generate_token(user.id)
        
            return jsonify({
                "message": "User successfully logged in.",
                "token": jwt_token
            }), 200
        
        return jsonify(errors=["Invalid username or password"])
    
    errors = form_errors(loginForm)
    return jsonify(errors=errors), 400


# Define the logout route
@app.route('/api/v1/auth/logout', methods=['POST'])
@login_required  # Ensure the user is logged in to log out
def logout():
    try:
        # Perform logout operations
        logout_user()  # Log out the user
        
        # Return a success message
        return jsonify({"message": "User successfully logged out."}), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({"error": "Logout failed", "details": str(e)}), 500


##
# Functions for post creation and retrieval.
##

# 
@login_manager.user_loader
def load_user(user_id):
    # Query the database for the user by user ID
    return User.query.get(int(user_id))

@app.route('/api/v1/users/<int:user_id>', methods=['GET'])
@login_required
@requires_auth
def get_user_details(user_id):

    # Ensure user_id is a valid integer
    user_details = db.session.execute(db.select(User).filter_by(id=int(user_id))).scalar()

    if not user_details:
        return jsonify({"error": "User not found"}), 404

    # Return user details and other information
    return jsonify({
        "id": user_details.id,
        "username": user_details.username,
        "firstname": user_details.firstname,
        "lastname": user_details.lastname,
        "email": user_details.email,
        "location": user_details.location,
        "profile_photo": url_for('get_photo', filename=user_details.profile_photo),
        "joined_on": user_details.joined_on.strftime('%B %Y'),
    }), 200
    

##
# Functions for token creation in API's and Web Forms.
##


# API route for retrieving CSRF token
@app.route('/api/v1/csrf-token', methods=['GET'])
def get_csrf():
    try:
        csrf_token = generate_csrf()  # Ensure this function call works correctly
        return jsonify({'csrf_token': csrf_token})  # Return valid JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Catch any errors and return 500


# API route for generatiing JWT token
def generate_token(uid):
    timestamp = datetime.utcnow()
    payload = {
        "subject": uid,
        "iat": timestamp,
        "exp": timestamp + timedelta(minutes=60)
    }
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return token


##
# Functions for file handling.
##


# API route for serving uploaded photos
@app.route('/api/v1/photos/<filename>')
def get_photo(filename):
    return send_from_directory(os.path.join(os.getcwd(), app.config['UPLOAD_FOLDER']), filename)

##
# Functions for error, and request handling.
##


# Error function for form.
def form_errors(form):
    error_messages = []
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)
    return error_messages


# Handle 404 Not Found errors
@app.errorhandler(404)
def page_not_found(error):
    return jsonify({'error': 'Not found'}), 404


# Handle 500 Internal Server Error
@app.errorhandler(500)
def internal_server_error(error):
    return jsonify({'error': 'Internal server error'}), 500