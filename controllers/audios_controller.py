import os
from flask import Blueprint, jsonify, current_app, request
import torch
import torchaudio
from db.audios_db import save_audio, get_audios, delete_audio_db
from model_loader import load_model
from utils import get_unique_output_path, delete_file_folder
from config import Config

model = load_model(runmodel=Config.RUN_MODEL)

audios_controller = Blueprint('audios_controller', __name__)

# GERAR VOZ
@audios_controller.route('/audio_files', methods=['POST'])
def generate():

    data = request.json
    voices = data['voices']
    speech = data['text']
    number = int(data['number'])

    for voice in voices:
        print("Computing speaker latents...")
        gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(audio_path=[f"static/output/voices/{voice}.wav"])

        print("Inference...")
        for i in range(number):
            out = model.inference(
                speech,
                "en",
                gpt_cond_latent,
                speaker_embedding,
                temperature=0.7,  # Adicione parâmetros personalizados aqui
            )
            
            output_path = get_unique_output_path(voice)
            torchaudio.save(output_path, torch.tensor(out["wav"]).unsqueeze(0), 24000)
    
            save_audio(voice, speech, os.path.basename(output_path), output_path)
            print(f"Saved audio at: {output_path}")
            
    return jsonify({'message': 'Audio saved successfully'}), 201


# ROTA PARA LISTAR TODOS OS ÁUDIOS
@audios_controller.route('/audio_files', methods=['GET'])
def get_audio_files():
    audio_files = get_audios()
    audio_list = [{'id': row[0], 'voice_name': row[1], 'audio_text': row[2], 'audio_name': row[3], 'audio_path': row[4]} for row in audio_files]
    return jsonify(audio_list), 200


# ROTA PARA EXCLUIR UM ÁUDIO PELO NOME DO ARQUIVO
@audios_controller.route('/audio_files', methods=['DELETE'])
def delete_audio():
    data = request.json
    audio_id = data.get('id')
    audio_path = data.get('audio_path')

    if not audio_id:
        return jsonify({'error': 'File name is required'}), 400

    file_success, file_message = delete_file_folder(audio_path)
    db_success, db_message = delete_audio_db(audio_id)

    if file_success and db_success:
        return jsonify({'message': f"{file_message}. {db_message}"}), 200
    elif file_success:
        return jsonify({'error': db_message}), 400
    elif db_success:
        return jsonify({'error': file_message}), 400
    else:
        return jsonify({'error': f"{file_message}. {db_message}"}), 400



# ROTA PARA BUSCAR INFORMAÇÕES SOBRE UM ÁUDIO ESPECÍFICO PELO ID
@audios_controller.route('/audio_files/<int:audio_id>', methods=['GET'])
def get_audio_file(audio_id):
    # Implemente a lógica para buscar informações sobre o áudio com o ID especificado
    # Se o áudio não existir, retorne um erro 404
    # Se encontrar o áudio, retorne suas informações em formato JSON
    pass

# ROTA PARA ATUALIZAR INFORMAÇÕES DE UM ÁUDIO PELO ID
@audios_controller.route('/audio_files/<int:audio_id>', methods=['PUT'])
def update_audio_file(audio_id):
    # Implemente a lógica para atualizar as informações do áudio com o ID especificado
    pass

# ROTA PARA EXCLUIR UM ÁUDIO PELO ID
@audios_controller.route('/audio_files/<int:audio_id>', methods=['DELETE'])
def delete_audio_file(audio_id):
    # Implemente a lógica para excluir o áudio com o ID especificado
    pass