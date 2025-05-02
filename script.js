let audio = null;
let controller = null; // Used to abort fetch

function startSpeech() {
  const text = document.getElementById("text-input").value;
  const voice = document.getElementById("voice-select").value;

  if (!text.trim()) {
    alert("Please enter text.");
    return;
  }

  const apiKey = "7K1h3E2sgsPmqjiX71IEzSirUgVhfIGntzpgLpR0cn3Mnj9dbpJ1JQQJ99BEACYeBjFXJ3w3AAAYACOGG0ed";
  const region = "eastus";
  const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `
    <speak version='1.0' xml:lang='en-US'>
      <voice xml:lang='en-US' name='${voice}'>${text}</voice>
    </speak>`;

  controller = new AbortController();

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": apiKey,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-16khz-32kbitrate-mono-mp3",
      "User-Agent": "AzureTTSApp"
    },
    body: ssml,
    signal: controller.signal
  })
    .then(response => {
      if (!response.ok) throw new Error("TTS failed: " + response.statusText);
      return response.blob();
    })
    .then(audioBlob => {
      const audioUrl = URL.createObjectURL(audioBlob);
      audio = new Audio(audioUrl);
      audio.play();
    })
    .catch(err => {
      if (err.name === 'AbortError') {
        console.log("Speech request aborted.");
      } else {
        alert("Error: " + err.message);
        console.error(err);
      }
    });
}

function stopSpeech() {
  if (controller) {
    controller.abort();
    controller = null;
  }
  if (audio && !audio.paused) {
    audio.pause();
    audio.currentTime = 0;
  }
}
