from flask import Blueprint, request, jsonify
from models import db, Dream, Like, Comment, DreamTag, Streak, User
from datetime import date, timedelta
import os
from werkzeug.utils import secure_filename

dream_routes = Blueprint('dream', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@dream_routes.route('/dream/create', methods=['POST'])
def create_dream():
    image_url = ""
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{date.today()}_{filename}"
            file.save(os.path.join(UPLOAD_FOLDER, unique_filename))
            image_url = f"/uploads/{unique_filename}"

    user_id      = int(request.form.get('user_id'))
    content      = request.form.get('content')
    mood         = request.form.get('mood', 'neutral')
    is_anonymous = request.form.get('is_anonymous') == 'true'
    tags_raw     = request.form.get('tags', '')
    tags         = [t.strip() for t in tags_raw.split(',') if t.strip()]

    dream = Dream(
        user_id=user_id,
        content=content,
        mood=mood,
        is_anonymous=is_anonymous,
        image_url=image_url
    )
    db.session.add(dream)
    db.session.commit()

    for tag in tags:
        db.session.add(DreamTag(dream_id=dream.id, tag=tag))

    update_streak(user_id)
    db.session.commit()

    return jsonify({"message": "Dream posted!", "dream_id": dream.id}), 201


@dream_routes.route('/dream/feed', methods=['GET'])
def get_feed():
    dreams = Dream.query.order_by(Dream.created_at.desc()).limit(50).all()
    result = []
    for d in dreams:
        user = User.query.get(d.user_id)
        result.append({
            "id": d.id,
            "content": d.content,
            "mood": d.mood,
            "created_at": d.created_at.isoformat(),
            "is_anonymous": d.is_anonymous,
            "username": "Anonymous Dreamer" if d.is_anonymous else user.username,
            "user_id": None if d.is_anonymous else d.user_id,
            "image_url": d.image_url,
            "like_count": Like.query.filter_by(dream_id=d.id).count(),
            "comment_count": Comment.query.filter_by(dream_id=d.id).count()
        })
    return jsonify(result), 200


@dream_routes.route('/dream/like', methods=['POST'])
def like_dream():
    data = request.json
    existing = Like.query.filter_by(
        user_id=data['user_id'],
        dream_id=data['dream_id']
    ).first()

    if existing:
        db.session.delete(existing)
        db.session.commit()
        return jsonify({"message": "Unliked"}), 200

    db.session.add(Like(user_id=data['user_id'], dream_id=data['dream_id']))
    db.session.commit()
    return jsonify({"message": "Liked!"}), 201


@dream_routes.route('/dream/comment', methods=['POST'])
def add_comment():
    data = request.json
    comment = Comment(
        user_id=data['user_id'],
        dream_id=data['dream_id'],
        text=data['text']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify({"message": "Comment added!"}), 201


@dream_routes.route('/dream/<int:dream_id>/comments', methods=['GET'])
def get_comments(dream_id):
    comments = Comment.query.filter_by(dream_id=dream_id).all()
    result = []
    for c in comments:
        user = User.query.get(c.user_id)
        result.append({
            "id": c.id,
            "text": c.text,
            "username": user.username,
            "created_at": c.created_at.isoformat()
        })
    return jsonify(result), 200


def update_streak(user_id):
    streak = Streak.query.filter_by(user_id=user_id).first()
    today = date.today()

    if not streak:
        db.session.add(Streak(user_id=user_id, current_streak=1, last_post_date=today))
    elif streak.last_post_date == today:
        pass
    elif streak.last_post_date == today - timedelta(days=1):
        streak.current_streak += 1
        streak.last_post_date = today
    else:
        streak.current_streak = 1
        streak.last_post_date = today