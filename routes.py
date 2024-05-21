from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    
    return render_template('index.html')

@main.route('/voices')
def voices():
    return render_template('voices.html')
