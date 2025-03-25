import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {tokensDummyData} from "./dummy-data.js";
import {insertImageInto} from "./helper.js";

const mapTokens = {
  "Emerald": "green",
  "Sapphire": "blue",
  "Ruby": "red",
  "Diamond": "white",
  "Onyx": "black",
  "Gold": "gold",
}

function renderPage(gameData) {
  renderClientUser();
  renderOtherPlayers(gameData.players);
}

function renderClientUser() {
  document.querySelector(".top-bar h2").textContent = loadFromStorage("username")
}

function renderOtherPlayers(otherPlayers) {
  const $otherPlayerContainer = document.querySelector(".other-players");
  const $template = document.querySelector("#other-player-card-template");

  for (const otherPlayer of otherPlayers) {
    const $playerCard = $template.content.firstElementChild.cloneNode(true);
    $playerCard.querySelector(".name").textContent = otherPlayer.name;
    $playerCard.querySelector(".points").textContent = otherPlayer.totalPrestigePoints + " pts.";

    renderTokenList($playerCard.querySelector(".tokens"), otherPlayer.tokens);
    renderCardList($playerCard.querySelector(".cards"), otherPlayer.bonuses);
    renderReservedList($playerCard.querySelector(".reserved"), otherPlayer.reserve);

    $otherPlayerContainer.appendChild($playerCard);
  }
}

function renderTokenList(containerToInsertInto, tokenAmounts) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const token of tokensDummyData.gems) {
    const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    $token.querySelector(".amount").textContent = tokenAmounts[token] || 0;
    insertImageInto($token, "UI/tokens/" + mapTokens[token] + "_chip");
    containerToInsertInto.appendChild($token);
  }
}

function renderCardList(containerToInsertInto, cardAmounts) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const cardType of tokensDummyData.gems) {
    if (cardType !== "Gold") {
      const $card = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
      $card.querySelector(".amount").textContent = cardAmounts[cardType] || 0;
      insertImageInto($card, "UI/cards/" + mapTokens[cardType] + "_card_small");
      containerToInsertInto.appendChild($card);
    }
  }
}

function renderReservedList(containerToInsertInto, reservedCards) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");

  for (const reservedCard of reservedCards) {
    const $reservedCard = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    $reservedCard.querySelector(".amount").textContent = reservedCard.prestigePoints;
    insertImageInto($reservedCard, "cards/empty/" + mapTokens[reservedCard.bonus] + "_empty_card");
    containerToInsertInto.appendChild($reservedCard);
  }
}

export { renderPage };