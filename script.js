let wordCount = 0;
let dotsInterval = null;
function startDots() {
  const el = document.getElementById("loadingDots");
  let n = 0;
  dotsInterval = setInterval(() => {
    n = (n + 1) % 4;
    el.textContent = "Consulting the dictionary" + ".".repeat(n);
  }, 400);
}
function stopDots() {
  clearInterval(dotsInterval);
}

const stamp = document.getElementById("dateStamp");
if (stamp) {
  const d = new Date();
  stamp.textContent = d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" });
}

async function wordFinder() {
  const res = await fetch("https://random-word-api.herokuapp.com/word");
  if (!res.ok) throw new Error("Word fetch failed");
  const data = await res.json();
  return data[0];
}

async function getDefinition(word) {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0];
}

function showState(state) {
  ["idleState","loadingState","resultState"].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
  document.getElementById(state).classList.remove("hidden");
}

function renderResult(word, entry) {
  const meanings = entry.meanings;
  if (!meanings || meanings.length === 0) return false;
  const meaning = meanings[0];

  document.getElementById("wordDisplay").textContent = word;
  document.getElementById("posDisplay").textContent = meaning.partOfSpeech || "unknown";

  wordCount++;
  document.getElementById("wordCount").textContent = `No. ${String(wordCount).padStart(3,"0")}`;

  const list = document.getElementById("definitionsList");
  list.innerHTML = "";
  meaning.definitions.slice(0, 5).forEach(d => {
    const li = document.createElement("li");
    li.textContent = d.definition;
    list.appendChild(li);
  });

  const synonyms = meaning.synonyms || [];
  const synRow = document.getElementById("synonymsRow");
  if (synonyms.length > 0) {
    document.getElementById("synonymsDisplay").textContent = synonyms.slice(0, 6).join(", ");
    synRow.classList.remove("hidden");
  } else {
    synRow.classList.add("hidden");
  }

  const antonyms = meaning.antonyms || [];
  const antRow = document.getElementById("antonymsRow");
  if (antonyms.length > 0) {
    document.getElementById("antonymsDisplay").textContent = antonyms.slice(0, 6).join(", ");
    antRow.classList.remove("hidden");
  } else {
    antRow.classList.add("hidden");
  }

  return true;
}

document.getElementById("myButton").addEventListener("click", async () => {
  const btn = document.getElementById("myButton");
  btn.disabled = true;
  startDots();
  showState("loadingState");

  let found = false;
  let attempts = 0;

  while (!found && attempts < 10) {
    attempts++;
    try {
      const word = await wordFinder();
      const entry = await getDefinition(word);
      if (entry && renderResult(word, entry)) {
        found = true;
        stopDots();
        showState("resultState");
      }
    } catch (err) {
      console.warn("Attempt failed:", err);
    }
  }

  if (!found) {
    stopDots();
    showState("idleState");
    document.querySelector(".idle-prompt").textContent = "— Could not find a word, try again —";
  }

  btn.disabled = false;
});
