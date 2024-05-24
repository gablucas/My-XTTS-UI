import { getVoices, showAudiosFiles, getAudios, generateSpeech, toggleAudio } from './script.js';

const generateBtn = document.getElementById('generateAudio');
const voicesSelect = document.getElementById('voices');
const emotionsSelect = document.getElementById('emotions');
const textInput = document.getElementById('text');
const numberRepeatGenerate = document.getElementById("number");

const filterVoice = document.getElementById('filter_voice');
const filterEmotion = document.getElementById('filter_emotion');
const filterText = document.getElementById('filter_text');

const voicesData = (await getVoices()).filter(x => x.voice_type === "permanent");
const audiosData = (await getAudios()).filter(x => x.audio_type === "permanent");

const uniqueVoicesName = Array.from(new Set(voicesData.map(x => x.voice_name.split('_')[0])));

export let filterAudiosData = audiosData;

async function generateSpeechCallback() {
    var voice = emotionsSelect.value;
    var [voiceName, voiceId] = voice.split('_id_');
    var text = textInput?.value;
    var number = numberRepeatGenerate?.value;
    console.log(voice)
    console.log(voiceName + " " + voiceId)

    const voicesList = [];
    voicesList.push({ id: voiceId, name: voiceName });
    
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

    if (type === "voice_name" || type === "emotion_name") {
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

function ListGenerateVoices() {

    voicesSelect.addEventListener('input', (e) => ListVoicesEmotions(e.target.value))
    uniqueVoicesName.forEach(x => {
        const voiceOption = document.createElement('option');
        voiceOption.innerHTML = x;
        voiceOption.value = x;
        voicesSelect.appendChild(voiceOption);
    })
}

function ListVoicesEmotions(value) {

    emotionsSelect.innerHTML = "";

    voicesData.forEach(x => {

        if (x.voice_name.includes(value)) {
            const emotionOption = document.createElement('option');
            console.log(x)
            emotionOption.innerHTML = x.voice_emotion;
            emotionOption.value = `${x.voice_name}_id_${x.id}`;
            emotionsSelect.appendChild(emotionOption);
        }
    })
}

function ListVoicesFilter() {
    filterVoice.addEventListener('input', (e) => ListEmotionsFilter(e.target.value))
    filterVoice.innerHTML = "<option value='all'>All</option>";
    
    uniqueVoicesName.forEach(x => {
        const filterVoiceOption = document.createElement('option');
        filterVoiceOption.setAttribute("value", x);
        filterVoiceOption.innerHTML = x;
        filterVoice.appendChild(filterVoiceOption);
    })
}

function ListEmotionsFilter(value) {
    filterEmotion.innerHTML = "";
    filterEmotion.innerHTML = "<option value='all'>All</option>";

    voicesData.forEach(x => {

        if (x.voice_name.includes(value)) {
            const filterEmotionOption = document.createElement('option');
            filterEmotionOption.innerHTML = x.voice_emotion;
            filterEmotionOption.value = x.voice_emotion;
            filterEmotion.appendChild(filterEmotionOption);
        }
    })
}

function ListTextsFilter() {
    filterText.innerHTML = "<option value='all'>All</option>";

    const uniqueTextsName = Array.from(new Set(filterAudiosData.map(x => x.audio_text)));

    uniqueTextsName.forEach(data => {
        const filterTextOption = document.createElement('option');
        filterTextOption.setAttribute("value", data);
        filterTextOption.innerHTML = data;
        filterText.appendChild(filterTextOption);
    })
}

ListGenerateVoices();
ListVoicesFilter();
ListVoicesEmotions(uniqueVoicesName[0])
ListTextsFilter();
showAudiosFiles(filterAudiosData, deleteAudio, toggleAudio);

filterVoice.addEventListener("change", (e) => filter(e, "voice_name"));
filterEmotion.addEventListener("change", (e) => filter(e, "emotion_name"));
filterText.addEventListener("change", (e) => filter(e, "audio_text"));
generateBtn.addEventListener("click", async () => generateSpeechCallback());
