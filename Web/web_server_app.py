from flask import Flask, render_template
from dotenv import dotenv_values

from waitress import serve

config = dotenv_values(".env")

port = int(config['PORT'])
debug = config['DEBUG'] == 'true'

app = Flask(__name__)
app.config['SECRET_KEY'] = hex(64)


@app.route('/')
def start_page():
    return render_template('one_page.html')


@app.route('/room/<string:id>')
def room_join(id: str):
    return render_template('one_page.html')


if __name__ == "__main__":
    if debug:
        app.run( host='0.0.0.0', port=port, debug=debug)
    else:
        serve(app, host='0.0.0.0', port=port)