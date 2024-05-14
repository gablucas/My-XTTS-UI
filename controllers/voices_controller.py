from flask import Blueprint, jsonify, request
from db.voices_db import save_voice, list_voices
from utils import get_unique_output_path
from config import Config

voices_controller = Blueprint('voices_controller', __name__)




# ROTA PARA ADICIONAR UMA NOVA VOZ
@voices_controller.route('/voices', methods=['POST'])
def add_voice():
    data = request.json
    name = data.get('name')
    description = data.get('description', '')

    if not name:
        return jsonify({'error': 'Name is required'}), 400

    save_voice(name, description)
    return jsonify({'message': 'Voice added successfully'}), 201

# ROTA PARA LISTAR TODAS AS VOZES
@voices_controller.route('/voices', methods=['GET'])
def list_voices():
    voices = list_voices()
    voice_list = [{'id': row[0], 'name': row[1], 'description': row[2]} for row in voices]
    return jsonify(voice_list), 200

# ROTA PARA BUSCAR INFORMAÇÕES SOBRE UMA VOZ PELO ID
@voices_controller.route('/voices/<int:voice_id>', methods=['GET'])
def get_voice(voice_id):
    # Implemente a lógica para buscar informações sobre a voz com o ID especificado
    # Se a voz não existir, retorne um erro 404
    # Se encontrar a voz, retorne suas informações em formato JSON
    pass

# ROTA PARA ATUALIZAR INFORMAÇÕES DE UMA VOZ PELO ID
@voices_controller.route('/voices/<int:voice_id>', methods=['PUT'])
def update_voice(voice_id):
    # Implemente a lógica para atualizar as informações da voz com o ID especificado
    pass

# ROTA PARA EXCLUIR UMA VOZ PELO ID
@voices_controller.route('/voices/<int:voice_id>', methods=['DELETE'])
def delete_voice(voice_id):
    # Implemente a lógica para excluir a voz com o ID especificado
    pass