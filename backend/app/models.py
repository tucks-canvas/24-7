from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False) 
    joined_on = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    def __init__(self, username, password, email):
        self.username = username
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.email = email
        self.joined_on = datetime.utcnow()

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