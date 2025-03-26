import {insertImageInto, renderCard} from "./helper.js";
import {
  NOBLES_MAPPER,
  TOKEN_MAPPER
} from "../config.js";
import {getMaxTokens} from "../helper.js";

function renderCards(market) {
  for (const deck of market) {
    const $currentDeck = document.querySelector(`.level-${deck["level"]} .cards-in-deck`);

    for (const card of deck["visibleCards"]) {
      renderCard($currentDeck, card["prestigePoints"], card["bonus"], card["cost"]);
    }
  }
}

function renderBoardTokens(unclaimedTokens, playerLength, gems) {
  const $boardTokensContainer = document.querySelector(".board-tokens");

  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of gems.toReversed()) {
    const $boardToken = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

    $boardToken.dataset.type = token;
    $boardToken.dataset.amount = unclaimedTokens[token];

    const maxTokens = getMaxTokens(playerLength, token);

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