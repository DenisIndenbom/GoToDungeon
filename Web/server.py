from flask import Flask, request, render_template, session, redirect
from flask_socketio import send, join_room, leave_room, SocketIO, emit
import simple_websocket

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Very strong secret string'
socket_io = SocketIO(app)
socket_io.init_app(app, cors_allowed_origins="*")

messages = []

@app.route('/')
def main_page():
    return render_template('test_index.html')


@socket_io.on('connect')
def user_connect():
    print('User connect!')
    emit('srv_to_clt', {"msg": "New user!"}, broadcast=True)
    emit('history', {"data": messages})


@socket_io.on('clt_to_srv')
def message(msg_):
    msg = msg_['data']
    print(msg)
    messages.append(msg)
    emit('srv_to_clt', {"msg": msg}, broadcast=True)

app.run(debug=True)