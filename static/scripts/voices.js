import { generateElement, getVoices, getAudios, generateSpeech, toggleAudio } from "./script.js";

const dropArea = document.getElementById('dropArea');
const generateBtn = document.getElementById("generateAudio");
const newVoicesContainer = document.getElementById('new-voices-container');

const voicesData = await getVoices();
const audiosData = await getAudios();

function showVoices() {
    voicesData.forEach(x => {
        const voiceContainer = generateElement('div', [`${x.voice_name}_voice_${x.id}`, "temporary_voice","primary-container", "vertical-elements"], null, null);
        const voiceName = generateElement('span', null, null, x.voice_name);
        const emotionSelect = generateElement('select', null, null, null);
        const audioFileContainer = generateElement('div', null, `audio_cotainer_voice_${x.id}`, null);

        const emotions = [
            "Normal",
            "Happy",
            "Sad",
            "Angry",
            "Astonished",
            "Scared",
            "Tired out",
            "Cheered up",
            "Irritated",
            "Embarrassed",
            "Anxious",
            "Excited",
            "Calm",
            "Melancholic",
            "Disappointed",
            "Confused",
            "Carefree",
            "Loving"
        ];

        
        emotions.forEach(e => {
            
            const emotionOption = generateElement('option', null, null, e);
            emotionOption.setAttribute('value', e);
            emotionSelect.appendChild(emotionOption);
        });

        voiceContainer.appendChild(voiceName);
        voiceContainer.appendChild(emotionSelect);
        voiceContainer.appendChild(audioFileContainer);
    
        newVoicesContainer.appendChild(voiceContainer);
    })
}
console.log(audiosData)
export function showAudiosFiles(audiosData, deleteFunction) {
    audiosData.forEach(audioData => {

        const voiceContainer = document.querySelectorAll(`.${audioData.voice_name}_voice_${audioData.voiceId}`);
        
        voiceContainer.forEach((container) => {
            console.log(container)
            const name = audioData.audio_name;
            const path = audioData.audio_path;
    
            const audioContainer = generateElement('div', [name, 'audio-container'], null, null, null);
            const audioActionsContainer = generateElement('div', ['audio-actions'], null, null, null);
            const audioName = generateElement('span', null, null, name, null);
            const audioPlay = generateElement('span', ["audio-button-play", "material-symbols-outlined"], null, "play_arrow")
            const audioPause = generateElement('span', ["audio-button-pause", "hide", "material-symbols-outlined"], null, "pause");
            //const audioDelete = generateElement('span', ["audio-button-delete", "material-symbols-outlined"], null, "delete");
    
            const audio = new Audio(path);
            audio.controls = true
    
            audioPlay.addEventListener('click', (e) => toggleAudio(audio, name, "play"))
            audioPause.addEventListener('click', (e) => toggleAudio(audio, name, "pause"))
            //audioDelete.addEventListener('click', () => deleteFunction(audioData.id, audioData.audio_path))
            
            audioActionsContainer.appendChild(audioPlay);
            audioActionsContainer.appendChild(audioPause);
            //audioActionsContainer.append(audioDelete);
            audioContainer.appendChild(audioName);
            audioContainer.appendChild(audioActionsContainer);
    
            container.appendChild(audioContainer);
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
        
        let [voiceName, voiceId] = voice.getAttribute("id").split('_voice_');
        voicesList.push({id: voiceId, name: voiceName });
    });

    console.log(voicesList)

    await generateSpeech(voicesList, text, 1, "temporary");
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
showAudiosFiles(audiosData)

dropArea.addEventListener('drop', (e) => createTemporaryVoice(e));
dropArea.addEventListener('dragover', handleDragOver);
generateBtn.addEventListener("click", async () => generateSpeechCallback());
