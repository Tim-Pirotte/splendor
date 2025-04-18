import {CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS} from "./data.js";
import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";
import {getChanceCategory, safeEmptyContainer} from "../board-component/renderer/helper.js";
import {TOKEN_MAPPER} from "../board-component/config.js";
import {countCards, isValidCard} from "./card-collection.js";
import {copyNode} from "../utils/data-handler.js";
import {convertTreeToArray} from "./helper.js";
import {insertImageInto} from "../utils/renderer.js";
import {GEMS} from "../board-component/data.js";

function renderCardCollection() {
    const seenTree = loadFromStorage("cardCollection") || {};

    const cardCollection = [];
    convertTreeToArray(seenTree, ["bonusColor", "illustrationName", "variant"], cardCollection, {}, 4);

    const categoryNodes = getCategoryNodes();

    for (const card of cardCollection) {
        if (card["variant"] !== "MISPRINT") {
            renderCollectedCard(
                card["bonusColor"],
                card["illustrationName"],
                card["variant"],
                card["gameId"],
                card["cardName"],
                categoryNodes,
            );
        } else {
            renderMisprintCard(card, categoryNodes);
        }
    }

    renderCollectionAmounts(cardCollection, categoryNodes);
}

function getCategoryNodes() {
    const result = {};

    for (const category of CHANCE_CATEGORIES) {
        result[category] = document.querySelector(`#${category}`);
    }

    return result;
}

function renderCollectedCard(cardType, illustration, category, gameId, cardName, categoryNodes, misprintType) {
    if (!isValidCard(illustration, category, gameId, cardName, misprintType)) {
        throw new Error(`Card data has been tampered with (${illustration}: ${category})`)
    }

    const $card = document.createElement("li");
    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[cardType]}_empty_card`, false, `${TOKEN_MAPPER[cardType]} card`);

    switch (category) {
        case "REGULAR":
            insertImageInto($card, `cards/illustrations/${TOKEN_MAPPER[cardType]}_${illustration}`, false, illustration.replace("_", " "));
            break;
        case "MISPRINT":
            insertImageInto($card, `cards/illustrations/${TOKEN_MAPPER[misprintType]}_${illustration}`, false, illustration.replace("_", " "));
            break;
        default:
            insertImageInto($card, `cards/illustrations/${category.toLowerCase()}_${illustration}`, false, illustration.replace("_", " "));
    }

    categoryNodes[category].querySelector("ul").appendChild($card);
}

function renderMisprintCard(card, categoryNodes) {
    for (const tokenType of GEMS) {
        if (tokenType in card) {
            renderCollectedCard(
                card["bonusColor"],
                card["illustrationName"],
                "MISPRINT",
                card[tokenType]["gameId"],
                card[tokenType]["cardName"],
                categoryNodes,
                tokenType);
        }
    }
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

function renderCollectionAmounts(cardCollection, categoryNodes) {
    const variationsPerIllustrationPerCard = 9;
    const cardCounts = countCards(cardCollection);

    document.querySelector("header .current-amount").textContent = cardCounts["total"].toFixed().padStart(2, "0");
    document.querySelector("header .max-amount").textContent = (Object.values(TOKEN_MAPPER).length - 1) * ILLUSTRATIONS.length * variationsPerIllustrationPerCard;

    for (const [category, categoryNode] of Object.entries(categoryNodes)) {
        if (category in cardCounts) {
            categoryNode.querySelector(".current-amount").textContent = cardCounts[category].toFixed(0).padStart(2, "0");
        }

        categoryNode.querySelector(".max-amount").textContent = category === "MISPRINT"
            ? (Object.values(TOKEN_MAPPER).length - 1)**2 * ILLUSTRATIONS.length
            : (Object.values(TOKEN_MAPPER).length - 1) * ILLUSTRATIONS.length;
    }
}

export { renderCardCollection, renderCorruptDataMessage, renderCannotRestoreMessage };
