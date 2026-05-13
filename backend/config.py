import os

class Config:
    # Uses PostgreSQL online, SQLite locally
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'sqlite:///dreamshare.db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dreamshare-secret-2024')

    # Fix for Render PostgreSQL URL format
    @staticmethod
    def fix_db_url(url):
        if url and url.startswith('postgres://'):
            return url.replace('postgres://', 'postgresql://', 1)
        return url