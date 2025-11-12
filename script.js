function startVoice() {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "sv-SE";
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    document.activeElement.value += " " + text;
  };
}

function generateReportId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5);
  return `RPAS_${timestamp}_${random}`;
}

function exportReport() {
  const rapport = {
    id: generateReportId(),
    spaningsfraga: document.getElementById("spaningsfraga").value,
    stund: document.getElementById("stund").value,
    stalle: document.getElementById("stalle").value,
    styrka: document.getElementById("styrka").value,
    slag: document.getElementById("slag").value,
    sysselsattning: document.getElementById("sysselsattning").value,
    symbol: document.getElementById("symbol").value,
    sagesman: document.getElementById("sagesman").value,
    timestamp: new Date().toISOString()
  };

  // Spara lokalt
  localStorage.setItem(rapport.id, JSON.stringify(rapport));

  // Visa rapport
  document.getElementById("output").textContent = JSON.stringify(rapport, null, 2);

  // Skapa delningslänkar
  createShareButtons(rapport);
}

function createShareButtons(rapport) {
  const rapportText = JSON.stringify(rapport, null, 2);
  const output = document.getElementById("output");

  const mailBtn = document.createElement("button");
  mailBtn.textContent = "📧 Skicka via mail";
  mailBtn.onclick = () => {
    window.location.href = `mailto:?subject=7S-RAPPORT ${rapport.id}&body=${encodeURIComponent(rapportText)}`;
  };

  const smsBtn = document.createElement("button");
  smsBtn.textContent = "📱 Skicka via SMS";
  smsBtn.onclick = () => {
    window.location.href = `sms:?body=${encodeURIComponent(rapportText)}`;
  };

  const printBtn = document.createElement("button");
  printBtn.textContent = "🖨️ Skriv ut";
  printBtn.onclick = () => {
    const win = window.open("", "", "width=600,height=600");
    win.document.write(`<pre>${rapportText}</pre>`);
    win.print();
  };

  output.appendChild(document.createElement("hr"));
  output.appendChild(mailBtn);
  output.appendChild(smsBtn);
  output.appendChild(printBtn);
}

function searchReportById(id) {
  const rapport = localStorage.getItem(id);
  if (rapport) {
    document.getElementById("output").textContent = `🔍 Rapport hittad:\n\n${rapport}`;
  } else {
    document.getElementById("output").textContent = `❌ Ingen rapport med ID: ${id}`;
  }
}
