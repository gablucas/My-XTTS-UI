import os
from flask import Blueprint, jsonify, request
from db.voices_db import save_voice, get_voices_db, delete_voice_db, update_voice_db
from utils import delete_file_folder, extract_emotion
from config import Config
import logging

voices_controller = Blueprint('voices_controller', __name__)


# ROTA PARA ADICIONAR UMA NOVA VOZ
@voices_controller.route('/voices_files', methods=['POST'])
def add_voice():
    files = request.files.getlist('file')

    for file in files:
        audio_name = file.filename.split('.wav')[0]
        emotion = extract_emotion(file.filename)
        output_path = os.path.join("static/output/voices", file.filename)
        file.save(output_path)
        save_voice(audio_name, output_path, emotion, "temporary", 0)
    
    return jsonify({'message': 'Voice added successfully'}), 201

# ROTA PARA LISTAR TODAS AS VOZES
@voices_controller.route('/voices_files', methods=['GET'])
def list_voices():
    voices = get_voices_db()
    voice_list = [{'id': row[0], 'voice_name': row[1], 'voice_path': row[2], 'voice_emotion': row[3], 'voice_type': row[4], 'voice_complement': row[5]} for row in voices]
    return jsonify(voice_list), 200

@voices_controller.route('/voices_files', methods=['DELETE'])
def delete_voice():
    data = request.json
    print(data)

    if not data['id']:
        return jsonify({'error': 'File name is required'}), 400

    db_success, db_message = delete_voice_db(data['id'])
    file_success, file_message = delete_file_folder(data['path'])

    if file_success and db_success:
        return jsonify({'message': f"{file_message}. {db_message}"}), 200
    elif file_success:
        return jsonify({'error': db_message}), 400
    elif db_success:
        return jsonify({'error': file_message}), 400
    else:
        return jsonify({'error': f"{file_message}. {db_message}"}), 400

# ROTA PARA ATUALIZAR INFORMAÇÕES DE UMA VOZ PELO ID
@voices_controller.route('/voices_files', methods=['PUT'])
def update_voice():
    try:
        # Obtenha os dados enviados na solicitação
        data = request.json
        print(data)

        # Garanta que os dados enviados não estejam vazios
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Atualize a voz usando a função update_voice
        update_voice_db(data['type'], data['complement'], data['id'])

        # Retorna uma resposta de sucesso
        return jsonify({'message': 'Voice updated successfully'}), 200

    except Exception as e:
        # Retorna uma resposta de erro se algo der errado
        return jsonify({'error': str(e)}), 500


# ROTA PARA BUSCAR INFORMAÇÕES SOBRE UMA VOZ PELO ID
@voices_controller.route('/voices_files/<int:voice_id>', methods=['GET'])
def get_voice(voice_id):
    # Implemente a lógica para buscar informações sobre a voz com o ID especificado
    # Se a voz não existir, retorne um erro 404
    # Se encontrar a voz, retorne suas informações em formato JSON
    pass


# ROTA PARA EXCLUIR UMA VOZ PELO ID
@voices_controller.route('/voices_files/<int:voice_id>', methods=['DELETE'])
def delete_voice_by_id(voice_id):
    # Implemente a lógica para excluir a voz com o ID especificado
    pass