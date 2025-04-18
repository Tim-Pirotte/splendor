import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";

function trackCardEncounter(bonusColor, illustrationName, variant, gameId, illustrationColor, cardName) {
    const seenTree = loadFromStorage("cardCollection") || {};

    const path = variant === "MISPRINT"
        ? [bonusColor, illustrationName, variant, illustrationColor]
        : [bonusColor, illustrationName, variant];

    updateTree(seenTree, path, path.length, { gameId, cardName });

    localStorage.setItem("cardCollection", JSON.stringify(seenTree));
}

function hashToNumber(hashString, rangeMax = 1000) {
    let number = 0;

    for (let i = 0; i < hashString.length; i += 2) {
        const byte = parseInt(hashString.slice(i, i + 2), 16);
        number = (number << 8) + byte;
    }

    number = number >>> 0;

    return number % rangeMax;
}

export { hashToNumber, trackCardEncounter };