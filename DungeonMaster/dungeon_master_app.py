from flask import Flask, request
from session_manager import SessionManager
from flask_json import FlaskJSON, JsonError, json_response, as_json

app = Flask(__name__)
FlaskJSON(app)

manager = SessionManager()


@app.route('/session', methods=['post'])
def create_session():
    data = request.get_json(force=True)
    s_id = data['id']
    genre = data['genre']
    intro = data['intro']
    players = data['players']
    res = manager.new_session(s_id, intro, genre, players)
    return json_response(text=res['text'])


@app.route('/session/<int:session_id>', methods=['delete'])
def delete_session(session_id):
    manager.del_session(session_id)


@app.route('/session/<int:session_id>/message', methods=['post'])
def get_message(session_id):
    data = request.get_json(force=True)
    sender = data['sender_name']
    text = data['text']
    res = manager.message(session_id, sender, text)
    return json_response(text=res['text'], game_end=res['game_end'])


app.run(debug=True)
