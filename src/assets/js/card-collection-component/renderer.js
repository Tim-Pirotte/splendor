import { CHANCE_CATEGORIES, ILLUSTRATIONS } from "./data.js";
import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { safeEmptyContainer } from "../board-component/renderer/helper.js";
import { TOKEN_MAPPER } from "../board-component/config.js";
import { countCards, isValidCard } from "./card-collection.js";
import { copyNode } from "../utils/data-handler.js";
import { convertTreeToArray, unpackMisprintObjects } from "./helper.js";
import { insertImageInto } from "../utils/renderer.js";

function renderCardCollection() {
    const seenTree = loadFromStorage("cardCollection") || {};

    const cardCollection = [];
    convertTreeToArray(seenTree, ["bonusColor", "illustrationName", "variant"], cardCollection, {});
    unpackMisprintObjects(cardCollection);

    // Avoids going to the DOM tree for each card render
    const categoryNodes = getCategoryNodes();

    for (const card of cardCollection) {
        renderCollectedCard(card, categoryNodes);
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

function renderCollectedCard(card, categoryNodes) {
    if (!isValidCard(card["illustrationName"], card["variant"], card["gameId"], card["cardName"], card["misprintType"], card["bonusColor"])) {
        throw new Error(`Card data has been tampered with (${card["illustrationName"]}: ${card["variant"]})`);
    }

    const $card = document.createElement("li");
    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[card["bonusColor"]]}_empty_card`, false, `${TOKEN_MAPPER[card["bonusColor"]]} card`);

    switch (card["variant"]) {
    case "REGULAR":
        insertImageInto($card, `cards/illustrations/${TOKEN_MAPPER[card["bonusColor"]]}_${card["illustrationName"]}`, false, card["illustrationName"].replace("_", " "));
        break;
    case "MISPRINT":
        insertImageInto($card, `cards/illustrations/${TOKEN_MAPPER[card["misprintType"]]}_${card["illustrationName"]}`, false, card["illustrationName"].replace("_", " "));
        break;
    default:
        insertImageInto($card, `cards/illustrations/${card["variant"].toLowerCase()}_${card["illustrationName"]}`, false, card["illustrationName"].replace("_", " "));
    }

    $card.insertAdjacentHTML("beforeend", `<p>Discovered on ${new Date(card["discoveryDate"]).toLocaleDateString()}</p>`);

    categoryNodes[card["variant"]].querySelector("ul").appendChild($card);
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
            ? (Object.values(TOKEN_MAPPER).length - 1) ** 2 * ILLUSTRATIONS.length
            : (Object.values(TOKEN_MAPPER).length - 1) * ILLUSTRATIONS.length;
    }
}

export { renderCardCollection, renderCorruptDataMessage, renderCannotRestoreMessage, getCategoryNodes };
