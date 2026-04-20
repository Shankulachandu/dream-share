from flask import Blueprint, request, jsonify
from groq import Groq
import traceback
import os
from dotenv import load_dotenv

load_dotenv()

ai_routes = Blueprint('ai', __name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@ai_routes.route('/dream/interpret', methods=['POST'])
def interpret_dream():
    data    = request.json
    content = data.get('content', '')

    if not content:
        return jsonify({"error": "No dream content provided"}), 400

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a professional dream interpreter with expertise "
                        "in psychology. When someone shares their dream, provide "
                        "a warm and insightful interpretation in 3-4 sentences. "
                        "Focus on emotions, symbols, and possible meanings. "
                        "Be encouraging and positive. Never be alarming or negative."
                    )
                },
                {
                    "role": "user",
                    "content": f"Please interpret this dream: {content}"
                }
            ],
            max_tokens=200
        )

        interpretation = response.choices[0].message.content
        return jsonify({"interpretation": interpretation}), 200

    except Exception as e:
        traceback.print_exc()
        print("GROQ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500