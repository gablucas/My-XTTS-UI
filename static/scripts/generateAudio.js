import {getAudioFiles, showAudiosFiles, deleteAllAudioFiles } from './script.js';

const generateBtn = document.getElementById("generateAudio");
const deleteAllAudiosBtn = document.getElementById("deleteAllAudios");
const voicesSelect = document.getElementById('voices');

generateBtn.addEventListener("click", async () => await generateAndGetAudiosFiles());

let voicesData = await getAudioFiles('static/output/voices');
voicesData = voicesData.filter(x => !x.file_name.includes("temporary"));
voicesData.forEach(audioData => {
    const name = audioData['file_name'].split(".wav")[0];
    const path = audioData['file_path'];

    const voiceOption = document.createElement('option');

    voiceOption.innerHTML = name;
    voiceOption.value = name;

    voicesSelect.appendChild(voiceOption);
})

async function generateSpeech(voices) {
    var voices = document.getElementById("voices").value;
    var text = document.getElementById("text")?.value;
    var number = document.getElementById("number")?.value;

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
            body: JSON.stringify({ voices: [voices], text: text, number: number}),
        })
    } 
    catch 
    {
        console.log('Erro ao obter arquivos de áudio:');
    }
}

async function generateAndGetAudiosFiles() {
    await generateSpeech();
    await GetAudiosAndShow();
}

async function GetAudiosAndShow() {
    const response = await fetch("/audio_files")
    const data =  await response.json();
    const audiosData = data.filter(x => !x.audio_name.includes("temporary"));
    showAudiosFiles(audiosData);
}

export async function deleteAudio(id, audio_path) {
    const response = await fetch("/audio_files", {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({id: id, audio_path: audio_path})
    });

    await GetAudiosAndShow();
}


await GetAudiosAndShow();

deleteAllAudiosBtn.addEventListener('click', () => deleteAllAudioFiles('E:\\TTS\\static\\output\\audios\\', [['temporary', "not"]]))
