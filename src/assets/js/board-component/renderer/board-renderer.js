import {insertImageInto, renderCard} from "./helper.js";
import {tokensDummyData} from "../dummy-data.js";
import {
  GOLD_TOKEN_LIMIT,
  NOBLES_MAPPER,
  TOKEN_LIMIT,
  TOKEN_LIMIT_THREE_PLAYERS,
  TOKEN_LIMIT_TWO_PLAYERS,
  TOKEN_MAPPER
} from "../config.js";

function renderCards(market) {
  for (const deck of market) {
    const $currentDeck = document.querySelector(`.level-${deck.level} .cards-in-deck`);

    for (const card of deck.visibleCards) {
      renderCard($currentDeck, card.prestigePoints, card.bonus, card.cost);
    }
  }
}

function getMaxTokens(playerLength, tokenType) {
  const twoPlayers = 2;
  const threePlayers = 3;

  if (tokenType === "Gold") return GOLD_TOKEN_LIMIT;

  if (playerLength === twoPlayers) {
    return TOKEN_LIMIT_TWO_PLAYERS;
  } else if (playerLength === threePlayers) {
    return TOKEN_LIMIT_THREE_PLAYERS;
  } else {
    return TOKEN_LIMIT;
  }
}

function renderBoardTokens(unclaimedTokens, playerLength) {
  const $boardTokensContainer = document.querySelector(".board-tokens");

  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of tokensDummyData.gems.toReversed()) {
    const $boardToken = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

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