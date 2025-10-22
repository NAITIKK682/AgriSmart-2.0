"""
AgriSmart 2.0 - AI-Powered Farmer Assistant Platform
Main Flask Application
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import sqlite3
import os
import json
import requests
from functools import wraps
import secrets
import os
import base64
from dotenv import load_dotenv
import openai

# Load .env file from root directory
load_dotenv()  # Automatically loads .env from current working directory

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# DEBUG: Print whether keys are loaded
print("✅ ELEVENLABS_API_KEY loaded:", os.getenv("ELEVENLABS_API_KEY") is not None)
print("✅ OPENAI_API_KEY loaded:", os.getenv("OPENAI_API_KEY") is not None)
print("📁 Current working directory:", os.getcwd())

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)
app.config['JWT_SECRET_KEY'] = secrets.token_hex(32)
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")
jwt = JWTManager(app)

# Create upload folders
os.makedirs('uploads/crops', exist_ok=True)
os.makedirs('uploads/products', exist_ok=True)
os.makedirs('uploads/profiles', exist_ok=True)

# Database connection helper
def get_db():
    conn = sqlite3.connect('agrismart.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT,
            phone TEXT,
            role TEXT DEFAULT 'farmer',
            language TEXT DEFAULT 'en',
            location TEXT,
            farm_size REAL,
            profile_image TEXT,
            is_verified INTEGER DEFAULT 0,
            google_id TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Products table (Marketplace)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            seller_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            unit TEXT,
            quantity INTEGER,
            is_organic INTEGER DEFAULT 0,
            image TEXT,
            rating REAL DEFAULT 0,
            reviews_count INTEGER DEFAULT 0,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id)
        )
    ''')
    
    # Reviews table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Farming tips table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS farming_tips (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            content TEXT NOT NULL,
            author_id INTEGER,
            tags TEXT,
            language TEXT DEFAULT 'en',
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            image TEXT,
            video_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id)
        )
    ''')
    
    # Irrigation plans table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS irrigation_plans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            crop_name TEXT NOT NULL,
            area REAL,
            soil_type TEXT,
            water_requirement REAL,
            irrigation_method TEXT,
            schedule TEXT,
            start_date DATE,
            end_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Government schemes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS government_schemes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            eligibility TEXT,
            benefits TEXT,
            application_process TEXT,
            contact_info TEXT,
            state TEXT,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Forum posts table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forum_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            category TEXT,
            tags TEXT,
            views INTEGER DEFAULT 0,
            likes INTEGER DEFAULT 0,
            is_pinned INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Forum comments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS forum_comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES forum_posts(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Chat messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sender_id INTEGER NOT NULL,
            message TEXT NOT NULL,
            room TEXT DEFAULT 'general',
            language TEXT DEFAULT 'en',
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id)
        )
    ''')
    
    # Crop disease detections table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS disease_detections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            crop_name TEXT,
            disease_name TEXT,
            confidence REAL,
            image TEXT,
            treatment TEXT,
            preventive_measures TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # AI chat history table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ai_chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            language TEXT DEFAULT 'en',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    # Notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Validate input
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Name, email, and password are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT id FROM users WHERE email = ?', (data['email'],))
    if cursor.fetchone():
        conn.close()
        return jsonify({'error': 'Email already registered'}), 400
    
    # Hash password
    hashed_password = generate_password_hash(data['password'])
    
    # Insert user
    cursor.execute('''
        INSERT INTO users (name, email, password, phone, role, language, location, farm_size)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'],
        data['email'],
        hashed_password,
        data.get('phone', ''),
        data.get('role', 'farmer'),
        data.get('language', 'en'),
        data.get('location', ''),
        data.get('farm_size', 0)
    ))
    
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    
    # Create access token
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'message': 'Registration successful',
        'access_token': access_token,
        'user': {
            'id': user_id,
            'name': data['name'],
            'email': data['email'],
            'role': data.get('role', 'farmer')
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users WHERE email = ?', (data['email'],))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create access token
    access_token = create_access_token(identity=user['id'])
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'role': user['role'],
            'language': user['language'],
            'profile_image': user['profile_image']
        }
    }), 200

@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    """Google OAuth authentication"""
    data = request.json
    google_id = data.get('google_id')
    email = data.get('email')
    name = data.get('name')
    
    if not google_id or not email:
        return jsonify({'error': 'Invalid Google authentication'}), 400
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute('SELECT * FROM users WHERE google_id = ? OR email = ?', (google_id, email))
    user = cursor.fetchone()
    
    if user:
        user_id = user['id']
    else:
        # Create new user
        cursor.execute('''
            INSERT INTO users (name, email, google_id, is_verified)
            VALUES (?, ?, ?, 1)
        ''', (name, email, google_id))
        conn.commit()
        user_id = cursor.lastrowid
    
    conn.close()
    
    access_token = create_access_token(identity=user_id)
    
    return jsonify({
        'message': 'Authentication successful',
        'access_token': access_token,
        'user': {'id': user_id, 'name': name, 'email': email}
    }), 200

# User profile endpoints
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user['id'],
        'name': user['name'],
        'email': user['email'],
        'phone': user['phone'],
        'role': user['role'],
        'language': user['language'],
        'location': user['location'],
        'farm_size': user['farm_size'],
        'profile_image': user['profile_image']
    }), 200

# Weather API
@app.route('/api/weather', methods=['GET'])
@jwt_required()
def get_weather():
    location = request.args.get('location', 'Delhi')
    
    # Using OpenWeatherMap API (you'll need to add your API key)
    API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'demo_key')
    
    try:
        # Current weather
        current_url = f'https://api.openweathermap.org/data/2.5/weather?q={location}&appid={API_KEY}&units=metric'
        current_response = requests.get(current_url, timeout=5)
        
        # 7-day forecast
        forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?q={location}&appid={API_KEY}&units=metric'
        forecast_response = requests.get(forecast_url, timeout=5)
        
        return jsonify({
            'current': current_response.json() if current_response.status_code == 200 else {},
            'forecast': forecast_response.json() if forecast_response.status_code == 200 else {}
        }), 200
    except Exception as e:
        # Return mock data if API fails
        return jsonify({
            'current': {
                'temp': 28,
                'feels_like': 30,
                'humidity': 65,
                'weather': [{'main': 'Clear', 'description': 'clear sky'}],
                'wind': {'speed': 3.5}
            },
            'forecast': {'list': []}
        }), 200

# Crop disease detection endpoint
@app.route('/api/disease/detect', methods=['POST'])
@jwt_required()
def detect_disease():
    user_id = get_jwt_identity()
    
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    # Save image
    filename = secure_filename(f"{user_id}_{datetime.now().timestamp()}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'crops', filename)
    file.save(filepath)
    
    # Mock AI detection (replace with actual TensorFlow model)
    # In production, you would load a trained model and make predictions
    mock_diseases = [
        {'name': 'Leaf Blight', 'confidence': 0.92, 'treatment': 'Apply copper-based fungicide', 'prevention': 'Ensure proper drainage and spacing'},
        {'name': 'Powdery Mildew', 'confidence': 0.87, 'treatment': 'Use sulfur-based spray', 'prevention': 'Reduce humidity, improve air circulation'},
        {'name': 'Bacterial Spot', 'confidence': 0.78, 'treatment': 'Remove infected leaves, apply bactericide', 'prevention': 'Use disease-free seeds'},
    ]
    
    import random
    detected = random.choice(mock_diseases)
    
    # Save to database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO disease_detections (user_id, disease_name, confidence, image, treatment, preventive_measures)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (user_id, detected['name'], detected['confidence'], filename, detected['treatment'], detected['prevention']))
    conn.commit()
    detection_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'id': detection_id,
        'disease': detected['name'],
        'confidence': detected['confidence'],
        'treatment': detected['treatment'],
        'preventive_measures': detected['prevention'],
        'image': filename
    }), 200

# Marketplace endpoints
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category', '')
    search = request.args.get('search', '')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id WHERE p.status = "active"'
    params = []
    
    if category:
        query += ' AND p.category = ?'
        params.append(category)
    
    if search:
        query += ' AND (p.name LIKE ? OR p.description LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%'])
    
    query += ' ORDER BY p.created_at DESC LIMIT 50'
    
    cursor.execute(query, params)
    products = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(products), 200

@app.route('/api/products', methods=['POST'])
@jwt_required()
def create_product():
    user_id = get_jwt_identity()
    data = request.json
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO products (seller_id, name, category, description, price, unit, quantity, is_organic, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user_id,
        data['name'],
        data['category'],
        data.get('description', ''),
        data['price'],
        data.get('unit', 'kg'),
        data.get('quantity', 0),
        data.get('is_organic', 0),
        data.get('image', '')
    ))
    conn.commit()
    product_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': product_id, 'message': 'Product created successfully'}), 201

# Farming tips endpoints
@app.route('/api/tips', methods=['GET'])
def get_tips():
    category = request.args.get('category', '')
    language = request.args.get('language', 'en')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT t.*, u.name as author_name FROM farming_tips t LEFT JOIN users u ON t.author_id = u.id WHERE 1=1'
    params = []
    
    if category:
        query += ' AND t.category = ?'
        params.append(category)
    
    if language:
        query += ' AND t.language = ?'
        params.append(language)
    
    query += ' ORDER BY t.created_at DESC LIMIT 30'
    
    cursor.execute(query, params)
    tips = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(tips), 200

# Government schemes endpoints
@app.route('/api/schemes', methods=['GET'])
def get_schemes():
    category = request.args.get('category', '')
    state = request.args.get('state', '')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = 'SELECT * FROM government_schemes WHERE is_active = 1'
    params = []
    
    if category:
        query += ' AND category = ?'
        params.append(category)
    
    if state:
        query += ' AND (state = ? OR state = "All")'
        params.append(state)
    
    query += ' ORDER BY created_at DESC'
    
    cursor.execute(query, params)
    schemes = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(schemes), 200

# Forum endpoints
@app.route('/api/forum/posts', methods=['GET'])
def get_forum_posts():
    category = request.args.get('category', '')
    
    conn = get_db()
    cursor = conn.cursor()
    
    query = '''
        SELECT p.*, u.name as author_name, u.role, u.profile_image,
        COUNT(DISTINCT c.id) as comments_count
        FROM forum_posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN forum_comments c ON p.id = c.post_id
        WHERE 1=1
    '''
    params = []
    
    if category:
        query += ' AND p.category = ?'
        params.append(category)
    
    query += ' GROUP BY p.id ORDER BY p.is_pinned DESC, p.created_at DESC LIMIT 30'
    
    cursor.execute(query, params)
    posts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    
    return jsonify(posts), 200

@app.route('/api/forum/posts', methods=['POST'])
@jwt_required()
def create_forum_post():
    user_id = get_jwt_identity()
    data = request.json
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO forum_posts (user_id, title, content, category, tags)
        VALUES (?, ?, ?, ?, ?)
    ''', (user_id, data['title'], data['content'], data.get('category', 'general'), data.get('tags', '')))
    conn.commit()
    post_id = cursor.lastrowid
    conn.close()
    
    return jsonify({'id': post_id, 'message': 'Post created successfully'}), 201

# AI Chatbot endpoint
@app.route('/api/ai/chat', methods=['POST'])
@jwt_required()
def ai_chat():
    user_id = get_jwt_identity()
    data = request.json
    question = data.get('question', '')
    language = data.get('language', 'en')

    if not question.strip():
        return jsonify({'error': 'Question is required'}), 400

    try:
        # Create system prompt for farming context
        system_prompt = """You are Ayushmann, an expert AI farming assistant for AgriSmart platform.
        You provide helpful, accurate information about agriculture, farming practices, crop management, soil health, irrigation, pest control, and related topics.
        Always respond in a helpful, professional manner. If asked about non-farming topics, politely redirect to farming-related advice.
        Keep responses concise but informative. Use simple language that farmers can understand."""

        # Add language instruction if Hindi
        if language == 'hi':
            system_prompt += " Respond in Hindi language."

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ],
            max_tokens=500,
            temperature=0.7
        )

        answer = response.choices[0].message.content.strip()

    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback to mock response if API fails
        responses = {
            'en': [
                "Based on your query, I recommend using organic fertilizers for better soil health.",
                "For this season, consider planting wheat or mustard depending on your soil type.",
                "Regular irrigation is crucial. I suggest drip irrigation for water efficiency.",
                "Monitor your crops for pest attacks. Use neem-based pesticides for organic farming."
            ],
            'hi': [
                "आपके प्रश्न के आधार पर, मैं बेहतर मिट्टी स्वास्थ्य के लिए जैविक उर्वरकों का उपयोग करने की सलाह देता हूं।",
                "इस मौसम के लिए, अपनी मिट्टी के प्रकार के आधार पर गेहूं या सरसों लगाने पर विचार करें।",
                "नियमित सिंचाई महत्वपूर्ण है। मैं पानी की दक्षता के लिए ड्रिप सिंचाई का सुझाव देता हूं।"
            ]
        }
        import random
        answer = random.choice(responses.get(language, responses['en']))

    # Save to database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO ai_chat_history (user_id, question, answer, language)
        VALUES (?, ?, ?, ?)
    ''', (user_id, question, answer, language))
    conn.commit()
    conn.close()

    return jsonify({
        'question': question,
        'answer': answer,
        'language': language
    }), 200

# Dashboard stats endpoint
@app.route('/api/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()
    
    conn = get_db()
    cursor = conn.cursor()
    
    # Get various stats
    cursor.execute('SELECT COUNT(*) as count FROM disease_detections WHERE user_id = ?', (user_id,))
    disease_scans = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM irrigation_plans WHERE user_id = ?', (user_id,))
    irrigation_plans = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM products WHERE seller_id = ?', (user_id,))
    products_listed = cursor.fetchone()['count']
    
    cursor.execute('SELECT COUNT(*) as count FROM ai_chat_history WHERE user_id = ?', (user_id,))
    ai_chats = cursor.fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'disease_scans': disease_scans,
        'irrigation_plans': irrigation_plans,
        'products_listed': products_listed,
        'ai_chats': ai_chats
    }), 200

# Socket.IO events for real-time chat
@socketio.on('join')
def on_join(data):
    room = data.get('room', 'general')
    join_room(room)
    emit('user_joined', {'message': f"User joined {room}"}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data.get('room', 'general')
    leave_room(room)
    emit('user_left', {'message': f"User left {room}"}, room=room)

@socketio.on('send_message')
def handle_message(data):
    room = data.get('room', 'general')
    message = data.get('message', '')
    user_id = data.get('user_id')
    
    # Save message to database
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO chat_messages (sender_id, message, room)
        VALUES (?, ?, ?)
    ''', (user_id, message, room))
    conn.commit()
    
    # Get sender info
    cursor.execute('SELECT name, profile_image FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    
    emit('new_message', {
        'user_id': user_id,
        'username': user['name'] if user else 'Anonymous',
        'profile_image': user['profile_image'] if user else '',
        'message': message,
        'timestamp': datetime.now().isoformat(),
        'room': room
    }, room=room)

@socketio.on('typing')
def handle_typing(data):
    room = data.get('room', 'general')
    username = data.get('username', 'User')
    emit('user_typing', {'username': username}, room=room, include_self=False)

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'AgriSmart 2.0 API'}), 200

# 👇 ADD THIS NEW ROUTE 👇
@app.route('/')
def home():
    return jsonify({"message": "AgriSmart 2.0 Backend is running!"})

@app.route('/api/ai/speak', methods=['POST'])
def elevenlabs_tts():
    try:
        data = request.get_json()
        text = data.get("text", "").strip()
        
        if not text:
            return jsonify({"error": "Text is required"}), 400

        api_key = os.getenv("ELEVENLABS_API_KEY")
        if not api_key:
            return jsonify({"error": "ElevenLabs API key not configured"}), 500

        # Default voice: "Rachel" (you can change this)
        VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": api_key
        }
        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        response = requests.post(url, json=payload, headers=headers)

        if response.status_code == 200:
            audio_base64 = base64.b64encode(response.content).decode('utf-8')
            return jsonify({"audio": audio_base64})
        else:
            return jsonify({"error": f"ElevenLabs error: {response.status_code}"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Initialize database on startup
with app.app_context():
    init_db()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)