
/*
export async function listVoices(e) {

    const files = e.dataTransfer.files;
    const form = new FormData();
    console.log(files)

    for (let i = 0; i < files.length; i++) {
        const arquivo = files[i];
        const novoNome = arquivo.name.replace(".wav", "_temporary.wav");
        const novoArquivo = new File([arquivo], novoNome, { type: arquivo.type });
        form.append('file', novoArquivo);
    }

    try {
        const response = await fetch('/upload-voices', {
            method: 'POST',
            body: form,
        })

        if (response.status === 200) {
            console.log('Arquivos enviados com sucesso:', data);
        }
    }
    catch 
    {
        console.log('Erro ao enviar arquivos:')
    }

    let voicesData = await getAudioFiles('static/output/voices/');
    voicesData = voicesData.filter(x => x.file_name.includes("temporary")).map((x) => x.file_name.split(".wav")[0]);

    await generateSpeech(voicesData);

    let audiosData = await getAudioFiles("static/output/audios");
    audiosData = audiosData.filter(x => x.file_name.includes("temporary"));
    showAudiosFiles(audiosData);
}
*/
//const audioPlayer = document.getElementById('audioPlayer');

const newVoicesContainer = document.getElementById('new-voices-container');


function teste(e) {
    e.preventDefault();
    const files = e.dataTransfer.files;
    console.log(files)

    Array.from(files).forEach(x => {
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
    });

    /*
    const fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;
    */
}

function handleDragOver(event) {
    event.preventDefault();
}

const dropArea = document.getElementById('dropArea');
dropArea.addEventListener('drop', (e) => teste(e));
dropArea.addEventListener('dragover', handleDragOver);



/*
let audiosData = await getAudioFiles("static/output/audios");
audiosData = audiosData.filter(x => x.file_name.includes("temporary"));
showAudiosFiles(audiosData);

const deleteAllAudiosBtn = document.getElementById("deleteAllAudios");
//deleteAllAudiosBtn.addEventListener('click', () => deleteAllAudioFiles('E:\\TTS\\static\\output\\audios\\', [['temporary', ""]]))
*/