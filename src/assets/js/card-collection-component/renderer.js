import {CHANCE_CATEGORIES, ILLUSTRATIONS} from "./data.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";

function renderCardCollection() {
    const seenTree = loadFromStorage("cardCollection") || {};

    for (const chanceCategory of CHANCE_CATEGORIES) {
        renderCollectionCategory(seenTree, chanceCategory);
    }
}

function renderCollectionCategory(seenTree, category) {
    for (const [cardType, illustrations] of Object.entries(seenTree)) {
        renderCardType(cardType, illustrations, category);
    }
}

function renderCardType(cardType, illustrations, category) {
    for (const [illustration, collectedCategories] of Object.entries(illustrations)) {
        if (!(category in collectedCategories)) continue;

        if (category === "MISPRINT") {
            renderMisprintedCollectedCards(cardType, illustration, collectedCategories);
            continue;
        }

        renderCollectedCard(
            cardType,
            illustration,
            category,
            collectedCategories[category]["gameId"],
            collectedCategories[category]["cardName"],
        );
    }
}

function renderMisprintedCollectedCards(cardType, illustration, collectedCategories) {
    for (const [misprintType, validationData] of Object.entries(collectedCategories["MISPRINT"])) {
        renderCollectedCard(
            cardType,
            illustration,
            "MISPRINT",
            validationData["gameId"],
            validationData["cardName"],
            misprintType
        );
    }
}

function renderCollectedCard(cardType, illustration, category, gameId, cardName, misprintType) {
    if (!isValidCard(illustration, category, gameId, cardName, misprintType)) {
        throw new Error(`Card data has been tampered with (${illustration}: ${category})`)
    }
}

function isValidCard(illustration, category, gameId, cardName, misprintType) {
    if (!isCorrectIllustration(illustration, gameId, cardName)) return false;
    console.log(illustration, gameId, cardName, category, misprintType)
    return true;
}

function isCorrectIllustration(illustration, gameId, cardName) {
    const illustrationSeed = hashToNumber(hashDigest(`${gameId}-${cardName}`), ILLUSTRATIONS.length);
    const validIllustration = ILLUSTRATIONS[illustrationSeed];

    return illustration === validIllustration;
}

export { renderCardCollection };
