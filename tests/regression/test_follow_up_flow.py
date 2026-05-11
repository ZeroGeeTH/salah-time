import pytest
from app import create_app
from app.models import db, User, FollowUp
from flask import url_for

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.session.remove()
            db.drop_all()

def create_user(username, email):
    user = User(username=username, email=email)
    db.session.add(user)
    db.session.commit()
    return user

def create_followup(user_id, content):
    fu = FollowUp(user_id=user_id, content=content)
    db.session.add(fu)
    db.session.commit()
    return fu

def login(client, username, password='password'):
    return client.post('/login', data=dict(
        username=username,
        password=password
    ), follow_redirects=True)

def test_followup_creation_and_listing(client):
    user = create_user('alice', 'alice@example.com')
    # Simulate login if needed, else stub session
    with client.session_transaction() as sess:
        sess['user_id'] = user.id
    resp = client.post(url_for('followup.create'), data={
        'content': 'Follow up on issue 123.'
    }, follow_redirects=True)
    assert resp.status_code == 200
    # Should display the new follow-up
    assert b'Follow up on issue 123.' in resp.data

def test_followup_edit_flow(client):
    user = create_user('bob', 'bob@example.com')
    followup = create_followup(user.id, 'Initial content')
    with client.session_transaction() as sess:
        sess['user_id'] = user.id
    resp = client.post(url_for('followup.edit', id=followup.id), data={
        'content': 'Edited content'
    }, follow_redirects=True)
    assert resp.status_code == 200
    assert b'Edited content' in resp.data
    # Query updated followup from db
    fu = FollowUp.query.get(followup.id)
    assert fu.content == 'Edited content'

def test_followup_deletion(client):
    user = create_user('carol', 'carol@example.com')
    followup = create_followup(user.id, 'To be deleted')
    with client.session_transaction() as sess:
        sess['user_id'] = user.id
    resp = client.post(url_for('followup.delete', id=followup.id), follow_redirects=True)
    assert resp.status_code == 200
    # Should not display deleted content
    assert b'To be deleted' not in resp.data
    # Should not exist in db
    fu = FollowUp.query.get(followup.id)
    assert fu is None

def test_followup_auth_required(client):
    # Should redirect to login when not logged in
    resp = client.post(url_for('followup.create'), data={
        'content': 'No auth'
    }, follow_redirects=False)
    assert resp.status_code in (302, 401, 403)
