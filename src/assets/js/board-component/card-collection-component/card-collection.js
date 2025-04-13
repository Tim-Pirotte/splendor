import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";

function trackCardEncounter(bonusColor, illustrationName, illustrationColor) {
    const seenTree = loadFromStorage("cardCollection") || {};

    if (!seenTree[bonusColor]) seenTree[bonusColor] = {};
    if (!seenTree[bonusColor][illustrationName]) seenTree[bonusColor][illustrationName] = [];

    const list = seenTree[bonusColor][illustrationName];
    if (!list.includes(illustrationColor)) {
        list.push(illustrationColor);
        localStorage.setItem("seenTree", JSON.stringify(seenTree));
    }
}
