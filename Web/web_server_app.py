from flask import Flask, request, render_template
import random, string

app = Flask(__name__)

def random_id(length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(length))

@app.route('/')
def start_screen():
    return render_template("index.html")

@app.route('/start', methods=["post", "get"])
def room_creator():
    return render_template("room.html")

@app.route('/room', methods=["post"])
def create_room():
    room_id = random_id(5)
    return room_id

app.run(debug=True)