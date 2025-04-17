import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";

function trackCardEncounter(bonusColor, illustrationName, variant, gameId, illustrationColor, cardName) {
    const seenTree = loadFromStorage("cardCollection") || {};

    if (!seenTree[bonusColor]) seenTree[bonusColor] = {};
    if (!seenTree[bonusColor][illustrationName]) seenTree[bonusColor][illustrationName] = {};

    const branch = seenTree[bonusColor][illustrationName];

    if (!branch[variant]) branch[variant] = {};

    if (variant === "MISPRINT") {
        if (!branch[variant][illustrationColor]) branch[variant][illustrationColor] = {};
        branch[variant][illustrationColor]["gameId"] = gameId;
        branch[variant][illustrationColor]["cardName"] = cardName;
    } else {
        branch[variant]["gameId"] = gameId;
        branch[variant]["cardName"] = cardName
    }

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