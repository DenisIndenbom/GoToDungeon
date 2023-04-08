import os

from flask import Flask, render_template
from dotenv import dotenv_values

from waitress import serve

config = dotenv_values(".env")

debug = config['DEBUG'] == 'true'
room_server_address = config['ROOM_SERVER_ADDRESS']
port = int(config['PORT'])

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(64).hex()


@app.route('/')
def start_page():
    return render_template('one_page.html', room_server_address=room_server_address)


@app.route('/room/<string:id>')
def room_join(id: str):
    return render_template('one_page.html', room_server_address=room_server_address)


if __name__ == "__main__":
    if debug:
        app.run(host='0.0.0.0', port=port, debug=debug)
    else:
        serve(app, host='0.0.0.0', port=port)
