from flask import Blueprint, request, jsonify
from models import db, User, Follower, Dream, Streak, DreamTag, Message, Like
from sqlalchemy import func, or_
from datetime import datetime
from werkzeug.utils import secure_filename
import os

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
        "id":          user.id,
        "username":    user.username,
        "bio":         user.bio,
        "profile_pic": user.profile_pic,
        "followers":   followers,
        "following":   following,
        "post_count":  post_count,
        "streak":      streak.current_streak if streak else 0
    }), 200


@user_routes.route('/profile/<int:user_id>/edit', methods=['POST'])
def edit_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Update bio
    bio = request.form.get('bio', user.bio)
    user.bio = bio

    # Update profile picture if provided
    if 'profile_pic' in request.files:
        file = request.files['profile_pic']
        if file and file.filename:
            filename    = secure_filename(file.filename)
            unique_name = f"pic_{user_id}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
            file.save(os.path.join('uploads', unique_name))
            user.profile_pic = f"/uploads/{unique_name}"

    db.session.commit()
    return jsonify({
        "message":     "Profile updated!",
        "bio":         user.bio,
        "profile_pic": user.profile_pic
    }), 200


@user_routes.route('/profile/<int:user_id>/dreams', methods=['GET'])
def get_user_dreams(user_id):
    viewer_id = request.args.get('viewer_id')
    if viewer_id and int(viewer_id) == user_id:
        dreams = Dream.query.filter_by(user_id=user_id)\
                            .order_by(Dream.created_at.desc()).all()
    else:
        dreams = Dream.query.filter_by(user_id=user_id, is_anonymous=False)\
                            .order_by(Dream.created_at.desc()).all()
    result = []
    for d in dreams:
        user = User.query.get(d.user_id)
        result.append({
            "id":            d.id,
            "content":       d.content,
            "mood":          d.mood,
            "created_at":    d.created_at.isoformat(),
            "is_anonymous":  d.is_anonymous,
            "username":      "Anonymous Dreamer" if d.is_anonymous else user.username,
            "user_id":       d.user_id,
            "image_url":     d.image_url,
            "video_url":     d.video_url,
            "like_count":    Like.query.filter_by(dream_id=d.id).count(),
            "comment_count": Like.query.filter_by(dream_id=d.id).count()
        })
    return jsonify(result), 200


@user_routes.route('/search', methods=['GET'])
def search_users():
    query = request.args.get('q', '')
    if not query:
        return jsonify([]), 200
    users = User.query.filter(
        User.username.ilike(f'%{query}%')
    ).limit(10).all()
    return jsonify([{
        "id":       u.id,
        "username": u.username,
        "bio":      u.bio
    } for u in users]), 200


@user_routes.route('/is_following', methods=['GET'])
def is_following():
    follower_id  = request.args.get('follower_id')
    following_id = request.args.get('following_id')
    exists = Follower.query.filter_by(
        follower_id=follower_id,
        following_id=following_id
    ).first()
    return jsonify({"is_following": exists is not None}), 200


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


@user_routes.route('/message/send', methods=['POST'])
def send_message():
    media_url  = ""
    media_type = ""
    if request.files and 'media' in request.files:
        file = request.files['media']
        if file:
            filename    = secure_filename(file.filename)
            unique_name = f"msg_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
            file.save(os.path.join('uploads', unique_name))
            media_url  = f"/uploads/{unique_name}"
            ext        = filename.rsplit('.', 1)[-1].lower()
            media_type = 'video' if ext in {'mp4', 'mov', 'avi'} else 'image'
        sender_id   = int(request.form.get('sender_id'))
        receiver_id = int(request.form.get('receiver_id'))
        text        = request.form.get('text', '')
    else:
        data        = request.json
        sender_id   = data['sender_id']
        receiver_id = data['receiver_id']
        text        = data.get('text', '')
    msg = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        text=text,
        media_url=media_url,
        media_type=media_type,
        is_read=False
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": "Sent!"}), 201


