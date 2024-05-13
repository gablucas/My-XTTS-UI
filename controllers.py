from flask import Blueprint, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import torch
import torchaudio
from pedalboard.io import AudioFile
from pedalboard import *
import noisereduce as nr
from model_loader import load_model

model = load_model(runmodel=True)

controller = Blueprint('controller', __name__)

#GERAR CAMINHO DE SAIDA
def get_unique_output_path(voice):
    base_name = f"{voice}_output"
    counter = 1
    while True:
        output_path = os.path.join("static/output/audios", f"{base_name}_{counter}.wav")
        if not os.path.exists(output_path):
            break
        counter += 1
    return output_path

# GERAR VOZ
@controller.route('/generate', methods=['POST'])
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
            print(f"Saved audio at: {output_path}")

    return '', 200

# MELHORAR AUDIO
@controller.route('/enhance', methods=['POST'])
def enhance():
    print("Enhancing audio")
    data = request.json
    voices = data['voice']
    sr = 44100

    output_path = get_unique_output_path(voices)
    with AudioFile(output_path).resampled_to(sr) as f:
        audio = f.read(f.frames)

        reduced_noise = nr.reduce_noise(y=audio, sr=sr, stationary=True, prop_decrease=0.75)

        board = Pedalboard([
            NoiseGate(threshold_db=-30, ratio=1.5, release_ms=250),
            Compressor(threshold_db=-16, ratio=2.5),
            LowShelfFilter(cutoff_frequency_hz=400, gain_db=10, q=1),
            Gain(gain_db=10)
        ])

        effected = board(reduced_noise, sr)

        enhanced_output_path = get_unique_output_path(f"{voices}_enhanced")
        with AudioFile(enhanced_output_path, 'w', sr, effected.shape[0]) as f:
            f.write(effected)

    return '', 200
    
#PEGAR AUDIOS
@controller.route('/audio_files')
def get_audio_files():
    directory = request.args.get('directory')
    
    audio_files = os.listdir(directory)

    audio_data = []
    for file in audio_files:
        file_path = os.path.join(directory, file)
        audio_data.append({"file_name": file, "file_path": file_path})
    return jsonify(audio_data)

#EXCLUIR AUDIOS
@controller.route('/excluir_arquivos', methods=['POST'])
def excluir_arquivos():
    dados = request.json
    caminho_pasta = dados.get('caminho_pasta')
    filtros = dados.get('filtros')
    arquivos = os.listdir(caminho_pasta)

    for filtro, condicao in filtros:
        if condicao == "not":
            arquivos = [arquivo for arquivo in arquivos if not (filtro in arquivo)]
        else:
            arquivos = [arquivo for arquivo in arquivos if filtro in arquivo]

    for arquivo in arquivos:
        caminho_arquivo = os.path.join(caminho_pasta, arquivo)
        if os.path.isfile(caminho_arquivo):
            os.remove(caminho_arquivo)

    return jsonify({'message': 'Arquivos excluídos com sucesso!'})

# UPLOAD DE VOZ
@controller.route('/upload-voices', methods=['POST'])
def upload_voices():
    output_folder = 'static/output/voices'

    files = request.files.getlist("file");
  
    for file in files: 
        file.save(os.path.join(output_folder, file.filename))

    return jsonify({'message': 'Arquivos salvos com sucesso'}), 200

