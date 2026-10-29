const destinations = [
  {name:"Ooty",district:"Nilgiris",category:"Hill Station",icon:"⛰️",colors:["#dceee3","#8bbba1"],description:"Cool weather, gardens, tea estates, and scenic mountain views.",cost:2200},
  {name:"Kodaikanal",district:"Dindigul",category:"Nature",icon:"🌲",colors:["#e0eee5","#a0c9ae"],description:"A hill getaway known for its lake, forests, and walking trails.",cost:2000},
  {name:"Madurai",district:"Madurai",category:"Temple",icon:"🛕",colors:["#f6e7ce","#e6b879"],description:"Explore historic temple architecture and the city's food culture.",cost:1200},
  {name:"Rameswaram",district:"Ramanathapuram",category:"Coastal",icon:"🌊",colors:["#d9eef2","#7ebac5"],description:"A coastal destination with pilgrimage sites and sea views.",cost:1800},
  {name:"Mahabalipuram",district:"Chengalpattu",category:"Heritage",icon:"🏛️",colors:["#f4e3d2","#d5aa82"],description:"Discover historic stone monuments and coastal heritage.",cost:1000},
  {name:"Kanyakumari",district:"Kanniyakumari",category:"Coastal",icon:"🌅",colors:["#f8e3cc","#e6aa81"],description:"Visit coastal landmarks and enjoy views where seas meet.",cost:1900}
];

const grid = document.querySelector("#destination-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const resultCount = document.querySelector("#result-count");

function renderDestinations() {
  const term = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const filtered = destinations.filter(d =>
    (d.name.toLowerCase().includes(term) || d.district.toLowerCase().includes(term)) &&
    (category === "all" || d.category === category)
  );
  resultCount.textContent = `${filtered.length} destination${filtered.length === 1 ? "" : "s"}`;
  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state">No destinations found. Try another search or category.</div>';
    return;
  }
  grid.innerHTML = filtered.map(d => `
    <article class="destination-card">
      <div class="destination-visual" style="background:linear-gradient(135deg,${d.colors[0]},${d.colors[1]})"><span>${d.icon}</span></div>
      <div class="card-content">
        <span class="tag">${d.category}</span>
        <h3>${escapeHTML(d.name)}</h3>
        <div class="district">📍 ${escapeHTML(d.district)} district</div>
        <p>${escapeHTML(d.description)}</p>
        <div class="card-bottom"><span>Sample budget from ₹${d.cost.toLocaleString("en-IN")}</span><button data-plan="${escapeHTML(d.name)}">Plan visit ↗</button></div>
      </div>
    </article>`).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

searchInput.addEventListener("input", renderDestinations);
categoryFilter.addEventListener("change", renderDestinations);
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-plan]");
  if (!button) return;
  document.querySelector("#trip-interest").value = destinations.find(d => d.name === button.dataset.plan)?.category || "Any";
  document.querySelector("#planner").scrollIntoView({behavior:"smooth"});
});

document.querySelector("#generate-plan").addEventListener("click", () => {
  const start = document.querySelector("#start-location").value.trim() || "your location";
  const days = Number(document.querySelector("#trip-days").value);
  const budget = Math.max(0, Number(document.querySelector("#budget").value) || 0);
  const interest = document.querySelector("#trip-interest").value;
  let choices = destinations.filter(d => interest === "Any" || d.category === interest);
  if (!choices.length) choices = destinations;
  choices.sort((a,b) => Math.abs(a.cost - budget / Math.max(days,1)) - Math.abs(b.cost - budget / Math.max(days,1)));
  const chosen = choices.slice(0, Math.min(days, choices.length));
  const output = document.querySelector("#plan-output");
  const estimated = chosen.reduce((sum,d) => sum + d.cost, 0);
  output.innerHTML = `
    <div class="output-icon">✧</div>
    <h3>Your sample ${days}-day trip</h3>
    <p>Starting from <strong>${escapeHTML(start)}</strong> · Interest: ${escapeHTML(interest)}</p>
    <div class="plan-meta"><span>Budget: ₹${budget.toLocaleString("en-IN")}</span><span>Illustrative destination estimate: ₹${estimated.toLocaleString("en-IN")}</span></div>
    <ol>${chosen.map((d,i) => `<li><strong>Day ${i+1}: ${escapeHTML(d.name)}</strong> — ${escapeHTML(d.description)}</li>`).join("")}</ol>
    <p>${estimated > budget ? "This sample estimate is above your budget. Reduce the number of destinations or verify lower-cost transport and stay options." : "This estimate is illustrative only. Check travel distance, actual transport, food, stay, entry fees, and opening hours before booking."}</p>
    <p><strong>Next step:</strong> Open a map service to confirm routes and travel time.</p>`;
});

const chatMessages = document.querySelector("#chat-messages");
function addMessage(text, type) {
  const el = document.createElement("div");
  el.className = `message ${type === "user" ? "user-message" : "bot-message"}`;
  el.textContent = text;
  chatMessages.appendChild(el);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function getReply(question) {
  const q = question.toLowerCase();
  if (q.includes("hill") || q.includes("ooty") || q.includes("kodaikanal")) return "For a hill-station trip, explore Ooty in the Nilgiris or Kodaikanal in Dindigul district. Compare travel time, weather, and accommodation before choosing.";
  if (q.includes("heritage") || q.includes("history") || q.includes("mahabalipuram")) return "Mahabalipuram is known for historic stone monuments and coastal heritage. Check official site information for current entry details and visiting hours.";
  if (q.includes("temple") || q.includes("madurai") || q.includes("rameswaram")) return "Madurai and Rameswaram are well-known temple and pilgrimage destinations. Confirm temple timings and local travel guidance from official sources.";
  if (q.includes("beach") || q.includes("coast") || q.includes("kanyakumari")) return "For coastal scenery, consider Kanyakumari, Rameswaram, or Mahabalipuram. Check local advisories and sea conditions before water activities.";
  if (q.includes("budget") || q.includes("cheap") || q.includes("cost")) return "Set a daily spending limit, compare bus/train options, choose accommodation early, and keep a contingency amount. Costs in this demo are illustrative, not live prices.";
  if (q.includes("weather") || q.includes("rain")) return "This demo does not retrieve live weather. Check a trusted weather service and local advisories close to your travel date.";
  if (q.includes("hello") || q.includes("vanakkam") || q.includes("hi")) return "Vanakkam! I can share sample ideas for hill stations, temples, heritage sites, coastal places, and budget planning.";
  return "I can help with general Tamil Nadu tourism ideas. Try asking about hill stations, temples, heritage places, coastal destinations, or budget trip tips. This is a rule-based demo, so please verify details with official sources.";
}
document.querySelector("#chat-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = document.querySelector("#chat-input");
  const question = input.value.trim();
  if (!question) return;
  addMessage(question, "user");
  input.value = "";
  addMessage(getReply(question), "bot");
});
document.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => {
  const question = button.dataset.question;
  addMessage(question, "user");
  addMessage(getReply(question), "bot");
}));

renderDestinations();
