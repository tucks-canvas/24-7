"""
Flask Documentation:     https://flask.palletsprojects.com/
Jinja2 Documentation:    https://jinja.palletsprojects.com/
Werkzeug Documentation:  https://werkzeug.palletsprojects.com/

This file creates your application.
"""


import os
import jwt
import secrets
import random

from datetime import datetime, timedelta
from functools import wraps
from datetime import datetime
from app import app, db, login_manager


from flask import current_app, render_template, request, jsonify, send_file, session, send_from_directory, url_for, redirect, g
from flask_login import login_user, logout_user, current_user, login_required

from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError

from app.forms import LoginForm, RegistrationForm
from app.models import User

from flask_wtf.csrf import generate_csrf

from itsdangerous import URLSafeTimedSerializer as Serializer
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
            jwt_token = generate_reset_token(user.id)
            
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
@app.route('/api/v1/auth/request-password-reset', methods=['POST'])
def request_reset():
    email = request.json.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    
    if user:
        reset_code = ''.join([str(random.randint(0, 9)) for _ in range(4)])
        expiration = datetime.utcnow() + timedelta(minutes=15)
        
        user.reset_code = reset_code
        user.reset_code_expiration = expiration
        db.session.commit()
        
        try:
            msg = Message(
                "Your Password Reset Code",
                sender="noreply@yourdomain.com",
                recipients=[email],
                body=f"Your password reset code is: {reset_code}\n\nThis code will expire in 15 minutes."
            )
            mail.send(msg)
            return jsonify({"message": "If an account exists with this email, a reset code has been sent"}), 200
        except Exception as e:
            app.logger.error(f"Failed to send email: {str(e)}")
            return jsonify({"error": "Failed to send reset code"}), 500
    

    return jsonify({"message": "If an account exists with this email, a reset code has been sent"}), 200

