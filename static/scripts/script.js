import { deleteAudio } from "./generateAudio.js";

export function toggleAudio(audio, className, action) {
    const audioBtnList = document.querySelectorAll(".audio-button-pause");

    audioBtnList.forEach(btn => {
        if (!btn.classList.contains(className) && !btn.classList.contains("hide")) {
            btn.click();
        }
    })

    const playBtn = document.querySelector(`.${className} .audio-button-play`);
    const pauseBtn = document.querySelector(`.${className} .audio-button-pause`);

    if (action === "play") {
        playBtn.classList.add('hide')
        pauseBtn.classList.remove('hide')
        audio.play();
    } else if (action === "pause") {
        pauseBtn.classList.add('hide')
        playBtn.classList.remove('hide')
        audio.pause();
    }
}

export async function getAudioFiles(directory) {
    try {
        const response = await fetch(`/audio_files_old?directory=${directory}`);
        const audiosData = await response.json();
        return audiosData;
    } catch (error) {
        console.error('Erro ao obter arquivos de áudio:', error);
        throw error; // Propagar o erro para ser tratado externamente, se necessário
    }
}

export function showAudiosFiles(audiosData) {
    const generatedAudioList = document.getElementById('audio-list-generated');
    const enhancedAudioList = document.getElementById('audio-list-enhanced');

    generatedAudioList.innerHTML = "";
    enhancedAudioList.innerHTML = "";

    audiosData.forEach(audioData => {
        const name = audioData['audio_name'].split(".wav")[0];
        const path = audioData['audio_path'];

        const audioContainer = document.createElement('div');
        audioContainer.classList.add(name, "audio-container");

        const audioActionsContainer = document.createElement('div');
        audioActionsContainer.classList.add("audio-actions");

        const audioName = document.createElement('span');
        audioName.innerHTML = name;
        
        const audioPlay = document.createElement('span');
        audioPlay.classList.add("audio-button-play", "material-symbols-outlined");
        audioPlay.innerHTML = "play_arrow";
        audioPlay.addEventListener('click', (e) => toggleAudio(audio, name, "play"))
        
        const audioPause = document.createElement('span');
        audioPause.classList.add("audio-button-pause", "hide", "material-symbols-outlined");
        audioPause.innerHTML = "pause";
        audioPause.addEventListener('click', (e) => toggleAudio(audio, name, "pause"))

        const audioDelete = document.createElement('span');
        audioDelete.classList.add("audio-button-delete", "material-symbols-outlined");
        audioDelete.innerHTML = "delete";
        audioDelete.addEventListener('click', async () => await deleteAudio(audioData.id, audioData.audio_path))
        
        const audio = new Audio(path);
        audio.controls = true;
        

        audioActionsContainer.appendChild(audioPlay);
        audioActionsContainer.appendChild(audioPause);
        audioActionsContainer.append(audioDelete);
        audioContainer.appendChild(audioName);
        audioContainer.appendChild(audioActionsContainer);

        if (name.includes('enhanced')) {
            enhancedAudioList.appendChild(audioContainer);
        } else {
            generatedAudioList.appendChild(audioContainer);
        }
    });
}

export function deleteAllAudioFiles(deletePath, filtros) {
    fetch('/excluir_arquivos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ caminho_pasta: deletePath, filtros: filtros })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("audio-list-generated").innerHTML = "";
        document.getElementById("audio-list-enhanced").innerHTML = "";
    })
    .catch(error => {
        console.error('Erro:', error);
    });
}

export async function getAudios() {
    const response = await fetch("/audio_files")
    const data =  await response.json();
    return data;
}
