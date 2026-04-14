from flask import Blueprint, request, jsonify
from models import db, User
from flask_bcrypt import Bcrypt

auth_routes = Blueprint('auth', __name__)
bcrypt = Bcrypt()

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.json

    existing = User.query.filter_by(username=data['username']).first()
    if existing:
        return jsonify({"error": "Username already taken"}), 400

    hashed_pw = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_pw
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created!", "user_id": new_user.id}), 201


@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.json

    user = User.query.filter_by(username=data['username']).first()

    if not user or not bcrypt.check_password_hash(user.password, data['password']):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username
    }), 200