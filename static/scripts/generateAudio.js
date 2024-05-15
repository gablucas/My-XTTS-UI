import { getAudioFiles, showAudiosFiles, getAudios } from './script.js';

const generateBtn = document.getElementById("generateAudio");
const voicesSelect = document.getElementById('voices');
const filterVoice = document.getElementById('filter_voice');
const filterText = document.getElementById('filter_text');

const audiosData = await getAudios();
export let filterAudiosData = audiosData;

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

function filter(e, type) {
    const value = e.target.value;
    console.log(filterAudiosData)

    if (type === "voice_name") {
        if (value === "all") {
            filterAudiosData = audiosData;
        } else {
            filterAudiosData = audiosData.filter(x => x[type] === value);
        }

        ListTextsFilter();
     }

     if (type === "audio_text") {
        if (value === "all") {
            filterAudiosData = audiosData;
        } else {
            filterAudiosData = audiosData.filter(x => x[type] === value);
        }
     }


    filterAudiosData.filter(x => !x.voice_name.includes("temporary"));

    showAudiosFiles(filterAudiosData);
}

async function ListAudios() {
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
    
}

async function ListVoicesFilter() {
    filterVoice.innerHTML = "<option value='all'>All</option>";

    const uniqueVoicesName = Array.from(new Set(audiosData.map(x => x.voice_name)));

    uniqueVoicesName.forEach(data => {
        const filterVoiceOption = document.createElement('option');
        filterVoiceOption.setAttribute("value", data);
        filterVoiceOption.innerHTML = data;
        filterVoice.appendChild(filterVoiceOption);
    })
}

async function ListTextsFilter() {
    filterText.innerHTML = "<option value='all'>All</option>";

    const uniqueTextsName = Array.from(new Set(filterAudiosData.map(x => x.audio_text)));

    uniqueTextsName.forEach(data => {
        const filterTextOption = document.createElement('option');
        filterTextOption.setAttribute("value", data);
        filterTextOption.innerHTML = data;
        filterText.appendChild(filterTextOption);
    })
}

await ListAudios();
await ListVoicesFilter();
await ListTextsFilter();


//showAudiosFiles(filterAudiosData);


filterVoice.addEventListener("change", (e) => filter(e, "voice_name"));
filterText.addEventListener("change", (e) => filter(e, "audio_text"));
generateBtn.addEventListener("click", async () => await generateAndGetAudiosFiles());
//deleteAllAudiosBtn.addEventListener('click', () => deleteAllAudioFiles('E:\\TTS\\static\\output\\audios\\', [['temporary', "not"]]))
