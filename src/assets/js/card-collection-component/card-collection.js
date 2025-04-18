import {renderCannotRestoreMessage, renderCardCollection, renderCorruptDataMessage} from "./renderer.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";
import {CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS} from "./data.js";
import {getChanceCategory} from "../board-component/renderer/helper.js";
import {TOKEN_MAPPER} from "../board-component/config.js";
import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {convertTreeToArray} from "./helper.js";

function init() {
    document.querySelector("main").addEventListener("click", handleCorruptButtonClick);

    try {
        renderCardCollection();
    } catch (err) {
        console.error(err);
        renderCorruptDataMessage();
    }
}

init();

function isValidCard(illustration, category, gameId, cardName, misprintType) {
    if (!isCorrectIllustration(illustration, gameId, cardName)) return false;
    if (!isCorrectCategory(category, gameId, cardName)) return false;
    if (misprintType) return !isCorrectMisprint(misprintType, gameId, cardName);

    return true;
}

function isCorrectIllustration(illustration, gameId, cardName) {
    const illustrationSeed = hashToNumber(hashDigest(`${gameId}-${cardName}`), ILLUSTRATIONS.length);
    const validIllustration = ILLUSTRATIONS[illustrationSeed];

    return illustration === validIllustration;
}

function isCorrectCategory(category, gameId, cardName) {
    const illustrationModifierSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-modifier`));
    const validCategory = getChanceCategory(illustrationModifierSeed, CHANCES, CHANCE_CATEGORIES);

    return category === validCategory;
}


function isCorrectMisprint(misprintType, gameId, cardName) {
    const misprintSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-misprint`), Object.keys(TOKEN_MAPPER).length);
    const validMisprintType = Object.values(TOKEN_MAPPER)[misprintSeed];

    return misprintType === validMisprintType;
}

function handleCorruptButtonClick(e) {
    if (e.target.tagName.toLowerCase() !== "button") return;

    e.target.disabled = true;

    if (e.target.dataset.action === "deleteData") {
        deleteData();
        location.reload();
    } else {
        tryRestoringData();
    }
}

function deleteData() {
    saveToStorage("cardCollection", {});
}

function tryRestoringData() {
    try {
        restoreData();
    } catch (err) {
        console.error(err);
        renderCannotRestoreMessage();
    }
}

function restoreData() {

}

export { isValidCard, isCorrectIllustration, isCorrectCategory, isCorrectMisprint };
