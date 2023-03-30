from flask import Flask, request, render_template, session, redirect
from flask_socketio import send, join_room, leave_room, SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Very strong secret string'
socket_io = SocketIO(app)
socket_io.init_app(app, cors_allowed_origins="*")


@app.route('/')
def start_page():
    return render_template('one_page.html')


@app.route('/room/<int:id>')
def room_join(id):
    return render_template('one_page.html')


app.run(debug=True)