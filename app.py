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


@app.route('/api/generate-concept', methods=['POST'])
def generate_concept():
    """Generate site concept via Gemini API."""
    data = request.get_json()
    if not data or not data.get('business', '').strip():
        return jsonify({'error': 'Вкажіть тип бізнесу'}), 400

    business = data['business'].strip()[:200]

    gemini_key = os.environ.get('GEMINI_API_KEY', '')
    if not gemini_key:
        return jsonify({'error': 'GEMINI_API_KEY не встановлено'}), 503

    prompt = (
        "Поверни ТІЛЬКИ валідний HTML. Перший символ відповіді — '<', останній — '>'.\n"
        "Не пиши пояснень. Не пиши markdown. Не пиши ```html. Нічого крім HTML.\n\n"
        f"Створи одну повністю готову landing page для ніші: {business}\n\n"
        "ВИМОГИ:\n"
        "- Всі тексти українською, жодного Lorem Ipsum\n"
        "- Всі стилі тільки inline (style=\"...\")\n"
        "- Кольори підібрані під нішу бізнесу\n"
        "- Font-family: system-ui,-apple-system,sans-serif\n"
        "- Контент обгорнути у div max-width:1200px;margin:0 auto;padding:0 1.5rem\n"
        "- Кнопки: onmouseover=\"this.style.opacity='0.85'\" onmouseout=\"this.style.opacity='1'\"\n\n"
        "СТРУКТУРА — рівно 6 блоків:\n\n"
        "1. nav — sticky, backdrop-filter:blur(10px), логотип + 4 посилання + CTA кнопка\n\n"
        "2. section hero — min-height:580px, display:flex, align-items:center\n"
        "   фон: яскравий CSS gradient під нішу\n"
        "   всередині: бейдж (emoji + назва ніші), H1 font-size:3.5rem font-weight:900 колір #fff\n"
        "   підзаголовок font-size:1.15rem color:rgba(255,255,255,0.85) max-width:540px\n"
        "   2 кнопки + рядок ★★★★★ з кількістю клієнтів\n\n"
        "3. section — background:#f8f9fa, padding:5rem 0\n"
        "   H2 по центру + підзаголовок\n"
        "   4 картки display:grid grid-template-columns:repeat(2,1fr) gap:1.5rem\n"
        "   картка: background:#fff border-radius:20px box-shadow:0 2px 20px rgba(0,0,0,0.07) padding:2rem\n"
        "   emoji font-size:2.5rem + h3 + 2 речення тексту\n\n"
        "4. section — background:#f0f2f5, padding:5rem 0\n"
        "   H2 по центру + підзаголовок\n"
        "   6 карток display:grid grid-template-columns:repeat(3,1fr) gap:1.25rem\n"
        "   картка: background:#fff border-radius:16px box-shadow:0 4px 24px rgba(0,0,0,0.08) padding:1.75rem\n"
        "   назва bold + 2 речення опису + ціна або кнопка внизу\n\n"
        "5. section — 4 картки-кейси display:grid grid-template-columns:repeat(2,1fr) gap:1.5rem\n"
        "   кожна картка: div висотою 180px з CSS gradient (унікальні кольори) + назва проєкту + результат\n\n"
        "6. section — CTA, текст по центру, gradient фон під нішу\n"
        "   H2 font-size:2.5rem color:#fff + підзаголовок + велика кнопка\n"
        "   потім: footer темний (#111), логотип + копірайт\n\n"
        "Обгорни весь HTML у:\n"
        "<div class=\"site-preview\" style=\"font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color:#1a1a1a;margin:0;padding:0\">"
        " [контент] </div>\n\n"
        "Починай відповідь ОДРАЗУ з символу <"
    )

    try:
        url = (
            'https://generativelanguage.googleapis.com/v1beta/models/'
            f'gemini-3.6-flash:generateContent?key={gemini_key}'
        )
        body = {
            'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {
                'temperature': 0.9,
                'maxOutputTokens': 2500
            }
        }

        print(f'[Gemini] POST {url[:80]}...', flush=True)

        resp = http_requests.post(url, json=body, timeout=30)

        print(f'[Gemini] Status: {resp.status_code}', flush=True)
        print(f'[Gemini] Response: {resp.text[:500]}', flush=True)

        if not resp.ok:
            return jsonify({
                'error': f'Gemini API error {resp.status_code}',
                'details': resp.text[:300]
            }), 502

        result = resp.json()
        text = (
            result
            .get('candidates', [{}])[0]
            .get('content', {})
            .get('parts', [{}])[0]
            .get('text', '')
        )
        if not text:
            print(f'[Gemini] Empty text, full response: {result}', flush=True)
            return jsonify({'error': 'Порожня відповідь від AI'}), 500

        # Strip markdown fences and any leading/trailing non-HTML text
        import re as _re
        text = _re.sub(r'^```[a-z]*\n?', '', text.strip(), flags=_re.IGNORECASE)
        text = _re.sub(r'\n?```$', '', text.strip())
        text = text.strip()
        # Ensure response starts with < and ends with >
        start = text.find('<')
        end = text.rfind('>')
        if start != -1 and end != -1 and end > start:
            text = text[start:end + 1]

        print(f'[Gemini] html len={len(text)}, starts={repr(text[:40])}, ends={repr(text[-40:])}', flush=True)

        return jsonify({'success': True, 'html': text})
    except http_requests.exceptions.Timeout:
        return jsonify({'error': 'Час очікування вичерпано. Спробуйте ще раз.'}), 504
    except Exception as e:
        print(f'[Gemini] Exception: {type(e).__name__}: {e}', flush=True)
        return jsonify({'error': f'Помилка генерації: {type(e).__name__}: {e}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
