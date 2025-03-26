import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {formatNumber, insertImageInto} from "./helper.js";
import {tokensDummyData} from "../dummy-data.js";
import {TOKEN_MAPPER} from "../config.js";

function renderOtherPlayers(otherPlayers) {
  const currentPlayerName = loadFromStorage("username");

  const $otherPlayerContainer = document.querySelector(".other-players");
  const $template = document.querySelector("#other-player-card-template");

  for (const otherPlayer of otherPlayers) {
    if (otherPlayer.name !== currentPlayerName) {
      const $playerCard = $template.content.firstElementChild.cloneNode(true);
      $playerCard.querySelector(".name").textContent = otherPlayer.name;
      $playerCard.querySelector(".points").textContent = `${formatNumber(otherPlayer.totalPrestigePoints)} pts.`;

      renderTokenList($playerCard.querySelector(".tokens"), otherPlayer.tokens);
      renderCardList($playerCard.querySelector(".cards"), otherPlayer.bonuses);
      renderReservedList($playerCard.querySelector(".reserved"), otherPlayer.reserve);

      $otherPlayerContainer.appendChild($playerCard);
    }
  }
}

function renderTokenList(containerToInsertInto, tokenAmounts) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of tokensDummyData.gems) {
    const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    $token.querySelector(".amount").textContent = tokenAmounts[token] || 0;
    insertImageInto($token, `UI/tokens/${TOKEN_MAPPER[token]}_chip`, false, `${TOKEN_MAPPER[token]} chip`);
    containerToInsertInto.appendChild($token);
  }
}

function renderCardList(containerToInsertInto, cardAmounts) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const cardType of tokensDummyData.gems) {
    if (cardType !== "Gold") {
      const $card = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
      $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
      insertImageInto($card, `UI/cards/${TOKEN_MAPPER[cardType]}_card_small`, false, `${TOKEN_MAPPER[cardType]} card`);
      containerToInsertInto.appendChild($card);
    }
  }
}

function renderReservedList(containerToInsertInto, reservedCards) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const reservedCard of reservedCards) {
    const $reservedCard = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    $reservedCard.querySelector(".amount").textContent = reservedCard.prestigePoints;
    insertImageInto($reservedCard, `cards/empty/${TOKEN_MAPPER[reservedCard.bonus]}_empty_card`, false, `${TOKEN_MAPPER[reservedCard.bonus]} chip`);
    containerToInsertInto.appendChild($reservedCard);
  }
}

export {renderOtherPlayers};