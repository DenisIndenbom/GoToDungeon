from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = hex(64)

@app.route('/')
def start_page():
    return render_template('one_page.html')


@app.route('/room/<string:id>')
def room_join(id: str):
    return render_template('one_page.html')


app.run(debug=True)