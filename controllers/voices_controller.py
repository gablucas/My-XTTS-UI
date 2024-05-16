import os
from flask import Blueprint, jsonify, request
from db.voices_db import save_voice, get_voices_db
from config import Config
from utils import get_unique_output_path
import logging

voices_controller = Blueprint('voices_controller', __name__)


# ROTA PARA ADICIONAR UMA NOVA VOZ
@voices_controller.route('/voices_files', methods=['POST'])
def add_voice():
    files = request.files.getlist('file')

    for file in files:

        base_name, output_path = get_unique_output_path("static/output/voices", file_name_without_extension, "voice")
        file.save(output_path)
        save_voice(base_name, output_path, "normal", "temporary", 0)
    
    return jsonify({'message': 'Voice added successfully'}), 201

# ROTA PARA LISTAR TODAS AS VOZES
@voices_controller.route('/voices_files', methods=['GET'])
def list_voices():
    voices = get_voices_db()
    voice_list = [{'id': row[0], 'voice_name': row[1], 'voice_path': row[2], 'voice_emotion': row[3], 'voice_type': row[4], 'voice_complement': row[5]} for row in voices]
    return jsonify(voice_list), 200

# ROTA PARA BUSCAR INFORMAÇÕES SOBRE UMA VOZ PELO ID
@voices_controller.route('/voices_files/<int:voice_id>', methods=['GET'])
def get_voice(voice_id):
    # Implemente a lógica para buscar informações sobre a voz com o ID especificado
    # Se a voz não existir, retorne um erro 404
    # Se encontrar a voz, retorne suas informações em formato JSON
    pass

# ROTA PARA ATUALIZAR INFORMAÇÕES DE UMA VOZ PELO ID
@voices_controller.route('/voices_files/<int:voice_id>', methods=['PUT'])
def update_voice(voice_id):
    # Implemente a lógica para atualizar as informações da voz com o ID especificado
    pass

# ROTA PARA EXCLUIR UMA VOZ PELO ID
@voices_controller.route('/voices_files/<int:voice_id>', methods=['DELETE'])
def delete_voice(voice_id):
    # Implemente a lógica para excluir a voz com o ID especificado
    pass