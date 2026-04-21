from flask import Blueprint, request, jsonify
from models import db, Story, StoryView, User
from datetime import datetime, timedelta
from werkzeug.utils import secure_filename
import os

story_routes = Blueprint('story', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'mov', 'avi'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_media_type(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if ext in {'mp4', 'mov', 'avi'}:
        return 'video'
    return 'image'


# POST A STORY
@story_routes.route('/story/create', methods=['POST'])
def create_story():
    if 'media' not in request.files:
        return jsonify({"error": "No media provided"}), 400

    file = request.files['media']
    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename      = secure_filename(file.filename)
    unique_name   = f"story_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{filename}"
    file.save(os.path.join(UPLOAD_FOLDER, unique_name))
    media_url     = f"/uploads/{unique_name}"
    media_type    = get_media_type(filename)

    user_id = int(request.form.get('user_id'))
    caption = request.form.get('caption', '')

    story = Story(
        user_id=user_id,
        media_url=media_url,
        media_type=media_type,
        caption=caption
    )
    db.session.add(story)
    db.session.commit()
    return jsonify({"message": "Story posted!", "story_id": story.id}), 201


# GET ALL ACTIVE STORIES (last 24 hours)
@story_routes.route('/stories', methods=['GET'])
def get_stories():
    viewer_id  = request.args.get('viewer_id')
    cutoff     = datetime.utcnow() - timedelta(hours=24)
    stories    = Story.query.filter(Story.created_at >= cutoff)\
                            .order_by(Story.created_at.desc()).all()

    # Group by user
    user_stories = {}
    for s in stories:
        user = User.query.get(s.user_id)
        if not user:
            continue
        uid = s.user_id
        if uid not in user_stories:
            user_stories[uid] = {
                "user_id":  uid,
                "username": user.username,
                "stories":  []
            }
        viewed = False
        if viewer_id:
            view = StoryView.query.filter_by(
                story_id=s.id,
                viewer_id=int(viewer_id)
            ).first()
            viewed = view is not None

        user_stories[uid]["stories"].append({
            "id":         s.id,
            "media_url":  s.media_url,
            "media_type": s.media_type,
            "caption":    s.caption,
            "created_at": s.created_at.isoformat(),
            "viewed":     viewed
        })

    return jsonify(list(user_stories.values())), 200


# MARK STORY AS VIEWED
@story_routes.route('/story/view', methods=['POST'])
def view_story():
    data = request.json
    existing = StoryView.query.filter_by(
        story_id=data['story_id'],
        viewer_id=data['viewer_id']
    ).first()
    if not existing:
        view = StoryView(
            story_id=data['story_id'],
            viewer_id=data['viewer_id']
        )
        db.session.add(view)
        db.session.commit()
    return jsonify({"message": "Viewed"}), 200


# DELETE EXPIRED STORIES
@story_routes.route('/stories/cleanup', methods=['POST'])
def cleanup_stories():
    cutoff = datetime.utcnow() - timedelta(hours=24)
    expired = Story.query.filter(Story.created_at < cutoff).all()
    for s in expired:
        StoryView.query.filter_by(story_id=s.id).delete()
        db.session.delete(s)
    db.session.commit()
    return jsonify({"message": f"Deleted {len(expired)} expired stories"}), 200