from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    username    = db.Column(db.String(100), unique=True, nullable=False)
    email       = db.Column(db.String(100), unique=True, nullable=False)
    password    = db.Column(db.String(200), nullable=False)
    bio         = db.Column(db.String(300), default="")
    profile_pic = db.Column(db.String(300), default="")
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

class Dream(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    user_id      = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content      = db.Column(db.Text, nullable=False)
    mood         = db.Column(db.String(50), default="neutral")
    is_anonymous = db.Column(db.Boolean, default=False)
    image_url    = db.Column(db.String(300), default="")
    created_at   = db.Column(db.DateTime, default=datetime.utcnow)

class Like(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer, db.ForeignKey('user.id'))
    dream_id = db.Column(db.Integer, db.ForeignKey('dream.id'))

class Comment(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('user.id'))
    dream_id   = db.Column(db.Integer, db.ForeignKey('dream.id'))
    text       = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Follower(db.Model):
    id           = db.Column(db.Integer, primary_key=True)
    follower_id  = db.Column(db.Integer, db.ForeignKey('user.id'))
    following_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class DreamTag(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    dream_id = db.Column(db.Integer, db.ForeignKey('dream.id'))
    tag      = db.Column(db.String(50))

class Streak(db.Model):
    user_id        = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    current_streak = db.Column(db.Integer, default=0)
    last_post_date = db.Column(db.Date, nullable=True)

class Message(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    sender_id   = db.Column(db.Integer, db.ForeignKey('user.id'))
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    text        = db.Column(db.Text, nullable=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)