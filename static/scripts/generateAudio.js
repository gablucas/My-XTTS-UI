import { getVoices, showAudiosFiles, getAudios, generateSpeech, toggleAudio } from './script.js';

const generateBtn = document.getElementById("generateAudio");
const voicesSelect = document.getElementById('voices');
const filterVoice = document.getElementById('filter_voice');
const filterText = document.getElementById('filter_text');

const audiosData = await getAudios();
const voicesData = await getVoices();

export let filterAudiosData = audiosData;

async function generateSpeechCallback() {
    var voices = document.getElementById("voices").value;
    var text = document.getElementById("text")?.value;
    var number = document.getElementById("number")?.value;

    const voicesList = [];
    const [voiceName, voiceId] = voices.split('_id_');
    voicesList.push({id: voiceId, name: voiceName });
    
    await generateSpeech(voicesList, text, number, "permanent");
}

export async function deleteAudio(id, audio_path) {
    console.log(id + " " + audio_path)
    const response = await fetch("/audio_files", {
        method: "DELETE",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify({id: id, audio_path: audio_path})
    });
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

    showAudiosFiles(filterAudiosData, deleteAudio);
}

async function ListGenerateVoices() {
    //const voicesDataFiltered = voicesData.filter(x => x.voice_type === "permanent");

    voicesData.forEach(audioData => {
        const voiceOption = document.createElement('option');
        
        const name = audioData.voice_name

        voiceOption.innerHTML = name;
        voiceOption.value = `${name}_id_${audioData.id}`;
        
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

await ListGenerateVoices();
await ListVoicesFilter();
await ListTextsFilter();
showAudiosFiles(filterAudiosData, deleteAudio, toggleAudio);


filterVoice.addEventListener("change", (e) => filter(e, "voice_name"));
filterText.addEventListener("change", (e) => filter(e, "audio_text"));
generateBtn.addEventListener("click", async () => generateSpeechCallback());
//deleteAllAudiosBtn.addEventListener('click', () => deleteAllAudioFiles('E:\\TTS\\static\\output\\audios\\', [['temporary', "not"]]))
