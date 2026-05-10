import os
import requests

NEMOAGENT_API_URL = os.getenv('NEMOAGENT_API_URL', 'http://localhost:8000/api')

def test_health():
    url = f"{NEMOAGENT_API_URL}/health"
    response = requests.get(url)
    assert response.status_code == 200
    assert response.json().get('status', '').lower() in ['ok', 'healthy']

def test_simple_agent_ping():
    url = f"{NEMOAGENT_API_URL}/ping"
    response = requests.get(url)
    assert response.status_code == 200
    assert response.text.strip().lower() in ['pong', 'ok']
