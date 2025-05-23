import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { addToTree } from "../../card-collection-component/helper.js";
import { playEffect } from "../../sound-component/sound.js";

function trackCardEncounter(bonusColor, illustrationName, variant, gameId, illustrationColor, cardName) {
    const seenTree = loadFromStorage("cardCollection") || {};

    const path = variant === "MISPRINT"
        ? [bonusColor, illustrationName, variant, illustrationColor]
        : [bonusColor, illustrationName, variant];

    const valueChanged = addToTree(seenTree, path, path.length, { gameId, cardName, discoveryDate: Date.now() });

    if (valueChanged) renderCardUnlockedMessage(variant);

    localStorage.setItem("cardCollection", JSON.stringify(seenTree));
}

function renderCardUnlockedMessage(variant) {
    const cardUnlockedDuration = 10_050;

    if (variant !== "REGULAR") {
        const messageContainer = document.querySelector(".unlocked-card-message");
        const messageText = `${variant.charAt(0) + variant.slice(1).toLowerCase().replace("_", " ")} card discovered!`;

        const p = document.createElement("p");

        p.textContent = messageText;
        messageContainer.appendChild(p);

        playEffect("level-up", false);

        setTimeout(() => {
            p.remove();
        }, cardUnlockedDuration);
    }
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