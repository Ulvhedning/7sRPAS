function startVoice() {
  const recognition = new webkitSpeechRecognition(); // iOS Safari
  recognition.lang = "sv-SE"; // Svenska
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    document.activeElement.value += " " + text; // fyller i det fält du står i
  };
}

function exportReport() {
  const rapport = {
    sektor: document.getElementById("sektor").value,
    styrka: document.getElementById("styrka").value,
    stallning: document.getElementById("stallning").value,
    sysselsattning: document.getElementById("sysselsattning").value,
    sarskilt: document.getElementById("sarskilt").value,
    slutsats: document.getElementById("slutsats").value,
    signatur: document.getElementById("signatur").value,
    timestamp: new Date().toISOString()
  };
  document.getElementById("output").textContent = JSON.stringify(rapport, null, 2);
}
