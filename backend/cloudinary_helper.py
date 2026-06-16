import cloudinary.uploader
import os

def upload_file(file, folder="dream-share"):
    """Upload a file to Cloudinary and return the URL"""
    try:
        # Determine resource type
        filename = file.filename.lower()
        if filename.endswith(('.mp4', '.mov', '.avi', '.webm')):
            resource_type = "video"
        else:
            resource_type = "image"

        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type=resource_type
        )
        return result.get('secure_url'), resource_type

    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        return None, None


def delete_file(url):
    """Delete a file from Cloudinary by URL"""
    try:
        # Extract public_id from URL
        parts = url.split('/')
        public_id = '/'.join(parts[-2:]).split('.')[0]
        cloudinary.uploader.destroy(public_id)
    except Exception as e:
        print(f"Cloudinary delete error: {e}")