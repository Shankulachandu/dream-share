from flask import Blueprint, request, jsonify
from models import db, User, Follower, Dream, Streak, DreamTag
from sqlalchemy import func

user_routes = Blueprint('user', __name__)

@user_routes.route('/profile/<int:user_id>', methods=['GET'])
def get_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    followers  = Follower.query.filter_by(following_id=user_id).count()
    following  = Follower.query.filter_by(follower_id=user_id).count()
    post_count = Dream.query.filter_by(user_id=user_id).count()
    streak     = Streak.query.filter_by(user_id=user_id).first()

    return jsonify({
        "username":   user.username,
        "bio":        user.bio,
        "followers":  followers,
        "following":  following,
        "post_count": post_count,
        "streak":     streak.current_streak if streak else 0
    }), 200


@user_routes.route('/follow', methods=['POST'])
def follow():
    data = request.json
    existing = Follower.query.filter_by(
        follower_id=data['follower_id'],
        following_id=data['following_id']
    ).first()
    if existing:
        return jsonify({"message": "Already following"}), 400

    db.session.add(Follower(
        follower_id=data['follower_id'],
        following_id=data['following_id']
    ))
    db.session.commit()
    return jsonify({"message": "Followed!"}), 201


@user_routes.route('/unfollow', methods=['POST'])
def unfollow():
    data = request.json
    f = Follower.query.filter_by(
        follower_id=data['follower_id'],
        following_id=data['following_id']
    ).first()
    if f:
        db.session.delete(f)
        db.session.commit()
    return jsonify({"message": "Unfollowed"}), 200


@user_routes.route('/insights/<int:user_id>', methods=['GET'])
def get_insights(user_id):
    results = db.session.query(
        DreamTag.tag,
        func.count(DreamTag.tag).label('count')
    ).join(Dream, DreamTag.dream_id == Dream.id)\
     .filter(Dream.user_id == user_id)\
     .group_by(DreamTag.tag)\
     .order_by(func.count(DreamTag.tag).desc())\
     .limit(5).all()

    return jsonify([{"tag": r.tag, "count": r.count} for r in results]), 200