#
@app.route('/api/v1/auth/verify-reset-code', methods=['POST'])
def verify_code():
    try:
        email = request.json.get('email')
        token = request.json.get('token')  # The 4-digit code
        
        if not email or not token:
            return jsonify({"error": "Email and token are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        if user.reset_code != token:
            return jsonify({"error": "Invalid code"}), 400
            
        if user.reset_code_expiration < datetime.utcnow():
            return jsonify({"error": "Code expired"}), 400
            
        # Generate reset token with 10 minute expiration
        expiration = datetime.utcnow() + timedelta(minutes=10)
        payload = {
            'user_id': user.id,
            'exp': expiration.timestamp()  # Using timestamp
        }
        
        s = Serializer(current_app.config['SECRET_KEY'])
        reset_token = s.dumps(payload)
        
        return jsonify({
            "success": True,
            "token": reset_token,
            "expires_at": expiration.isoformat()
        }), 200
        
    except Exception as e:
        app.logger.error(f"Verify code error: {str(e)}")
        return jsonify({"error": "Verification failed"}), 500
    
#
@app.route('/api/v1/auth/reset-password', methods=['POST'])
def reset_password_with_token():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        token = data.get('token')
        new_password = data.get('new_password')
        
        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400

        if len(new_password) < 8:
            return jsonify({"error": "Password must be at least 8 characters"}), 400
        
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            payload = s.loads(token)
        except:
            return jsonify({"error": "Invalid or expired token"}), 400
            
        # Check expiration
        if 'exp' not in payload or datetime.utcnow().timestamp() > payload['exp']:
            return jsonify({"error": "Token expired"}), 400
            
        user = User.query.get(payload.get('user_id'))
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        user.password = generate_password_hash(new_password)
        user.reset_code = None
        user.reset_code_expiration = None
        db.session.commit()
        
        return jsonify({"success": True, "message": "Password updated successfully"}), 200
        
    except Exception as e:
        app.logger.error(f"Password reset error: {str(e)}")
        return jsonify({"error": "Password reset failed"}), 500


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
def generate_reset_token(user_id):
    """Generate a JWT token for password reset"""
    try:
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(minutes=30),  # 30 minute expiration
            'iat': datetime.utcnow(),
            'purpose': 'password_reset'  # Specific purpose for this token
        }
        return jwt.encode(
            payload,
            app.config['SECRET_KEY'],
            algorithm='HS256'
        )
    except Exception as e:
        app.logger.error(f"Token generation error: {str(e)}")
        raise

#
@app.route('/api/v1/auth/refresh', methods=['POST'])
def refresh_token():
    try:
        refresh_token = request.json.get('refresh_token')
        if not refresh_token:
            return jsonify({"error": "Refresh token required"}), 400
        
        payload = jwt.decode(
            refresh_token,
            app.config['SECRET_KEY'],
            algorithms=["HS256"]
        )
        
        new_token = generate_token(payload['sub'])
        
        return jsonify({
            "access_token": new_token,
            "token_type": "Bearer"
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Refresh token expired"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 400


##
# Functions for image processing
##

#
def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@app.route('/api/v1/photos', methods=['POST'])
@login_required
def upload_photo():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        
        if not allowed_file(file.filename):
            allowed = ', '.join(current_app.config['ALLOWED_EXTENSIONS'])
            return jsonify({
                "error": "Invalid file type",
                "allowed_extensions": allowed
            }), 400
            
        os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        ext = file.filename.rsplit('.', 1)[1].lower()
        filename = secure_filename(f"user_{current_user.id}_{timestamp}.{ext}")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        
        file.save(filepath)
        
        if current_user.profile_photo:
            old_file = os.path.join(current_app.config['UPLOAD_FOLDER'], current_user.profile_photo)
            if os.path.exists(old_file):
                os.remove(old_file)
        
        current_user.profile_photo = filename
        db.session.commit()
        
        # Return URL with consistent /api/v1/photos/ prefix
        photo_url = url_for('get_photo', filename=filename, _external=True)
        return jsonify({
            "message": "Photo uploaded successfully",
            "filename": filename,
            "url": photo_url
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Upload failed",
            "details": str(e)
        }), 500
        
#
@app.route('/api/v1/photos/<filename>', methods=['GET'])
def get_photo(filename):
    try:
        clean_filename = secure_filename(filename.split('?')[0].split('#')[0])
        current_app.logger.info(f"Attempting to serve photo: {clean_filename}")
        
        if not clean_filename:
            current_app.logger.error("Empty filename received")
            abort(400, description="Invalid filename")
            
        upload_folder = current_app.config['UPLOAD_FOLDER']
        filepath = os.path.join(upload_folder, clean_filename)
        current_app.logger.info(f"Looking for file at: {filepath}")
        
        if not os.path.exists(filepath):
            current_app.logger.error(f"File not found at: {filepath}")
            current_app.logger.info(f"Upload folder contents: {os.listdir(upload_folder)}")
            abort(404, description="File not found")
            
        current_app.logger.info(f"Serving file: {filepath}")
        return send_from_directory(
            upload_folder,
            clean_filename,
            conditional=True
        )
    except Exception as e:
        current_app.logger.error(f"Error serving {filename}: {str(e)}", exc_info=True)
        abort(500, description="Error serving file")


##
# Functions for error, and request handling.
##

# Debug function for config.py
@app.route('/debug/config')
def debug_config():
    return jsonify({
        "UPLOAD_FOLDER": current_app.config['UPLOAD_FOLDER'],
        "ALLOWED_EXTENSIONS": list(current_app.config['ALLOWED_EXTENSIONS'])
    })

# Debug function for file uploads
@app.route('/debug/uploads')
def debug_uploads():
    uploads_dir = current_app.config['UPLOAD_FOLDER']
    if not os.path.exists(uploads_dir):
        return jsonify({"error": f"Upload directory {uploads_dir} does not exist"}), 500
    
    files = []
    for f in os.listdir(uploads_dir):
        filepath = os.path.join(uploads_dir, f)
        files.append({
            "name": f,
            "size": os.path.getsize(filepath),
            "modified": datetime.fromtimestamp(os.path.getmtime(filepath)).isoformat()
        })
    
    return jsonify({
        "upload_folder": uploads_dir,
        "files": files,
        "absolute_path": os.path.abspath(uploads_dir)
    })

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