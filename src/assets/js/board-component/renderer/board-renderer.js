import {insertImageInto, renderCard} from "./helper.js";
import {tokensDummyData} from "../dummy-data.js";
import {NOBLES_MAPPER, TOKEN_MAPPER} from "../config.js";

function renderCards(market) {
  for (const deck of market) {
    const $currentDeck = document.querySelector(`.level-${deck.level} .cards-in-deck`);

    for (const card of deck.visibleCards) {
      renderCard($currentDeck, card.prestigePoints, card.bonus, card.cost);
    }
  }
}

function getMaxTokens(playerLength, tokenType) {
  if (tokenType === "Gold") return 5;

  if (playerLength === 2) {
    return 4;
  } else if (playerLength === 3) {
    return 5;
  } else {
    return 7;
  }
}

function renderBoardTokens(unclaimedTokens, playerLength) {
  const $boardTokensContainer = document.querySelector(".board-tokens");

  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of tokensDummyData.gems.reverse()) {
    const $boardToken = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

    let maxTokens = getMaxTokens(playerLength);
    if (token === "Gold") {
      maxTokens = 5;
    }

    $boardToken.querySelector(".amount").textContent = `${unclaimedTokens[token]}/${maxTokens}`;
    insertImageInto($boardToken, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);

    $boardTokensContainer.appendChild($boardToken);
  }
}

function renderNobles(unclaimedNobles) {
  const $noblesContainer = document.querySelector(".nobles");

  const $nobleTemplate = document.querySelector("#noble-template");

  for (const noble of unclaimedNobles) {
    const $noble = $nobleTemplate.content.firstElementChild.cloneNode(true);
    insertImageInto($noble, `nobles/${NOBLES_MAPPER[noble.name]}`, false, "Noble (+3 pts.)");
    $noblesContainer.appendChild($noble);
  }
}

export {renderCards, renderBoardTokens, renderNobles};