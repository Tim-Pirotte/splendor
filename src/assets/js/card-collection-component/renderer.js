import {CHANCE_CATEGORIES} from "./data.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

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
        throw new Error(`Card data has been tampered with (${illustration["category"]["name"]}: ${category})`)
    }
}

function isValidCard(illustration, category, gameId, cardName, misprintType) {
    console.log(illustration, gameId, cardName, category, misprintType)
    return true;
}

export { renderCardCollection };
