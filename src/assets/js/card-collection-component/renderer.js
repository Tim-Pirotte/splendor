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
    for (const illustration of Object.entries(illustrations)) {
        renderCollectedCard(cardType, illustration, category);
    }
}

function renderCollectedCard(cardType, illustration, category) {
    console.log(cardType, illustration, category);
}

export { renderCardCollection };
