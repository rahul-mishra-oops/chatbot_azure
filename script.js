let synthesizer;
document.body.addEventListener(
  'touchstart',
  () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    context.resume().then(() => {
      console.log("AudioContext resumed for iOS");
    });
  },
  { once: true }
);

function startSpeech() {
  const text = document.getElementById("text-input").value;
  const selectedVoice = document.getElementById("voice-select").value;

  if (!text.trim()) {
    alert("Please enter some text.");
    return;
  }

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
    "7K1h3E2sgsPmqjiX71IEzSirUgVhfIGntzpgLpR0cn3Mnj9dbpJ1JQQJ99BEACYeBjFXJ3w3AAAYACOGG0ed",
    "eastus"
  );
  speechConfig.speechSynthesisVoiceName = selectedVoice;

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
  synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.speakTextAsync(
    text,
    result => {
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("Speech synthesized successfully.");
      } else {
        console.error("Speech synthesis failed:", result.errorDetails);
        alert("Error: " + result.errorDetails);
      }
    },
    error => {
      console.error("Error during speech synthesis:", error);
    }
  );
}

function stopSpeech() {
  if (synthesizer) {
    synthesizer.close();
    synthesizer = null;
    console.log("Speech stopped.");
  }
}
