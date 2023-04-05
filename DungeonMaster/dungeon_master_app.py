import os
from dotenv import dotenv_values

from flask import Flask, request
from session_manager import SessionManager
from flask_json import FlaskJSON, json_response

from waitress import serve

config = dotenv_values(".env")

os.environ["OPENAI_API_KEY"] = config["OPENAI_API_KEY"]

app = Flask(__name__)
FlaskJSON(app)

manager = SessionManager()


@app.route('/test',  methods=['post'])
def test():
    return json_response(text='This is a test message!')


@app.route('/session', methods=['post'])
def create_session():
    data = request.get_json(force=True)

    try:
        s_id = data['id']
        genre = data['genre']
        intro = data['intro']
        players = data['players']
    except KeyError:
        return json_response(400)

    res = manager.new_session(s_id, intro, genre, players)

    return json_response(text=res['text'])


@app.route('/session/<string:session_id>', methods=['delete'])
def delete_session(session_id):
    manager.del_session(session_id)


@app.route('/session/<string:session_id>/message', methods=['post'])
def get_message(session_id):
    data = request.get_json(force=True)
    sender = data['sender_name']
    text = data['text']

    res = manager.message(session_id, sender, text)

    return json_response(text=res['text'], game_end=res['game_end']) if res is not None else json_response(400)


if __name__ == "__main__":
    serve(app, host=config['IP'], port=int(config['PORT']))
