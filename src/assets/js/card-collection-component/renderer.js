import {CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS} from "./data.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";
import {getChanceCategory, safeEmptyContainer} from "../board-component/renderer/helper.js";
import {TOKEN_MAPPER} from "../board-component/config.js";
import {isValidCard} from "./card-collection.js";
import {copyNode} from "../utils/data-handler.js";
import {convertTreeToArray} from "./helper.js";
import {insertImageInto} from "../utils/renderer.js";

function renderCardCollection() {
    const seenTree = loadFromStorage("cardCollection") || {};

    const cardCollection = [];
    convertTreeToArray(seenTree, ["bonusColor", "illustrationName", "variant"], cardCollection, {}, 4);

    const categoryNodes = getCategoryNodes();

    console.log(cardCollection)

    for (const card of cardCollection) {
        renderCollectedCard(
            card["bonusColor"],
            card["illustrationName"],
            card["variant"],
            card["gameId"],
            card["cardName"],
            categoryNodes,
        );
    }
}

function getCategoryNodes() {
    const result = {};

    for (const category of CHANCE_CATEGORIES) {
        result[category] = document.querySelector(`#${category} ul`);
    }

    return result;
}

function renderCollectedCard(cardType, illustration, category, gameId, cardName, categoryNodes, misprintType) {
    if (!isValidCard(illustration, category, gameId, cardName, misprintType)) {
        throw new Error(`Card data has been tampered with (${illustration}: ${category})`)
    }

    const $card = document.createElement("li");
    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[cardType]}_empty_card`, false, `${TOKEN_MAPPER[cardType]} card`);

    categoryNodes[category].appendChild($card);
}

function renderCorruptDataMessage() {
    const $main = document.querySelector("main");
    safeEmptyContainer($main);

    const $corruptDataMessage = copyNode(document.querySelector("#corrupt-data-template"));

    $main.appendChild($corruptDataMessage);
}

function renderCannotRestoreMessage() {
    const $errorMessage = copyNode(document.querySelector("#error-message-template"));
    document.querySelector(".corrupt-data-message").appendChild($errorMessage);
}

export { renderCardCollection, renderCorruptDataMessage, renderCannotRestoreMessage };
