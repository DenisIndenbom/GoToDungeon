from flask import Flask, request, render_template, session, redirect
from flask_socketio import send, join_room, leave_room, SocketIO
import random, string
from uuid import uuid4

from room import Room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Very strong secret string'
socket_io = SocketIO(app)

rooms = {}
KEY_LENGTH = 10
KEY_RANDOM_TRYING = 10


def random_id(length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(length))


def random_id_uuid():
    return str(uuid4())


def random_new_room_id():
    for _ in range(KEY_RANDOM_TRYING):
        room_id = random_id_uuid()
        if room_id not in rooms:
            return room_id
    return ''


# Routes

@app.route('/')
def start_screen():
    session.clear()
    return render_template("index.html")


@app.route('/config')
def room_creator():
    return render_template("room_config.html")


@app.route('/config', methods=["POST"])
def create_room():
    genre = request.form.get('genre')
    intro = request.form.get('intro')

    if (not genre) or (not intro):
        return redirect('/config')

    room_id = random_new_room_id()
    if len(room_id) == 0:
        return redirect('/config')

    player_id = random_id_uuid()
    rooms[room_id] = Room(player_id, genre, intro)

    session['player_id'] = player_id
    session['room_id'] = room_id

    return redirect('/wait/' + room_id)


@app.route('/wait/<int:room_id>')
def wait_room(room_id):
    session['room_id'] = room_id
    if room_id not in rooms:
        return redirect("/")

    player_id = random_id_uuid()
    session['player_id'] = player_id

    if not rooms[room_id].join(player_id):
        return redirect('/wait/' + room_id)

    return render_template("waiting_room.html")


@app.route('/room/<int:room_id>')
def room(room_id):
    session['room_id'] = room_id
    player_id = session.get('player_id')
    if room_id not in rooms:
        return redirect("/")
    if not rooms[room_id].check_player_exist(player_id):
        return redirect("/")
    return render_template("room.html")


app.run(debug=True)
