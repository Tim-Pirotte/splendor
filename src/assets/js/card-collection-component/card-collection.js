import {
    renderCannotRestoreMessage,
    renderCardCollection,
    renderCorruptDataMessage,
} from "./renderer.js";
import { hashToNumber } from "../board-component/card-collection-component/card-collection.js";
import { hashDigest } from "../utils/crypto.js";
import { CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS } from "./data.js";
import { getChanceCategory } from "../board-component/renderer/helper.js";
import { TOKEN_MAPPER } from "../board-component/config.js";
import { deleteFromStorage, loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { convertTreeToArray, removeFromTree, unpackMisprintObjects } from "./helper.js";

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

function isValidCard(illustration, category, gameId, cardName, misprintType, cardBonus) {
    if (!isCorrectIllustration(illustration, gameId, cardName)) return false;
    if (!isCorrectCategory(category, gameId, cardName)) return false;
    if (misprintType) return isCorrectMisprint(misprintType, gameId, cardName, cardBonus);

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

function isCorrectMisprint(misprintType, gameId, cardName, cardBonus) {
    const colorsToChooseFrom = Object.keys(TOKEN_MAPPER).filter(k => k !== cardBonus);
    const misprintSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-misprint`), colorsToChooseFrom.length);
    const validMisprintType = colorsToChooseFrom[misprintSeed];

    return misprintType === validMisprintType;
}

function handleCorruptButtonClick(e) {
    if (e.target.tagName.toLowerCase() !== "button") return;

    const $button = e.target;
    $button.disabled = true;

    if ($button.dataset.action === "deleteData") {
        deleteData();
        location.reload();
    } else {
        tryRestoringData();
    }
}

function deleteData() {
    deleteFromStorage("cardCollection");
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
    const seenTree = loadFromStorage("cardCollection") || {};

    const faultyBranches = getFaultyBranches(seenTree);
    removeFaultyBranches(faultyBranches, seenTree);

    if (getFaultyBranches(seenTree).length !== 0) throw new Error("Could not restore the card collection data");

    localStorage.setItem("cardCollection", JSON.stringify(seenTree));
    location.reload();
}

function getFaultyBranches(seenTree) {
    const faultyBranches = [];

    const cardCollection = [];
    convertTreeToArray(seenTree, ["bonusColor", "illustrationName", "variant"], cardCollection, {});
    unpackMisprintObjects(cardCollection);

    for (const card of cardCollection) {
        if (isFaultyBranch(card)) {
            addFaultyBranch(faultyBranches, card);
        }
    }

    return faultyBranches;
}

function addFaultyBranch(faultyBranches, card) {
    faultyBranches.push([card["bonusColor"], card["illustrationName"], card["variant"]]);
    if (card["variant"] === "MISPRINT") faultyBranches[faultyBranches.length - 1].push(card["misprintType"]);
}

function isFaultyBranch(card) {
    return !isValidCard(
        card["illustrationName"],
        card["variant"],
        card["gameId"],
        card["cardName"],
        card["misprintType"],
        card["bonusColor"],
    );
}

function removeFaultyBranches(faultyBranches, seenTree) {
    for (const faultyBranch of faultyBranches) {
        removeFromTree(seenTree, faultyBranch);
    }
}

function countCards(cardCollection) {
    const cardCounts = { total: 0 };

    for (const card of cardCollection) {
        if (card["variant"] in cardCounts) {
            cardCounts[card["variant"]]++;
        } else {
            cardCounts[card["variant"]] = 1;
        }
    }

    for (const amount of Object.values(cardCounts)) {
        cardCounts["total"] += amount;
    }

    return cardCounts;
}

export { isValidCard, isCorrectIllustration, isCorrectCategory, isCorrectMisprint, countCards };
