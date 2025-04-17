import {CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS} from "./data.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";
import {getChanceCategory, safeEmptyContainer} from "../board-component/renderer/helper.js";
import {TOKEN_MAPPER} from "../board-component/config.js";
import {isValidCard} from "./card-collection.js";
import {copyNode} from "../utils/data-handler.js";

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

function renderCorruptDataMessage() {
    const $main = document.querySelector("main");
    safeEmptyContainer($main);

    const $corruptDataMessage = copyNode(document.querySelector("#corrupt-data-template"));

    $main.appendChild($corruptDataMessage);
}

function renderCannotRestoreMessage() {
    document.querySelector(".corrupt-data-message").insertAdjacentHTML(
        "beforeend",
        "<p class='error-message'>Could not restore the data.<br>Sorry for the inconvenience.<br>(Unless if you are trying to cheat. Then you totally deserve this.)<br>If you think that something is wrong with our systems, feel free to contact us at <a href='mailto:example@example.com' target='_blank'>example@example.com</a>.</p>"
    );
}

export { renderCardCollection, renderCorruptDataMessage, renderCannotRestoreMessage };
