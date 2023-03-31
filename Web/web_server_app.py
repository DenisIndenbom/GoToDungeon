from flask import Flask, request, render_template, session, redirect

app = Flask(__name__)


@app.route('/')
def start_page():
    return render_template('one_page.html')


@app.route('/room/<int:id>')
def room_join(id):
    return render_template('one_page.html')


app.run(debug=True)
