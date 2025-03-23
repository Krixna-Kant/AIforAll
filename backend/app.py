from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import whisper
from gtts import gTTS
import os
import requests
from dotenv import load_dotenv

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Whisper model
model = whisper.load_model("base")  # Use "base" for faster performance

# Load environment variables
load_dotenv(".env")

# Hugging Face API token
HF_API_TOKEN = os.getenv("HF_API_KEY")
HF_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill"

# Chatbot endpoint
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message")

    if not message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Call Hugging Face Inference API
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        payload = {"inputs": message}
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response_data = response.json()

        # Extract the generated text
        generated_text = response_data[0]["generated_text"]
        return jsonify({"response": generated_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Speech-to-Text endpoint
@app.route("/stt", methods=["POST"])
@app.route("/stt", methods=["POST"])
def stt():
    try:
        audio_file = request.files["audio"]
        audio_path = "audio/input.wav"
        audio_file.save(audio_path)

        # Transcribe audio using Whisper with English language
        result = model.transcribe(audio_path, language="en")
        transcript = result["text"]
        return jsonify({"text": transcript})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Text-to-Speech endpoint

@app.route('/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory('audio', filename)
@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        # Convert text to speech using gTTS
        tts = gTTS(text=text, lang="en")
        audio_path = "audio/output.mp3"
        tts.save(audio_path)
        return jsonify({"audio_url": f"http://localhost:5000/audio/output.mp3"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Start the server
if __name__ == "__main__":
    # Create audio folder if it doesn't exist
    os.makedirs("audio", exist_ok=True)
    app.run(debug=True)