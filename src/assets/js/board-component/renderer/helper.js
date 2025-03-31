import { CHIP_SPACING, TOKEN_MAPPER } from "../config.js";
import {copyNode} from "../../utils/data-handler.js";

function insertImageInto($container, standardPath, before, alt) {
  const $image = copyNode(document.querySelector("#image-template"));

    $image.querySelector("source").srcset = `../assets/images/${standardPath}.webp`;
    const $img = $image.querySelector("img");
    $img.src = `../assets/images/fallback/${standardPath}.png`;
    $img.alt = $img.title = alt;

    let position = "beforeend";

    if (before) {
        position = "afterbegin";
    }

    $container.insertAdjacentHTML(position, $image.outerHTML);
}

function renderProgressBar($progressBar, value, color) {
    let background = "";

    for (let i = 0; i < value - 1; i++) {
        background += `url("../assets/images/UI/tokens/${color}_topdown_chip.webp") ${i * CHIP_SPACING}rem 100%,\n`;
    }

    if (value > 0) {
        background += `url("../assets/images/UI/tokens/${color}_topdown_chip_end.webp") ${(value - 1) * CHIP_SPACING}rem 100%`;
    }

    $progressBar.style.background = background;
    $progressBar.style.backgroundRepeat = "no-repeat";
    $progressBar.style.width = `${(value + 1) * CHIP_SPACING}rem`;
}

function formatNumber(number) {
    return number.toString().padStart(2, "0");
}

function renderCard($container, points, bonus, costs, name) {
  const $numberedItemTemplate = getNumberedItemTemplate();
  const $card = copyNode(document.querySelector("#card-template"));

    $card.querySelector(".points").textContent = points;
    $card.dataset.name = name;

    const $cardCost = $card.querySelector(".cost");

  for (const [type, cost] of Object.entries(costs)) {
    const $costItem = copyNode($numberedItemTemplate)
    $costItem.querySelector(".amount").textContent = cost;

        insertImageInto($costItem, `UI/tokens/${TOKEN_MAPPER[type]}_chip`, true, `${TOKEN_MAPPER[type]} chip`);

        $cardCost.appendChild($costItem);
    }

    insertImageInto($card, `cards/empty/${TOKEN_MAPPER[bonus]}_empty_card`, false, `${TOKEN_MAPPER[bonus]} card`);
    insertImageInto($card, "cards/illustrations/camel", false, "camel");
    $container.appendChild($card);
}

function safeEmptyContainer($container) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/:scope
    $container.querySelectorAll(":scope> *").forEach($childElement => {
        if ($childElement.tagName.toLowerCase() !== "template") {
            $childElement.outerHTML = "";
        }
    });
}

function getSwitchButtonTemplate(token) {
  const $switchButtonContainerTemplate = document.querySelector("#switch-tokens-container-template");
  const $container = copyNode($switchButtonContainerTemplate);

    if (token === "Gold") {
        $container.querySelector(".switch-token").textContent = "Reset";
    }

    return $container;
}

function getNumberedItemTemplate() {
  return document.querySelector("#numbered-item-template");
}

export {
  insertImageInto,
  renderProgressBar,
  formatNumber,
  renderCard,
  safeEmptyContainer,
  getSwitchButtonTemplate,
  getNumberedItemTemplate
};
