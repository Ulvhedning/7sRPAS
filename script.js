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
const rapportText = formatReportText(rapport);
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
function getNextReportNumber() {
  let current = localStorage.getItem("reportCounter");
  if (!current) {
    current = 1000;
  } else {
    current = parseInt(current) + 1;
  }
  localStorage.setItem("reportCounter", current);
  return current;
}
function formatReportText(rapport) {
  return `
🛰️ 7S-RAPPORT RPAS
📌 ID: ${rapport.id}
📅 Tidpunkt: ${rapport.stund}
📍 Plats: ${rapport.stalle}
👥 Styrka: ${rapport.styrka}
🚛 Typ: ${rapport.slag}
⚙️ Aktivitet: ${rapport.sysselsattning}
🏷️ Märkning: ${rapport.symbol}
🧑‍✈️ Sagesman: ${rapport.sagesman}

🎯 Spaningsfråga:
${rapport.spaningsfraga}

🕓 Rapport skapad: ${rapport.timestamp}
`;
}
async function exportPDF(rapport) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Lägg till logga (exempel: URL till din patchbild)
  const imgUrl = "https://copilot.microsoft.com/th/id/BCO.5218b82d-3dc7-468a-a8ec-f621a08ce8d4.png";
  const img = new Image();
  img.src = imgUrl;

  img.onload = function() {
    doc.addImage(img, "PNG", 10, 10, 40, 40); // position och storlek

    // Titel
    doc.setFontSize(18);
    doc.text("7S-RAPPORT RPAS", 60, 25);

    // Rapportinnehåll
    doc.setFontSize(12);
    doc.text(`ID: ${rapport.id}`, 10, 60);
    doc.text(`Tidpunkt: ${rapport.stund}`, 10, 70);
    doc.text(`Plats: ${rapport.stalle}`, 10, 80);
    doc.text(`Styrka: ${rapport.styrka}`, 10, 90);
    doc.text(`Slag: ${rapport.slag}`, 10, 100);
    doc.text(`Sysselsättning: ${rapport.sysselsattning}`, 10, 110);
    doc.text(`Symbol: ${rapport.symbol}`, 10, 120);
    doc.text(`Sagesman: ${rapport.sagesman}`, 10, 130);

    doc.text("Spaningsfråga:", 10, 150);
    doc.text(rapport.spaningsfraga, 10, 160, { maxWidth: 180 });

    doc.text(`Skapad: ${rapport.timestamp}`, 10, 180);

    // Spara PDF
    doc.save(`${rapport.id}.pdf`);
  };
}
