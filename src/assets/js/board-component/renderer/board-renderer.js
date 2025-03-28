import {insertImageInto, renderCard, safeEmptyContainer} from "./helper.js";
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
    const $currentDeck = document.querySelector(`.level-${deck["level"]} .cards-in-deck`);
    $currentDeck.dataset.amount = deck["cardStackSize"];
    safeEmptyContainer($currentDeck);

    for (const card of deck["visibleCards"]) {
      renderCard($currentDeck, card["prestigePoints"], card["bonus"], card["cost"], card["name"]);
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

function renderBoardTokens(unclaimedTokens, playerLength, gems) {
  const $boardTokensContainer = document.querySelector(".board-tokens");
  safeEmptyContainer($boardTokensContainer);

  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of gems.toReversed()) {
    const $boardToken = $numberedItemTemplate.content.firstElementChild.cloneNode(true);

    $boardToken.dataset.type = token;
    $boardToken.dataset.amount = unclaimedTokens[token];

    const maxTokens = getMaxTokens(playerLength, token);

    $boardToken.querySelector(".amount").textContent = `${(unclaimedTokens[token] || 0)}/${maxTokens}`;
    insertImageInto($boardToken, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);

    $boardTokensContainer.appendChild($boardToken);
  }
}

function getNobleAlt(costs) {
  let alt = "Noble (+3 pts.) | Cost: ";

  for (const [tokenType, amount] of Object.entries(costs)) {
    alt += `${tokenType}: ${amount} `;
  }

  return alt;
}

function renderNobles(unclaimedNobles) {
  const $noblesContainer = document.querySelector(".nobles");
  safeEmptyContainer($noblesContainer);

  const $nobleTemplate = document.querySelector("#noble-template");

  for (const noble of unclaimedNobles) {
    const $noble = $nobleTemplate.content.firstElementChild.cloneNode(true);
    $noble.dataset.name = noble["name"];
    insertImageInto($noble, `nobles/${NOBLES_MAPPER[noble.name]}`, false, getNobleAlt(noble["neededBonuses"]));
    $noblesContainer.appendChild($noble);
  }
}

export {renderCards, renderBoardTokens, renderNobles};