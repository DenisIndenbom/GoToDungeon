from flask import Flask, request, render_template
import random, string

app = Flask(__name__)

def random_id(length):
    letters = string.ascii_uppercase
    return ''.join(random.choice(letters) for i in range(length))

@app.route('/')
def start_screen():
    return render_template("index.html")

@app.route('/config')
def room_creator():
    return render_template("room_config.html")

@app.route('/wait')
def create_room():
    return render_template("waiting_room.html")

@app.route('/room')
def room():
    return render_template("room.html")

app.run(debug=True)