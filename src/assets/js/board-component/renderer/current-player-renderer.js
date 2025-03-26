import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {MAX_TOKENS_ALLOWED, PRESTIGE_POINTS_NEEDED_TO_WIN, TOKEN_MAPPER} from "../config.js";
import {formatNumber, insertImageInto, renderProgressBar} from "./helper.js";
import {tokensDummyData} from "../dummy-data.js";

function renderHeader() {
  document.querySelector(".top-bar h2").textContent = loadFromStorage("username");
}

function renderCurrentPlayer(players) {
  const currentPlayerName = loadFromStorage("username");
  for (const player of players) {
    if (player.name === currentPlayerName) {
      document.querySelector(".player-points p").textContent = `${formatNumber(player.totalPrestigePoints)}  / ${PRESTIGE_POINTS_NEEDED_TO_WIN}`;

      renderProgressBar(document.querySelector(".player-points .progress-bar"), player.totalPrestigePoints, "score");

      const $numberedItemTemplate = document.querySelector("#numbered-item-template");
      const $cardTemplate = document.querySelector("#card-template");

      const $reserved = document.querySelector(".reserved-cards ul")

      for (const card of player.reserve) {
        const $card = $cardTemplate.content.firstElementChild.cloneNode(true);
        $card.querySelector(".points").textContent = card.prestigePoints;
        const $cardCost = $card.querySelector(".cost");

        for (const [type, cost] of Object.entries(card.cost)) {
          const $costItem = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
          $costItem.querySelector(".amount").textContent = cost;
          insertImageInto($costItem, `UI/tokens/${TOKEN_MAPPER[type]}_chip`, true, `${TOKEN_MAPPER[type]} chip`);
          $cardCost.appendChild($costItem);
        }

        insertImageInto($card, `cards/empty/${TOKEN_MAPPER[card.bonus]}_empty_card`, false, `${TOKEN_MAPPER[card.bonus]} card`);
        insertImageInto($card, "cards/illustrations/camel", false, "camel");

        $reserved.appendChild($card);
      }

      document.querySelector(".player-tokens h4").textContent = `${formatNumber(countTokens(player.tokens))} / ${MAX_TOKENS_ALLOWED}`;

      renderCurrentPlayerTokens(player.tokens, player.bonuses);
    }
  }
}

function countTokens(tokens) {
  return Object.values(tokens).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function renderCurrentPlayerTokens(currentPlayerTokens, currentPlayerBonuses) {
  const $currentPlayerTokensContainer = document.querySelector(".player-tokens ul");

  const $numberedItemTemplate = document.querySelector("#numbered-item-template");
  const $progressBarTemplate = document.querySelector("#progress-bar-template");

  for (const token of tokensDummyData.gems) {
    const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    const $progressBar = $progressBarTemplate.content.firstElementChild.cloneNode(true);

    if (token !== "Gold") {
      insertImageInto($token, `UI/cards/${TOKEN_MAPPER[token]}_card_small`, true, `${TOKEN_MAPPER[token]} card`);
      $token.insertAdjacentHTML("afterbegin", `<p>${currentPlayerBonuses[token] || 0}</p>`)
    }

    $token.querySelector(".amount").textContent = currentPlayerTokens[token] || 0;
    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
    renderProgressBar($progressBar, currentPlayerTokens[token], TOKEN_MAPPER[token]);

    $token.appendChild($progressBar);
    $currentPlayerTokensContainer.appendChild($token);
  }
}

export {renderHeader, renderCurrentPlayer};