@user_routes.route('/messages/<int:user1>/<int:user2>', methods=['GET'])
def get_messages(user1, user2):
    msgs = Message.query.filter(
        or_(
            (Message.sender_id == user1) & (Message.receiver_id == user2),
            (Message.sender_id == user2) & (Message.receiver_id == user1)
        )
    ).order_by(Message.created_at.asc()).all()
    for m in msgs:
        if m.receiver_id == user1 and not m.is_read:
            m.is_read = True
    db.session.commit()
    return jsonify([{
        "id":          m.id,
        "sender_id":   m.sender_id,
        "receiver_id": m.receiver_id,
        "text":        m.text,
        "media_url":   m.media_url,
        "media_type":  m.media_type,
        "created_at":  m.created_at.isoformat()
    } for m in msgs]), 200


@user_routes.route('/messages/unread/<int:user_id>', methods=['GET'])
def get_unread_messages(user_id):
    count = Message.query.filter_by(
        receiver_id=user_id,
        is_read=False
    ).count()
    return jsonify({"count": count}), 200


@user_routes.route('/conversations/<int:user_id>', methods=['GET'])
def get_conversations(user_id):
    sent     = db.session.query(Message.receiver_id).filter_by(sender_id=user_id)
    received = db.session.query(Message.sender_id).filter_by(receiver_id=user_id)
    user_ids = set()
    for r in sent:
        user_ids.add(r[0])
    for r in received:
        user_ids.add(r[0])
    conversations = []
    for uid in user_ids:
        user = User.query.get(uid)
        if user:
            last_msg = Message.query.filter(
                or_(
                    (Message.sender_id == user_id) & (Message.receiver_id == uid),
                    (Message.sender_id == uid) & (Message.receiver_id == user_id)
                )
            ).order_by(Message.created_at.desc()).first()
            unread = Message.query.filter_by(
                sender_id=uid,
                receiver_id=user_id,
                is_read=False
            ).count()
            conversations.append({
                "user_id":      uid,
                "username":     user.username,
                "last_message": last_msg.text if last_msg else "",
                "last_time":    last_msg.created_at.isoformat() if last_msg else "",
                "unread":       unread
            })
    conversations.sort(key=lambda x: x['last_time'], reverse=True)
    return jsonify(conversations), 200


@user_routes.route('/notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    user = User.query.get(user_id)
    user.last_seen_notif = datetime.utcnow()
    db.session.commit()
    user_dreams = Dream.query.filter_by(user_id=user_id).all()
    dream_ids   = [d.id for d in user_dreams]
    notifications = []
    if dream_ids:
        recent_likes = Like.query.filter(
            Like.dream_id.in_(dream_ids),
            Like.user_id != user_id
        ).order_by(Like.created_at.desc()).limit(20).all()
        for like in recent_likes:
            liker = User.query.get(like.user_id)
            dream = Dream.query.get(like.dream_id)
            if liker and dream:
                notifications.append({
                    "type":    "like",
                    "message": f"@{liker.username} liked your dream",
                    "preview": dream.content[:50],
                    "time":    like.created_at.isoformat()
                })
    recent_follows = Follower.query.filter_by(
        following_id=user_id
    ).order_by(Follower.created_at.desc()).limit(20).all()
    for follow in recent_follows:
        follower = User.query.get(follow.follower_id)
        if follower:
            notifications.append({
                "type":    "follow",
                "message": f"@{follower.username} started following you",
                "preview": "",
                "time":    follow.created_at.isoformat()
            })
    notifications.sort(key=lambda x: x['time'], reverse=True)
    return jsonify(notifications), 200


@user_routes.route('/notifications/unread/<int:user_id>', methods=['GET'])
def get_unread_notifications(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"count": 0}), 200
    last_seen   = user.last_seen_notif
    user_dreams = Dream.query.filter_by(user_id=user_id).all()
    dream_ids   = [d.id for d in user_dreams]
    count       = 0
    if dream_ids:
        query = Like.query.filter(
            Like.dream_id.in_(dream_ids),
            Like.user_id != user_id
        )
        if last_seen:
            query = query.filter(Like.created_at > last_seen)
        count += query.count()
    follow_query = Follower.query.filter_by(following_id=user_id)
    if last_seen:
        follow_query = follow_query.filter(Follower.created_at > last_seen)
    count += follow_query.count()
    return jsonify({"count": count}), 200