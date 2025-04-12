import { CHIP_SPACING, TOKEN_MAPPER } from "../config.js";
import { MAX_PRESTIGE_POINTS } from "../../config.js";
import { copyNode } from "../../utils/data-handler.js";
import { validCardBuy } from "../state-machine/valid-action-checker.js";
import { insertImageInto } from "../../utils/renderer.js";

function addNodesToEmptiedContainer($container, list, mapFunction) {
    safeEmptyContainer($container);

    for (const listItem of list) {
        $container.appendChild(mapFunction(listItem));
    }
}

function constructBackground(value, imageName, spacing) {
    let background = "";

    for (let i = 0; i < value - 1; i++) {
        background += `url("../assets/images/UI/tokens/${imageName}.webp") ${i * spacing}rem 100%,\n`;
    }

    if (value > 0) {
        background += `url("../assets/images/UI/tokens/${imageName}.webp") ${(value - 1) * spacing}rem 100%`;
    }

    return background;
}

function constructVerticalBackground(value, imageName, spacing) {
    let background = "";

    for (let i = value - 1; i > 0; i--) {
        background += `url("../assets/images/UI/tokens/${imageName}.webp") 0 calc(100% - ${i * spacing}rem),\n`;
    }

    if (value > 0) {
        background += `url("../assets/images/UI/tokens/${imageName}.webp") 0 calc(100% - 0rem)`;
    }

    return background;
}

function renderProgressBar(
    $progressBar,
    value,
    imageName,
    spacing = CHIP_SPACING,
    setWidth = true,
    vertical = false,
) {
    if (vertical) {
        $progressBar.style.background = constructVerticalBackground(value, imageName, spacing);
    } else {
        $progressBar.style.background = constructBackground(value, imageName, spacing);
    }

    $progressBar.style.backgroundRepeat = "no-repeat";
    if (setWidth) $progressBar.style.width = `${(value + 1) * spacing}rem`;
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

    if (token === "Gold") $container.querySelector(".switch-token").textContent = "Reset";

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

        insertImageInto($costItem, `UI/tokens/${TOKEN_MAPPER[type]}_chip`, true, `${TOKEN_MAPPER[type]} chip`);

        $cardCost.appendChild($costItem);
    }
}

function renderCardGraphics($card, card) {
    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[card["bonus"]]}_empty_card`, false, `${TOKEN_MAPPER[card["bonus"]]} card`);
    insertImageInto($card, "cards/illustrations/camel", false, "camel");
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
    renderProgressBar,
    formatNumber,
    safeEmptyContainer,
    addSwitchButton,
    getNumberedItemTemplate,
    addNodesToEmptiedContainer,
    renderCard,
    highlightPointsWinner,
    getOrderedPlayersWithoutClientPlayer,
    isCreator,
};
