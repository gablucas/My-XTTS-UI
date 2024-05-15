from flask import Blueprint, render_template

main = Blueprint('main', __name__)

@main.route('/')
def index():
    
    return render_template('index.html')

@main.route('/voices')
def voices():
    minha_lista = ['Item 1', 'Item 2', 'Item 3', 'Item 4']
    return render_template('voices.html', minha_lista=minha_lista)
