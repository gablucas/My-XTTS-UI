import { generateElement, getVoices, getAudios, generateSpeech, toggleAudio } from "./script.js";

const dropArea = document.getElementById('dropArea');
const generateBtn = document.getElementById("generateAudio");
const newVoicesContainer = document.getElementById('new-voices-container');

async function deleteVoiceAndAudio(e, voice, audio) {
    const audioResponse = await fetch('/audio_files', {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(audio)
    })

    const voiceResponse = await fetch('/voices_files', {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(voice)
    })

    await Promise.all([audioResponse, voiceResponse]);

    e.target.parentElement.parentElement.remove();
}

async function updateVoiceAndAudio(e, voice, audio) {
    const audioResponse = await fetch('/audio_files', {
        method: 'DELETE',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(audio)
    })

    const voiceComplement = document.getElementById(`select-voice-${voice.id}`).value;

    const voiceResponse = await fetch('/voices_files', {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({ id: voice.id, type: 'permanent', complement: voiceComplement })
    })

    await Promise.all([audioResponse, voiceResponse]);

    e.target.parentElement.parentElement.remove();
}

async function showVoices() {
    const voicesData = (await getVoices()).filter(x => x.voice_type === "temporary");

    voicesData.forEach(x => {

        const voiceContainer = generateElement('div', ["temporary_voice", "primary-container", "vertical-elements"], null, {name: "data-voice", value: `${x.voice_name}_voice_${x.id}`}, null);
        const voiceName = generateElement('span', null, null, null, x.voice_name);
        const emotionSelect = generateElement('select', null, `select-voice-${x.id}`, null, null);
        const audioFileContainer = generateElement('div', ['vertical-elements'], `audio_cotainer_voice_${x.id}`, null, null);

        const emotionOption = generateElement('option', null, null, null, "None");
        emotionOption.setAttribute('value', 0);
        emotionSelect.appendChild(emotionOption);

        voicesData.forEach(e => {
            const emotionOption = generateElement('option', null, null, null, e.voice_name);
            emotionOption.setAttribute('value', e.id);
            emotionSelect.appendChild(emotionOption);
        });

        voiceContainer.appendChild(voiceName);
        voiceContainer.appendChild(emotionSelect);
        voiceContainer.appendChild(audioFileContainer);
    
        newVoicesContainer.appendChild(voiceContainer);
    })
}

export async function showAudiosFiles() {

    const audiosData = (await getAudios()).filter(x => x.audio_type === "temporary");
    const voicesData = (await getVoices()).filter(x => x.voice_type === "temporary");

    const voiceContainer = document.querySelectorAll(".temporary_voice");
    
    voiceContainer.forEach((container) => {
        
        const voiceId = container.getAttribute('data-voice').split("_voice_")[1];
        const audiosContainer = container.querySelector(`#audio_cotainer_voice_${voiceId}`);
        const audioHandlerContainer = container.querySelector('.audio-handler');

        const voice = voicesData.find(x => x.id === parseInt(voiceId));
        const audios = audiosData.filter(x => x.voice_id === parseInt(voiceId));

        audiosContainer.innerHTML = "";

        audios.forEach((audioData, index) => {
            const name = audioData.audio_name;
            const path = audioData.audio_path;
    
            const audioContainer = generateElement('div', [name, 'audio-container'], null, null, null, null);
            const audioActionsContainer = generateElement('div', ['audio-actions'], null, null, null, null);
            const audioName = generateElement('span', null, null, null, name, null);
            const audioPlay = generateElement('span', ["audio-button-play", "material-symbols-outlined"], null, null, "play_arrow")
            const audioPause = generateElement('span', ["audio-button-pause", "hide", "material-symbols-outlined"], null, null, "pause");
            const audio = new Audio(path);
            audio.controls = true
    
            audioPlay.addEventListener('click', (e) => toggleAudio(audio, name, "play"))
            audioPause.addEventListener('click', (e) => toggleAudio(audio, name, "pause"))

            audioActionsContainer.appendChild(audioPlay);
            audioActionsContainer.appendChild(audioPause);
            audioContainer.appendChild(audioName);
            audioContainer.appendChild(audioActionsContainer);


            audiosContainer.appendChild(audioContainer);

            if (index === audios.length - 1 && audioHandlerContainer === null) {
                const voiceSaveOrDeleteContainer =  generateElement('div', ['audio-handler' ,'horizontal-elements'], null, null, null);
                const voiceSave = generateElement('button', ['grow'], 'voice-save', null, "Salvar");
                const voiceDelete = generateElement('button', ['grow'], 'voice-save', null, "Deletar");
        
                voiceSave.addEventListener('click', (e) => updateVoiceAndAudio(e, {id: voice.id}, {id: audioData.id, path: audioData.audio_path}));
                voiceDelete.addEventListener('click', (e) => deleteVoiceAndAudio(e, {id: voice.id, path: voice.voice_path}, {id: audioData.id, path: audioData.audio_path}));
        
                voiceSaveOrDeleteContainer.appendChild(voiceSave);
                voiceSaveOrDeleteContainer.appendChild(voiceDelete);
                container.appendChild(voiceSaveOrDeleteContainer);
            }
        })
    });
}

async function generateSpeechCallback() {
    var voices = document.querySelectorAll(".temporary_voice")
    var text = document.getElementById("text")?.value;
    //var number = document.getElementById("number")?.value;

    const voicesList = [];

    // VER COMO FAZER ESSE LANCE DE PEGAR PELA CLASSE
    voices.forEach(voice => {
        
        let [voiceName, voiceId] = voice.getAttribute("data-voice").split('_voice_');
        voicesList.push({id: voiceId, name: voiceName });
    });

    await generateSpeech(null, voicesList, text, 1, "temporary");
    const audiosData = (await getAudios()).filter(x => x.audio_type === "temporary");
    showAudiosFiles(audiosData)
}

async function createTemporaryVoice(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file', files[i]);
    }

    const response = await fetch('/voices_files', {
        method: "POST",
        body: formData
    })

    if (response.ok) {
        const data = await getVoices();
        console.log(data)
        const voicesData = (await getVoices()).filter(x => x.voice_type === "temporary");
        const audiosData = (await getAudios()).filter(x => x.audio_type === "temporary");
        showVoices(voicesData);
        showAudiosFiles(audiosData)
    }
        
    /*Array.from(files).forEach(x => {
        const voiceContainer = document.createElement("div");
        voiceContainer.classList.add("voice-container");

        const wrapperInputAndName = document.createElement("div");
        wrapperInputAndName.classList.add("inputAndName");

        const checkBox = document.createElement('input');
        checkBox.setAttribute("type", "checkbox");

        const voiceName = document.createElement('span');
        voiceName.innerHTML = x.name.split(".wav")[0];

        wrapperInputAndName.appendChild(checkBox);
        wrapperInputAndName.appendChild(voiceName);

        voiceContainer.appendChild(wrapperInputAndName);
        newVoicesContainer.appendChild(voiceContainer);
    });*/
}

function handleDragOver(event) {
    event.preventDefault();
}

showVoices();
showAudiosFiles()

dropArea.addEventListener('drop', (e) => createTemporaryVoice(e));
dropArea.addEventListener('dragover', handleDragOver);
generateBtn.addEventListener("click", async () => generateSpeechCallback());
