import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";

function trackCardEncounter(bonusColor, illustrationName, variant, gameId, illustrationColor) {
    const seenTree = loadFromStorage("cardCollection") || {};

    if (!seenTree[bonusColor]) seenTree[bonusColor] = {};
    if (!seenTree[bonusColor][illustrationName]) seenTree[bonusColor][illustrationName] = {};

    const branch = seenTree[bonusColor][illustrationName];

    if (variant === "MISPRINT") {
        if (!branch[variant]) branch[variant] = {};
        branch[variant][illustrationColor] = gameId;
    } else {
        branch[variant] = gameId;
    }

    localStorage.setItem("cardCollection", JSON.stringify(seenTree));
}

function hashToNumber(hashString, rangeMax = 1000) {
    const byteArray = [];

    for (let i = 0; i < hashString.length; i += 2) {
        byteArray.push(parseInt(hashString.slice(i, i + 2), 16));
    }

    let number = 0;

    for (const byte of byteArray) {
        number = (number << 8) + byte;
    }

    number = number >>> 0;

    return number % rangeMax;
}

export { hashToNumber, trackCardEncounter };