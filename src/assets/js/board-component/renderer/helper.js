import { CHIP_SPACING, TOKEN_MAPPER } from "../config.js";
import { copyNode } from "../../utils/data-handler.js";
import { validCardBuy } from "../state-machine/valid-action-checker.js";

function addNodesToEmptiedContainer($container, list, mapFunction) {
    safeEmptyContainer($container);

    for (const listItem of list) {
        $container.appendChild(mapFunction(listItem));
    }
}

function toggleClass($node, className, condition) {
    if (condition) {
        $node.classList.add(className);
    } else {
        $node.classList.remove(className);
    }
}

function insertImageInto($container, standardPath, before, alt) {
    const $image = copyNode(document.querySelector("#image-template"));
    setImageData($image, standardPath, alt);

    $container.insertAdjacentHTML(before ? "afterbegin" : "beforeend", $image.outerHTML);
}

function setImageData($image, standardPath, alt) {
    $image.querySelector("source").srcset = `../assets/images/${standardPath}.webp`;

    const $img = $image.querySelector("img");

    $img.src = `../assets/images/fallback/${standardPath}.png`;
    $img.alt = $img.title = alt;
}

function constructBackground(value, color) {
    let background = "";

    for (let i = 0; i < value - 1; i++) background += `url("../assets/images/UI/tokens/${color}_topdown_chip.webp") ${i * CHIP_SPACING}rem 100%,\n`;

    if (value > 0) background += `url("../assets/images/UI/tokens/${color}_topdown_chip_end.webp") ${(value - 1) * CHIP_SPACING}rem 100%`;

    return background;
}

function renderProgressBar($progressBar, value, color) {
    $progressBar.style.background = constructBackground(value, color);
    $progressBar.style.backgroundRepeat = "no-repeat";
    $progressBar.style.width = `${(value + 1) * CHIP_SPACING}rem`;
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

    if (validCardBuy(card["name"])) $card.classList.add("buyable-card");

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

export {
    insertImageInto,
    renderProgressBar,
    formatNumber,
    safeEmptyContainer,
    addSwitchButton,
    getNumberedItemTemplate,
    addNodesToEmptiedContainer,
    renderCard,
    toggleClass,
};
