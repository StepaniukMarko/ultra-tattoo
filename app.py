from flask import Flask, render_template, request, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

DB_PATH = os.path.join(os.path.dirname(__file__), 'leads.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        telegram TEXT,
        message TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/lead', methods=['POST'])
def submit_lead():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name required'}), 400
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        'INSERT INTO leads (name, phone, telegram, message) VALUES (?, ?, ?, ?)',
        (data.get('name', ''), data.get('phone', ''), data.get('telegram', ''), data.get('message', ''))
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/leads')
def get_leads():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute('SELECT * FROM leads ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([{'id': r[0], 'name': r[1], 'phone': r[2], 'telegram': r[3], 'message': r[4], 'date': r[5]} for r in rows])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
