from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from gtts import gTTS
import os
from dotenv import load_dotenv
import pytesseract
from PIL import Image
from transformers import pipeline
from bs4 import BeautifulSoup
import requests
import whisper
import torch
import shutil
import threading
import io
from io import BytesIO
import base64
import tempfile
import numpy as np

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load environment variables
load_dotenv(".env")

# Initialize global variables for models - will be loaded on demand
summarizer = None
whisper_model = None
yolo_model = None

# Custom Braille conversion dictionary
braille_dict = {
    'a': '⠁', 'b': '⠃', 'c': '⠉', 'd': '⠙', 'e': '⠑',
    'f': '⠋', 'g': '⠛', 'h': '⠓', 'i': '⠊', 'j': '⠚',
    'k': '⠅', 'l': '⠇', 'm': '⠍', 'n': '⠝', 'o': '⠕',
    'p': '⠏', 'q': '⠟', 'r': '⠗', 's': '⠎', 't': '⠞',
    'u': '⠥', 'v': '⠧', 'w': '⠺', 'x': '⠭', 'y': '⠽',
    'z': '⠵', ' ': ' ', '1': '⠼⠁', '2': '⠼⠃', '3': '⠼⠉',
    '4': '⠼⠙', '5': '⠼⠑', '6': '⠼⠋', '7': '⠼⠛',
    '8': '⠼⠓', '9': '⠼⠊', '0': '⠼⠚'
}

def text_to_braille(text):
    braille_text = ""
    for char in text.lower():
        braille_text += braille_dict.get(char, char)
    return braille_text

# Load models on demand
def get_summarizer():
    global summarizer
    if summarizer is None:
        summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-6-6")
    return summarizer

def get_whisper_model():
    global whisper_model
    if whisper_model is None:
        whisper_model = whisper.load_model("tiny")
    return whisper_model

def get_yolo_model():
    global yolo_model
    if yolo_model is None:
        yolo_model = torch.hub.load("ultralytics/yolov5", "yolov5s")
    return yolo_model

# Improved cache clearing function
def clear_cache():
    cache_dirs = [
        os.path.expanduser("~/.cache/huggingface"),
        os.path.expanduser("~/.cache/torch"),
        os.path.expanduser("~/.cache/whisper")
    ]
    
    for cache_dir in cache_dirs:
        try:
            # Only clear temporary files, not the model files themselves
            temp_dirs = ["tmp", ".locks", "downloads"]
            for temp_dir in temp_dirs:
                temp_path = os.path.join(cache_dir, temp_dir)
                if os.path.exists(temp_path):
                    try:
                        shutil.rmtree(temp_path)
                        print(f"Cleared cache: {temp_path}")
                    except (PermissionError, OSError) as e:
                        print(f"Could not clear {temp_path}: {e}")
        except Exception as e:
            print(f"Error handling cache dir {cache_dir}: {e}")

# Load models in background
def load_models_background():
    # Pre-load models in background threads
    def load_whisper():
        get_whisper_model()
        print("Whisper model loaded")
    
    def load_yolo():
        get_yolo_model()
        print("YOLO model loaded")
    
    def load_summarizer():
        get_summarizer()
        print("Summarizer model loaded")
    
    threading.Thread(target=load_whisper).start()
    threading.Thread(target=load_yolo).start()
    threading.Thread(target=load_summarizer).start()

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
        
        # If the API key is not set, use a fallback response
        if not HF_API_TOKEN:
            return jsonify({"response": f"I understand your question about '{message}'. This is a demo response because the Hugging Face API key is not configured. Please set up your API key in the .env file."}), 200
        
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response_data = response.json()

        # Extract the generated text
        if isinstance(response_data, list) and len(response_data) > 0 and "generated_text" in response_data[0]:
            generated_text = response_data[0]["generated_text"]
        else:
            # Fallback if API response format is unexpected
            generated_text = f"I received your message about '{message}'. This is a fallback response because the API return format was unexpected."
        
        return jsonify({"response": generated_text})
    except Exception as e:
        print(f"Chat error: {str(e)}")
        # Provide a meaningful fallback response
        return jsonify({
            "response": f"I received your question about '{message}'. However, I encountered a technical issue. Please try again later."
        }), 200

# Speech-to-Text endpoint
@app.route("/stt", methods=["POST"])
def stt():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
            
        audio_file = request.files["audio"]
        os.makedirs("audio", exist_ok=True)
        audio_path = "audio/input.wav"
        audio_file.save(audio_path)

        # Transcribe audio using Whisper with English language
        result = get_whisper_model().transcribe(audio_path, language="en")
        transcript = result["text"]
        return jsonify({"text": transcript})
    except Exception as e:
        print(f"STT error: {str(e)}")
        return jsonify({"error": str(e), "text": "Could not transcribe audio"}), 200

