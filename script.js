
async function wordFinder() {
    const apiWord = "https://random-word-api.herokuapp.com/word";
    const response = await fetch(apiWord);
    const data = await response.json();
    return data[0];
}

async function definition(word) {
    const api = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word;
    const response = await fetch(api);
    const answer = await response.json();

    if (Array.isArray(answer) && answer.length > 0) {
        let output = `Your word is ${word}\n`;
        const defi = answer[0]["meanings"];
        output += `Part of Speech: ${defi[0]['partOfSpeech']}\nDefinitions:\n`;
        for (let i = 0; i < defi[0]['definitions'].length; i++) {
            output += `${i + 1}. ${defi[0]['definitions'][i]["definition"]}\n`;
        }

        const synonyms = defi[0]["synonyms"];
        output += `Synonyms: ${synonyms && synonyms.length > 0 ? synonyms.join(", ") : "N/A"}\n`;

        const antonyms = defi[0]["antonyms"];
        output += `Antonyms: ${antonyms && antonyms.length > 0 ? antonyms.join(", ") : "N/A"}\n`;

        return output;
    } else {
        return false;
    }
}

document.getElementById("myButton").onclick = async () => {
document.getElementById("wordOutput").textContent = "Loading...";
    let bo = true;
    while (bo) {
        const word = await wordFinder();
        const result = await definition(word);
        if (result !== false) {
            document.getElementById("wordOutput").textContent = result;
            bo = false;
        }
    }
};
