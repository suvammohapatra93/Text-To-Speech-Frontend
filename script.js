let speech = new SpeechSynthesisUtterance();
let voices = [];
const voiceSelect = document.getElementById("voiceSelect");
const rateInput = document.getElementById("rate");
const pitchInput = document.getElementById("pitch");
const volumeInput = document.getElementById("volume");
const textInput = document.getElementById("text-input");
const pauseResumeButton = document.getElementById("pauseResumeButton");
let isPaused = false;

// Populate the voice options
function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) {
    // Voices not loaded yet, retry after a short delay
    setTimeout(populateVoices, 100);
    return;
  }
  voiceSelect.innerHTML = voices
    .map(
      (voice) =>
        `<option value="${voice.voiceURI}">${voice.name} (${voice.lang})</option>`
    )
    .join("");
}

// Ensure voices are loaded
populateVoices();
window.speechSynthesis.onvoiceschanged = populateVoices;

// Update the selected voice
voiceSelect.addEventListener("change", () => {
  const selectedVoiceURI = voiceSelect.value;
  const selectedVoice = voices.find(
    (voice) => voice.voiceURI === selectedVoiceURI
  );
  if (selectedVoice) {
    speech.voice = selectedVoice;
  } else {
    console.error("Selected voice is not available.");
  }
});

document.getElementById("speakButton").addEventListener("click", () => {
  const text = textInput.value.trim();
  if (!text) {
    alert("Please enter some text!");
    return;
  }

  const selectedVoiceURI = voiceSelect.value;
  const selectedVoice = voices.find(
    (voice) => voice.voiceURI === selectedVoiceURI
  );
  if (selectedVoice) {
    speech.voice = selectedVoice;
  } else {
    console.error("No voice selected or selected voice is not available.");
    return;
  }

  // Set speech attributes
  speech.text = text;
  speech.rate = rateInput.value;
  speech.pitch = pitchInput.value;
  speech.volume = volumeInput.value;

  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(speech);
  isPaused = false; // Reset the paused state when speaking starts
  pauseResumeButton.innerText = "Pause"; // Set button back to "Pause"
});

pauseResumeButton.addEventListener("click", () => {
  if (window.speechSynthesis.speaking) {
    if (isPaused) {
      window.speechSynthesis.resume();
      pauseResumeButton.innerText = "Pause";
    } else {
      window.speechSynthesis.pause();
      pauseResumeButton.innerText = "Resume";
    }
    isPaused = !isPaused; // Toggle the pause state
  }
});