# Text-to-Speech endpoint
@app.route("/tts", methods=["POST"])
def tts():
    data = request.get_json()
    text = data.get("text")
    language = data.get("language", "en")

    if not text:
        return jsonify({"error": "Text is required"}), 400

    try:
        # Convert text to speech using gTTS
        if language not in ["en", "es", "fr", "de", "zh", "ar"]:
            language = "en"  # Default to English for unsupported languages
            
        tts = gTTS(text=text, lang=language[:2])  # Use first 2 chars of language code
        os.makedirs("audio", exist_ok=True)
        audio_path = "audio/output.mp3"
        tts.save(audio_path)
        return jsonify({"audio_url": f"http://localhost:5000/audio/output.mp3"})
    except Exception as e:
        print(f"TTS error: {str(e)}")
        return jsonify({"error": str(e)}), 200

# File upload endpoint
@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400
        
        # Save the file temporarily
        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)
        
        return jsonify({
            "message": "File uploaded successfully",
            "file_path": file_path
        })
    except Exception as e:
        print(f"Upload error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Serve audio files
@app.route('/audio/<path:filename>')
def serve_audio(filename):
    return send_from_directory('audio', filename)

# Analyze image using YOLOv5
def analyze_image(image_path):
    try:
        # Load the image
        image = Image.open(image_path)
        # Perform inference
        results = get_yolo_model()(image)
        # Extract detected objects
        detected_objects = results.pandas().xyxy[0]["name"].tolist()
        # Remove duplicates while preserving order
        seen = set()
        detected_objects = [x for x in detected_objects if not (x in seen or seen.add(x))]
        return detected_objects
    except Exception as e:
        print(f"Image analysis error: {str(e)}")
        return [f"Error analyzing image: {str(e)}"]

# Generate descriptive output
def generate_description(detected_objects):
    if not detected_objects:
        return "No objects detected in the image."
    
    if len(detected_objects) == 1:
        return f"In the image, there is a {detected_objects[0]}."
    
    if len(detected_objects) == 2:
        return f"In the image, there are a {detected_objects[0]} and a {detected_objects[1]}."
    
    # Join all items except the last with commas, then add "and" for the last item
    items_except_last = ", a ".join(detected_objects[:-1])
    return f"In the image, there are a {items_except_last}, and a {detected_objects[-1]}."

# Convert text for dyslexia-friendly reading
def format_for_dyslexia(text):
    # Simple dyslexia-friendly formatting:
    # - Bold the first part of each word to help with fixation
    # - Increase spacing between words
    words = text.split()
    formatted_words = []
    
    for word in words:
        if len(word) <= 1:
            formatted_words.append(f"<strong>{word}</strong>")
        else:
            # Bold the first half of each word (approximately)
            mid_point = max(1, len(word) // 2)
            formatted_words.append(f"<strong>{word[:mid_point]}</strong>{word[mid_point:]}")
    
    # Join with extra space
    return " &nbsp; ".join(formatted_words)

# Simplify text using summarization
def simplify_text(text, max_length=50):
    summarizer = get_summarizer()
    
    # If text is short enough, return as is
    if len(text) < max_length:
        return text
        
    # Split into chunks if the text is too long for the model
    max_chunk_size = 1024
    chunks = []
    
    for i in range(0, len(text), max_chunk_size):
        chunk = text[i:i + max_chunk_size]
        chunks.append(chunk)
    
    # Summarize each chunk
    summarized_chunks = []
    for chunk in chunks:
        summary = summarizer(chunk, max_length=max_length, min_length=30, do_sample=False)
        summarized_chunks.append(summary[0]['summary_text'])
    
    # Join the summarized chunks
    return " ".join(summarized_chunks)

# Content Converter Route
@app.route("/convert", methods=["POST"])
def convert():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Invalid request format"}), 400
            
        input_type = data.get("input_type")  # text, image, url
        input_content = data.get("input_content")  # actual content
        output_format = data.get("output_format")  # audio, braille, simplified, dyslexia
        language = data.get("language", "en")

        if not input_type or not input_content or not output_format:
            return jsonify({"error": "Missing required fields"}), 400

        # Step 1: Convert input to text
        if input_type == "text":
            text = input_content
        elif input_type == "image":
            if isinstance(input_content, dict) and "data" in input_content:
                # Handle base64 image data
                image_data = base64.b64decode(input_content["data"])
                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                    temp_file.write(image_data)
                    image_path = temp_file.name
            else:
                # Assume it's a file path or object
                os.makedirs("temp", exist_ok=True)
                image_path = "temp/image.jpg"
                with open(image_path, "wb") as f:
                    f.write(input_content.encode() if isinstance(input_content, str) else input_content)
            
            # Analyze the image using YOLOv5
            detected_objects = analyze_image(image_path)
            text = generate_description(detected_objects)
        elif input_type == "url":
            try:
                # Fetch content from URL
                response = requests.get(input_content)
                if response.status_code == 200:
                    # Check if the URL points to an image
                    if any(input_content.lower().endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".gif"]):
                        # Handle image URL
                        image_data = BytesIO(response.content)
                        image = Image.open(image_data)
                        image_path = "temp/url_image.jpg"
                        image.save(image_path)
                        detected_objects = analyze_image(image_path)
                        text = generate_description(detected_objects)
                    else:
                        # Handle non-image URLs (e.g., web pages)
                        soup = BeautifulSoup(response.text, "html.parser")
                        paragraphs = soup.find_all("p")
                        text = " ".join([p.get_text() for p in paragraphs])
                        if not text:
                            text = soup.get_text()
                        text = text[:10000]  # Limit to prevent processing too much text
                else:
                    text = f"Failed to retrieve content from URL: {input_content}. Status code: {response.status_code}"
            except Exception as e:
                text = f"Error retrieving URL content: {str(e)}"
        else:
            return jsonify({"error": f"Unsupported input type: {input_type}"}), 400

        # Step 2: Process text into the desired output format
        if output_format == "audio":
            # Convert to speech
            try:
                if language not in ["en", "es", "fr", "de", "zh", "ar"]:
                    language = "en"  # Default to English for unsupported languages
                
                tts = gTTS(text=text, lang=language[:2])  # Use first 2 chars of language code
                os.makedirs("audio", exist_ok=True)
                audio_path = f"audio/output_{str(int(time.time()))}.mp3"
                tts.save(audio_path)
                
                return jsonify({
                    "original_text": text,
                    "audio_url": f"http://localhost:5000/{audio_path}"
                })
            except Exception as e:
                return jsonify({"error": f"TTS error: {str(e)}", "original_text": text}), 200
                
        elif output_format == "braille":
            # Convert to braille
            try:
                braille_text = text_to_braille(text)
                return jsonify({
                    "original_text": text,
                    "braille_text": braille_text
                })
            except Exception as e:
                return jsonify({"error": f"Braille conversion error: {str(e)}", "original_text": text}), 200
                
        elif output_format == "simplified":
            # Simplify text using summarization
            try:
                simplified_text = simplify_text(text)
                return jsonify({
                    "original_text": text,
                    "simplified_text": simplified_text
                })
            except Exception as e:
                return jsonify({"error": f"Simplification error: {str(e)}", "original_text": text}), 200
                
        elif output_format == "dyslexia":
            # Format for dyslexia-friendly reading
            try:
                dyslexia_text = format_for_dyslexia(text)
                return jsonify({
                    "original_text": text,
                    "dyslexia_text": dyslexia_text,
                    "is_html": True  # Indicate that the response contains HTML
                })
            except Exception as e:
                return jsonify({"error": f"Dyslexia formatting error: {str(e)}", "original_text": text}), 200
                
        else:
            return jsonify({"error": f"Unsupported output format: {output_format}"}), 400
    
    except Exception as e:
        print(f"Conversion error: {str(e)}")
        return jsonify({"error": f"Conversion error: {str(e)}"}), 500

# OCR route to extract text from images
@app.route("/ocr", methods=["POST"])
def ocr():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided"}), 400
            
        image_file = request.files["image"]
        os.makedirs("temp", exist_ok=True)
        image_path = "temp/ocr_image.png"
        image_file.save(image_path)
        
        # Perform OCR using pytesseract
        image = Image.open(image_path)
        text = pytesseract.image_to_string(image)
        
        return jsonify({"text": text})
    except Exception as e:
        print(f"OCR error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Clean up temporary files periodically
def cleanup_temp_files():
    try:
        # Clean temp directories
        temp_dirs = ["temp", "audio"]
        for temp_dir in temp_dirs:
            if os.path.exists(temp_dir):
                # Remove files older than 1 hour
                now = time.time()
                for filename in os.listdir(temp_dir):
                    file_path = os.path.join(temp_dir, filename)
                    if os.path.isfile(file_path) and os.stat(file_path).st_mtime < now - 3600:
                        os.remove(file_path)
        
        # Also clear model caches
        clear_cache()
    except Exception as e:
        print(f"Cleanup error: {str(e)}")

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "models": {
            "summarizer": summarizer is not None,
            "whisper": whisper_model is not None,
            "yolo": yolo_model is not None
        }
    })

# Start the background cleanup task
def start_background_tasks():
    import time
    
    # Start model loading
    load_models_background()
    
    # Start cleanup thread
    def cleanup_task():
        while True:
            cleanup_temp_files()
            time.sleep(3600)  # Run cleanup every hour
    
    threading.Thread(target=cleanup_task, daemon=True).start()

# Import time module for timestamps and scheduling
import time

# Run the app
if __name__ == "__main__":
    # Initialize background tasks
    start_background_tasks()
    
    # Start the Flask app
    print("Starting accessibility API server...")
    app.run(debug=True, host="0.0.0.0", port=5000)