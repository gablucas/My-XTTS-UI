
export function generateElement(element, classes, id, data, innerHTML) {
    const newElement = document.createElement(element);

    if (classes !== null ) {
        classes.forEach(x => newElement.classList.add(x));
    }

    if (id !== null) {
        newElement.setAttribute("id", id);
    }

    if (data !== null) {
        newElement.setAttribute(data.name, data.value);
    }

    if (innerHTML !== null) {
        newElement.innerHTML = innerHTML;
    }

    return newElement;
}

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

export function showAudiosFiles(audiosData, deleteFunction, toggleAudio) {
    const generatedAudioList = document.getElementById('audio-list-generated');
    const enhancedAudioList = document.getElementById('audio-list-enhanced');

    generatedAudioList.innerHTML = "";
    enhancedAudioList.innerHTML = "";

    audiosData.forEach(audioData => {
        const name = audioData['audio_name'].split(".wav")[0];
        const path = audioData['audio_path'];

        const audioContainer = generateElement('div', [name, 'audio-container'], null, null, null);
        const audioActionsContainer = generateElement('div', ['audio-actions'], null, null, null);
        const audioName = generateElement('span', null, null, name, null);
        const audioPlay = generateElement('span', ["audio-button-play", "material-symbols-outlined"], null, "play_arrow")
        const audioPause = generateElement('span', ["audio-button-pause", "hide", "material-symbols-outlined"], null, "pause");
        const audioDelete = generateElement('span', ["audio-button-delete", "material-symbols-outlined"], null, "delete");

        const audio = new Audio(path);
        audio.controls = true

        audioPlay.addEventListener('click', (e) => toggleAudio(audio, name, "play"))
        audioPause.addEventListener('click', (e) => toggleAudio(audio, name, "pause"))
        audioDelete.addEventListener('click', () => deleteFunction(audioData.id, audioData.audio_path))
        
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
    const data = await response.json();
    return data;
}

export async function getVoices() {
    const response = await fetch("/voices_files", { method: 'GET' })
    const data = await response.json();
    return data;
}

export async function generateSpeech(voicesList, text, number, type) {

    if (text === undefined || text === "") {
        text = "I'm doing a test to see how my voice sounds in this inference, well. It seems good?"
    }

    if (number === undefined || number === 0) {
        number = "1";
    }

    try {
        const response = await fetch(`/audio_files`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ voicesList: voicesList, text: text, number: number, type: type }),
        })
    } 
    catch 
    {
        console.log('Erro ao obter arquivos de áudio:');
    }
}