import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function trackCardEncounter(bonusColor, illustrationName, illustrationColor) {
    const seenTree = loadFromStorage("cardCollection") || {};

    if (!seenTree[bonusColor]) seenTree[bonusColor] = {};
    if (!seenTree[bonusColor][illustrationName]) seenTree[bonusColor][illustrationName] = [];

    const list = seenTree[bonusColor][illustrationName];
    if (!list.includes(illustrationColor)) {
        list.push(illustrationColor);
        localStorage.setItem("cardCollection", JSON.stringify(seenTree));
    }
}

function hashToNumber(hashString, rangeMax = 1000) {
    const byteArray = [];
    for (let i = 0; i < hashString.length; i += 2) {
        byteArray.push(parseInt(hashString.slice(i, i + 2), 16));
    }

    let number = 0;
    for (let i = 0; i < byteArray.length; i++) {
        number = (number << 8) + byteArray[i];
    }

    number = number >>> 0;

    return number % rangeMax;
}

export { hashToNumber, trackCardEncounter };