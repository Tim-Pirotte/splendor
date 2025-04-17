import { TOKEN_MAPPER } from "../config.js";
import { MAX_PRESTIGE_POINTS } from "../../config.js";
import { copyNode } from "../../utils/data-handler.js";
import { validCardBuy } from "../state-machine/valid-action-checker.js";
import { insertImageInto } from "../../utils/renderer.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { hashDigest } from "../card-collection-component/helper.js";
import { hashToNumber, trackCardEncounter } from "../card-collection-component/card-collection.js";
import { CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS } from "../../card-collection-component/data.js";

function addNodesToEmptiedContainer($container, list, mapFunction) {
    safeEmptyContainer($container);

    for (const listItem of list) {
        $container.appendChild(mapFunction(listItem));
    }
}

function constructBackground(value, imageName, spacing) {
    /* Notice: css stacking order differs from html (https://www.w3.org/TR/css-backgrounds-3/#layering) */
    const layers = [];

    for (let i = 0; i < value; i++) {
        layers.push(`url("../assets/images/UI/tokens/${imageName}.webp") ${i * spacing}rem 100% no-repeat`);
    }

    return layers.toReversed().join(",\n");
}

function constructVerticalBackground(value, imageName, spacing) {
    /* Notice: css stacking order differs from html (https://www.w3.org/TR/css-backgrounds-3/#layering) */
    const layers = [];

    for (let i = value - 1; i >= 0; i--) {
        layers.push(`url("../assets/images/UI/tokens/${imageName}.webp") 0 calc(100% - ${i * spacing}rem) no-repeat`);
    }

    return layers.join(",\n");
}

function formatNumber(number) {
    return number.toString().padStart(2, "0");
}

function safeEmptyContainer($container) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
    $container.querySelectorAll(":scope> *").forEach($childElement => {
        if ($childElement.tagName.toLowerCase() !== "template") $childElement.outerHTML = "";
    });
}

function addSwitchButton($token, token) {
    const $switchButtonContainerTemplate = document.querySelector("#switch-tokens-container-template");
    const $container = copyNode($switchButtonContainerTemplate);

    if (token === "Gold") {
        const $button = $container.querySelector(".switch-token");
        safeEmptyContainer($button);
        insertImageInto($button, "UI/reset", false, "Reset payment");
    }

    $token.appendChild($container);
}

function getNumberedItemTemplate() {
    return document.querySelector("#numbered-item-template");
}

function renderCard(card) {
    const $card = copyNode(document.querySelector("#card-template"));
    $card.dataset.name = card["name"];
    $card.querySelector(".points").textContent = card["prestigePoints"];

    if (validCardBuy(card["name"])) $card.classList.add(`${TOKEN_MAPPER[card["bonus"]]}-buyable-card`);

    const $cardCost = $card.querySelector(".cost");
    renderCardCost(card, $cardCost);

    renderCardGraphics($card, card);

    return $card;
}

function renderCardCost(card, $cardCost) {
    const $costAmountTemplate = getNumberedItemTemplate();

    for (const [type, cost] of Object.entries(card["cost"])) {
        const $costItem = copyNode($costAmountTemplate);
        $costItem.querySelector(".amount").textContent = cost;
        $costItem.dataset.tokenType = type;

        insertImageInto($costItem, `UI/tokens/${TOKEN_MAPPER[type]}_chip`, true, `${TOKEN_MAPPER[type]} chip`);

        $cardCost.appendChild($costItem);
    }
}

function renderCardGraphics($card, card) {
    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[card["bonus"]]}_empty_card`, false, `${TOKEN_MAPPER[card["bonus"]]} card`);

    const illustration = getIllustration(card["name"], card["bonus"]);
    insertImageInto($card, `cards/illustrations/${illustration}`, false, illustration.replace("_", " "));
}

function getIllustration(cardName, cardBonus) {
    const gameId = loadFromStorage("gameId");
    const illustrationSeed = hashToNumber(hashDigest(`${gameId}-${cardName}`), ILLUSTRATIONS.length);
    const illustration = ILLUSTRATIONS[illustrationSeed];

    const illustrationModifierSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-modifier`));

    const chanceCategory = getChanceCategory(illustrationModifierSeed, CHANCES, CHANCE_CATEGORIES);

    if (chanceCategory === "REGULAR") {
        trackCardEncounter(cardBonus, illustration, "REGULAR", gameId, cardBonus);

        return `${TOKEN_MAPPER[cardBonus]}_${illustration}`;

    } else if(chanceCategory === "MISPRINT") {
        const misprintSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-misprint`), Object.keys(TOKEN_MAPPER).length);

        const illustrationColor = Object.values(TOKEN_MAPPER)[misprintSeed];

        trackCardEncounter(cardBonus, illustration, "MISPRINT", gameId, illustrationColor);

        return `${illustrationColor}_${illustration}`;
    } else {
        console.log("Yet to be implemented");
    }
}

function getChanceCategory(seed, chances, chanceCategories) {
    let cumulativeChance = 0;

    for (let i = 0; i < chances.length; i++) {
        cumulativeChance += chances[i];
        if (seed < cumulativeChance) {
            return chanceCategories[i];
        }
    }
}

function highlightPointsWinner(prestigePoints, $playerPoints) {
    if (prestigePoints >= MAX_PRESTIGE_POINTS) $playerPoints.classList.add("enough-points-to-win");
}

function getOrderedPlayersWithoutClientPlayer(players, clientPlayerName) {
    const clientPlayerIndex = getClientPlayerIndex(players, clientPlayerName);
    return orderPlayers(players, clientPlayerIndex);
}

function getClientPlayerIndex(players, clientPlayerName) {
    const gameCreatorIndex = 0;

    for (const playerIndex in players) {
        if (players[playerIndex]["name"] === clientPlayerName) {
            return parseInt(playerIndex);
        }
    }

    return gameCreatorIndex;
}

function orderPlayers(players, clientPlayerIndex) {
    return players.slice(clientPlayerIndex + 1).concat(players.slice(0, clientPlayerIndex));
}

function isCreator(players, otherPlayer) {
    return players[0]["name"] === otherPlayer["name"];
}

export {
    formatNumber,
    safeEmptyContainer,
    addSwitchButton,
    getNumberedItemTemplate,
    addNodesToEmptiedContainer,
    renderCard,
    highlightPointsWinner,
    getOrderedPlayersWithoutClientPlayer,
    isCreator,
    constructVerticalBackground,
    constructBackground,
};
