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

from app.forms import LoginForm, RegistrationForm
from app.models import User

from flask_wtf.csrf import generate_csrf

from itsdangerous import URLSafeTimedSerializer
from flask_mail import Message
from app import mail


##
# Functions for authorisation.
##

def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None) 

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


# Define the default route
@app.route('/')
def index():
    return jsonify(message="This is the beginning of our API")

#
@app.route('/api/v1/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)
        
        required_fields = ['username', 'password', 'email']
        missing = [field for field in required_fields if field not in data]
        if missing:
            return jsonify({
                "error": "Missing required fields",
                "missing": missing
            }), 400
            
        if User.query.filter_by(username=data['username']).first():
            return jsonify({"error": "Username already exists"}), 400
            
        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already exists"}), 400
        
        user = User(
            username=data['username'],
            password=data['password'],
            email=data['email'],
            firstname=data.get('firstname'),
            lastname=data.get('lastname'),
            location=data.get('location')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "firstname": user.firstname,
                "lastname": user.lastname,
                "location": user.location
            }
        }), 201
        
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Database operation failed", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Registration failed", "details": str(e)}), 400


# Define the login route
@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    loginForm = LoginForm()
    
    if loginForm.validate_on_submit():
        email = loginForm.email.data
        password = loginForm.password.data
        
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            jwt_token = generate_token(user.id)
            
            return jsonify({
                "message": "User successfully logged in.",
                "token": jwt_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }), 200
        
        return jsonify({"error": "Invalid email or password"}), 401
    
    errors = form_errors(loginForm)
    return jsonify({"error": "Validation failed", "details": errors}), 400

# Define the logout route
@app.route('/api/v1/auth/logout', methods=['POST'])
@login_required 
def logout():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Missing or invalid authorization header"}), 401
            
        logout_user()
        
        return jsonify({
            "message": "User successfully logged out.",
            "success": True
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Logout failed",
            "details": str(e),
            "success": False
        }), 500

##
# Functions for password reset
##

#
@app.route('/auth/request-password-reset', methods=['POST'])
def request_reset():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    
    if user:
        reset_code = ''.join([str(random.randint(0, 9)) for _ in range(4)])
        expiration = datetime.utcnow() + timedelta(minutes=15)
        
        user.reset_code = reset_code
        user.reset_code_expiration = expiration
        db.session.commit()
        
        msg = Message(
            "Your Password Reset Code",
            recipients=[email],
            body=f"Your verification code is: {reset_code}"
        )
        mail.send(msg)
    
    return jsonify({"message": "If email exists, code was sent"}), 200

#
@app.route('/auth/verify-reset-code', methods=['POST'])
def verify_code():
    email = request.json.get('email')
    token = request.json.get('token')
    user = User.query.filter_by(email=email).first()
    
    if not user or user.reset_code != token:
        return jsonify({"error": "Invalid code"}), 400
        
    if user.reset_code_expiration < datetime.utcnow():
        return jsonify({"error": "Code expired"}), 400
        
    s = Serializer(current_app.config['SECRET_KEY'], expires_in=3600)
    token = s.dumps({'user_id': user.id}).decode('utf-8')
    
    return jsonify({"token": token}), 200

#
@app.route('/auth/reset-password', methods=['POST'])
def reset_password():
    token = request.json.get('token')
    new_password = request.json.get('new_password')
    
    try:
        s = Serializer(current_app.config['SECRET_KEY'])
        data = s.loads(token)
    except:
        return jsonify({"error": "Invalid token"}), 400
    
    user = User.query.get(data['user_id'])
    if user:
        user.password = generate_password_hash(new_password)
        user.reset_code = None
        db.session.commit()
        return jsonify({"message": "Password updated"}), 200
    
    return jsonify({"error": "User not found"}), 404


##
# Functions for login management
##

# Define the login manager route
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


##
# Functions for user management
##

@app.route('/api/v1/users/<int:user_id>', methods=['GET', 'PATCH'])
@login_required
def user_profile(user_id):
    try:
        # Verify the requested user matches the logged-in user
        if current_user.id != user_id:
            return jsonify({"error": "Unauthorized access"}), 403
            
        if request.method == 'PATCH':
            data = request.get_json()
            
            # Update only the fields that are provided
            if 'firstname' in data:
                current_user.firstname = data['firstname']
            if 'lastname' in data:
                current_user.lastname = data['lastname']
            if 'location' in data:
                current_user.location = data['location']
                
            db.session.commit()
            
            return jsonify({
                "message": "Profile updated successfully",
                "user": {
                    "id": current_user.id,
                    "firstname": current_user.firstname,
                    "lastname": current_user.lastname,
                    "location": current_user.location
                }
            }), 200
            
        # Existing GET method implementation
        return jsonify({
            "id": current_user.id,
            "username": current_user.username,
            "firstname": current_user.firstname,
            "lastname": current_user.lastname,
            "location": current_user.location,
            "profile_photo": current_user.profile_photo,
            "joined_on": current_user.joined_on.strftime('%Y-%m-%d %H:%M:%S')
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#
@app.route('/api/v1/users/<int:user_id>/photo', methods=['POST'])
@login_required
@requires_auth
def upload_user_profile_photo(user_id):
    try:
        if current_user.id != user_id:
            return jsonify({"error": "Can only upload photo to your own profile"}), 403

        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
            
        if file and allowed_file(file.filename):
            if current_user.profile_photo:
                old_filepath = os.path.join(app.config['UPLOAD_FOLDER'], current_user.profile_photo)
                if os.path.exists(old_filepath):
                    os.remove(old_filepath)
            
            # Save new photo
            filename = secure_filename(f"user_{user_id}_{file.filename}")
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Update user record
            current_user.profile_photo = filename
            db.session.commit()
            
            return jsonify({
                "message": "Profile photo uploaded successfully",
                "filename": filename,
                "photo_url": url_for('get_photo', filename=filename, _external=True)
            }), 200
            
        return jsonify({"error": "Invalid file type"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

##
# Functions for token creation in API's and Web Forms.
##

# API route for retrieving CSRF token
@app.route('/api/v1/csrf-token', methods=['GET'])
def get_csrf():
    try:
        csrf_token = generate_csrf() 
        return jsonify({'csrf_token': csrf_token})  
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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
# Functions for image processing
##

# API route for serving uploaded photos
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}


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