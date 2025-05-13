from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    firstname = db.Column(db.String(64), nullable=False)
    lastname = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False) 
    location = db.Column(db.String(255), nullable=False)
    profile_photo = db.Column(db.String(255), nullable=False)
    joined_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, username, password, firstname, lastname, email, location, biography, profile_photo, joined_on):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.location = location
        self.profile_photo = profile_photo
        self.joined_on = joined_on

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id) 
        except NameError:
            return str(self.id) 
            
    def __repr__(self):
        return '<User %r>' % (self.username)