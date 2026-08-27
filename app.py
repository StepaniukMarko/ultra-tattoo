from flask import Flask, render_template, request, jsonify
import sqlite3
import os
import requests as http_requests
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

DB_PATH = os.path.join(os.path.dirname(__file__), 'leads.db')

# Telegram config (set in Railway Environment Variables)
TG_BOT_TOKEN = os.environ.get('TG_BOT_TOKEN', '')
TG_CHAT_ID = os.environ.get('TG_CHAT_ID', '')

# Admin password for viewing leads (set in Railway Environment Variables)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', '')


def init_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        telegram TEXT,
        message TEXT,
        status TEXT DEFAULT 'Нова',
        note TEXT DEFAULT '',
        source TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )''')
    # Add columns if missing (migration)
    try:
        conn.execute('ALTER TABLE leads ADD COLUMN status TEXT DEFAULT "Нова"')
    except Exception:
        pass
    try:
        conn.execute('ALTER TABLE leads ADD COLUMN note TEXT DEFAULT ""')
    except Exception:
        pass
    try:
        conn.execute('ALTER TABLE leads ADD COLUMN source TEXT DEFAULT ""')
    except Exception:
        pass
    conn.commit()
    conn.close()

init_db()


def send_telegram_notification(lead_data):
    """Send lead notification to Telegram. Fails silently."""
    if not TG_BOT_TOKEN or not TG_CHAT_ID:
        return

    now = datetime.now().strftime('%d.%m.%Y %H:%M')
    text = (
        f"🔔 *Нова заявка Mark Labs*\n\n"
        f"👤 Ім'я: {lead_data.get('name', '—')}\n"
        f"📞 Телефон: {lead_data.get('phone', '—')}\n"
        f"✈️ Telegram: {lead_data.get('telegram', '—')}\n"
        f"💬 Повідомлення: {lead_data.get('message', '—')}\n"
        f"📅 Дата: {now}"
    )

    try:
        http_requests.post(
            f'https://api.telegram.org/bot{TG_BOT_TOKEN}/sendMessage',
            json={
                'chat_id': TG_CHAT_ID,
                'text': text,
                'parse_mode': 'Markdown'
            },
            timeout=5
        )
    except Exception:
        pass  # Telegram unavailable — lead still saved to DB


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/case/smiledent')
def case_smiledent():
    return render_template('case_smiledent.html')

@app.route('/case/blackhorse')
def case_blackhorse():
    return render_template('case_smiledent.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin_panel():
    if request.method == 'POST':
        password = request.form.get('password', '')
        if password == ADMIN_PASSWORD:
            # Show leads
            conn = sqlite3.connect(DB_PATH)
            rows = conn.execute('SELECT * FROM leads ORDER BY id DESC').fetchall()
            conn.close()
            leads = [{'id': r[0], 'name': r[1], 'phone': r[2], 'telegram': r[3], 'message': r[4], 'date': r[5]} for r in rows]
            return render_template('admin.html', leads=leads, authenticated=True)
        return render_template('admin.html', error='Невірний пароль', authenticated=False)
    return render_template('admin.html', authenticated=False)

@app.route('/admin/status', methods=['POST'])
def update_lead_status():
    data = request.get_json()
    password = data.get('key', '')
    if password != ADMIN_PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401
    lead_id = data.get('id')
    status = data.get('status', '')
    note = data.get('note', '')
    conn = sqlite3.connect(DB_PATH)
    conn.execute('UPDATE leads SET status=?, note=? WHERE id=?', (status, note, lead_id))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/sitemap.xml')
def sitemap():
    return app.send_static_file('sitemap.xml')

@app.route('/robots.txt')
def robots():
    return app.send_static_file('robots.txt')


@app.route('/api/lead', methods=['POST'])
def submit_lead():
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name required'}), 400

    name = data.get('name', '').strip()
    phone = data.get('phone', '').strip()
    telegram = data.get('telegram', '').strip()
    message = data.get('message', '').strip()

    # Save to database
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            'INSERT INTO leads (name, phone, telegram, message) VALUES (?, ?, ?, ?)',
            (name, phone, telegram, message)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        return jsonify({'error': 'Database error'}), 500

    # Send Telegram notification (non-blocking, fails silently)
    send_telegram_notification(data)

    return jsonify({'success': True})


@app.route('/api/leads')
def get_leads():
    """View leads — protected by password."""
    password = request.args.get('key', '')
    if not ADMIN_PASSWORD or password != ADMIN_PASSWORD:
        return jsonify({'error': 'Unauthorized'}), 401

    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute('SELECT * FROM leads ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([{
        'id': r[0], 'name': r[1], 'phone': r[2],
        'telegram': r[3], 'message': r[4], 'date': r[5]
    } for r in rows])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
