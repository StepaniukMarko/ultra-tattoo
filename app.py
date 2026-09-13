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
        f"Створи HTML-макет головної сторінки сайту для бізнесу: {business}\n\n"
        "ВАЖЛИВО: Поверни ТІЛЬКИ HTML-код. Без пояснень, без markdown, без коментарів поза HTML.\n"
        "Починай одразу з <div class=\"site-preview\">\n\n"
        "Вимоги до HTML:\n"
        "1. Використовуй тільки inline styles — зовнішні CSS-файли недоступні.\n"
        "2. Всі секції мають бути стилізовані inline.\n"
        "3. Підбери кольорову палітру під нішу бізнесу.\n\n"
        "Структура — рівно ці секції по порядку:\n\n"
        "<div class=\"site-preview\">\n\n"
        "  <!-- 1. NAV -->\n"
        "  <nav style=\"...\">\n"
        "    <div style=\"font-weight:700;font-size:1.2rem\">[Назва бренду]</div>\n"
        "    <div style=\"display:flex;gap:1.5rem\">[3-4 пункти меню]</div>\n"
        "    <button style=\"...\">[CTA кнопка]</button>\n"
        "  </nav>\n\n"
        "  <!-- 2. HERO -->\n"
        "  <section style=\"min-height:420px;display:flex;align-items:center;background:[колір або градієнт];padding:4rem 3rem\">\n"
        "    <div>\n"
        "      <p style=\"font-size:0.85rem;opacity:0.7;margin-bottom:0.5rem\">[Ніша / категорія]</p>\n"
        "      <h1 style=\"font-size:2.5rem;font-weight:800;margin-bottom:1rem;line-height:1.2\">[Головний заголовок]</h1>\n"
        "      <p style=\"font-size:1.1rem;opacity:0.85;margin-bottom:2rem;max-width:500px\">[УТП — 1-2 речення]</p>\n"
        "      <div style=\"display:flex;gap:1rem\">\n"
        "        <button style=\"...\">[Головна CTA]</button>\n"
        "        <button style=\"...\">[Вторинна CTA]</button>\n"
        "      </div>\n"
        "    </div>\n"
        "  </section>\n\n"
        "  <!-- 3. ПЕРЕВАГИ (3 картки) -->\n"
        "  <section style=\"padding:3rem;background:[колір]\">\n"
        "    <h2 style=\"text-align:center;margin-bottom:2rem\">[Заголовок секції]</h2>\n"
        "    <div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem\">\n"
        "      [3 картки: іконка-емодзі + заголовок + текст]\n"
        "    </div>\n"
        "  </section>\n\n"
        "  <!-- 4. ПОСЛУГИ / МЕНЮ (4-6 карток) -->\n"
        "  <section style=\"padding:3rem;background:[колір]\">\n"
        "    <h2 style=\"text-align:center;margin-bottom:2rem\">[Назва секції]</h2>\n"
        "    <div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem\">\n"
        "      [4-6 карток з реальними послугами/товарами ніші]\n"
        "    </div>\n"
        "  </section>\n\n"
        "  <!-- 5. ВІДГУК (1 цитата) -->\n"
        "  <section style=\"padding:3rem;background:[колір];text-align:center\">\n"
        "    <blockquote style=\"font-size:1.2rem;max-width:600px;margin:0 auto\">\n"
        "      [Реалістичний відгук клієнта нішевого бізнесу]\n"
        "    </blockquote>\n"
        "    <p style=\"margin-top:1rem;font-weight:600\">[Ім'я клієнта]</p>\n"
        "  </section>\n\n"
        "  <!-- 6. CTA FOOTER -->\n"
        "  <section style=\"padding:3rem;text-align:center;background:[акцентний колір]\">\n"
        "    <h2 style=\"font-size:1.8rem;margin-bottom:1rem\">[Фінальний заклик]</h2>\n"
        "    <p style=\"opacity:0.85;margin-bottom:1.5rem\">[Підзаголовок]</p>\n"
        "    <button style=\"font-size:1rem;padding:1rem 2.5rem;border-radius:8px;cursor:pointer;border:none;font-weight:700\">[CTA]</button>\n"
        "  </section>\n\n"
        "</div>\n\n"
        "Правила стилів:\n"
        "- Підбери кольори під нішу (медицина — білий/синій, барбершоп — темний/золотий, ресторан — теплий/кремовий тощо)\n"
        "- Всі тексти — тільки реальний контент для цього бізнесу, жодних плейсхолдерів 'Lorem ipsum'\n"
        "- Font-family: inherit або system-ui\n"
        "- Border-radius на картках: 12px\n"
        "- Box-shadow: 0 2px 12px rgba(0,0,0,0.08)\n"
        "- Кнопки: padding 0.75rem 1.75rem, border-radius 8px, cursor:pointer\n\n"
        "Відповідай ТІЛЬКИ HTML без жодного тексту поза тегами."
    )

    try:
        url = (
            'https://generativelanguage.googleapis.com/v1beta/models/'
            f'gemini-3.6-flash:generateContent?key={gemini_key}'
        )
        body = {
            'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {
                'temperature': 0.8,
                'maxOutputTokens': 3000
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

        # Strip markdown code fences if Gemini wraps HTML in ```html ... ```
        import re as _re
        text = _re.sub(r'^```[a-z]*\n?', '', text.strip(), flags=_re.IGNORECASE)
        text = _re.sub(r'\n?```$', '', text.strip())
        text = text.strip()

        print(f'[Gemini] html len={len(text)}, tail={repr(text[-200:])}', flush=True)

        return jsonify({'success': True, 'html': text})
    except http_requests.exceptions.Timeout:
        return jsonify({'error': 'Час очікування вичерпано. Спробуйте ще раз.'}), 504
    except Exception as e:
        print(f'[Gemini] Exception: {type(e).__name__}: {e}', flush=True)
        return jsonify({'error': f'Помилка генерації: {type(e).__name__}: {e}'}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
