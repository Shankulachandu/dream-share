from flask import Flask
from flask_cors import CORS
from config import Config
from models import db

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)

from routes.auth import auth_routes
from routes.dream import dream_routes
from routes.user import user_routes

app.register_blueprint(auth_routes)
app.register_blueprint(dream_routes)
app.register_blueprint(user_routes)

with app.app_context():
    db.create_all()
    print("Database tables created!")

if __name__ == "__main__":
    app.run(debug=True)