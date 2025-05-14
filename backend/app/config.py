import os
from datetime import timedelta
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

class Config(object):
    """Base Config Object"""
    DEBUG = False
    SECRET_KEY = os.environ.get('SECRET_KEY')
    
    UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER')
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '').replace('postgres://', 'postgresql://')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    MAIL_SERVER =  os.environ.get('MAIL_SERVER') 
    MAIL_PORT = 2525
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') 
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') 

    WTF_CSRF_ENABLED = False  # Disable completely
    WTF_CSRF_CHECK_DEFAULT = False

    SECRET_KEY = os.environ.get('SECRET_KEY')  # Keep this secret!
    SECURITY_PASSWORD_SALT = os.environ.get('SECURITY_PASSWORD_SALT')  # Different from SECRET_KEY
