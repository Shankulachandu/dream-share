import os
import cloudinary
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_migrate import Migrate
from models import db

app = Flask(__name__)

db_url = os.environ.get('DATABASE_URL', 'sqlite:///dreamshare.db')
if db_url.startswith('postgres://'):
    db_url = db_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI']        = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY']                     = os.environ.get('SECRET_KEY', 'dreamshare-secret-2024')
app.config['MAX_CONTENT_LENGTH']             = 100 * 1024 * 1024

# Configure Cloudinary
cloudinary.config(
    cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME'),
    api_key    = os.environ.get('CLOUDINARY_API_KEY'),
    api_secret = os.environ.get('CLOUDINARY_API_SECRET')
)

CORS(app, origins="*")
db.init_app(app)
migrate = Migrate(app, db)

os.makedirs('uploads', exist_ok=True)

from routes.auth import auth_routes
from routes.dream import dream_routes
from routes.user import user_routes
from routes.ai import ai_routes
from routes.story import story_routes

app.register_blueprint(auth_routes)
app.register_blueprint(dream_routes)
app.register_blueprint(user_routes)
app.register_blueprint(ai_routes)
app.register_blueprint(story_routes)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/')
def home():
    return {"message": "Dream Share API is running! 🌙"}, 200

with app.app_context():
    db.create_all()
    print("Database tables created!")

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)