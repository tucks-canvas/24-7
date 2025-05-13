import os
from datetime import timedelta
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.flaskenv')
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