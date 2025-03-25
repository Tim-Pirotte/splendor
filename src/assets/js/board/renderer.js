import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";
import {tokensDummyData} from "./dummy-data.js";

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
    $playerCard.querySelector(".points").textContent = otherPlayer.totalPrestigePoints;

    renderTokenList($playerCard.querySelector(".tokens"), otherPlayer.tokens);

    $otherPlayerContainer.appendChild($playerCard);
  }
}

function renderTokenList(containerToInsertInto, tokenAmounts) {
  const $numberedItemTemplate = document.querySelector("#numbered-item-template");
  const $imageTemplate = document.querySelector("#image-template");

  for (const token of tokensDummyData.gems) {
    const $token = $numberedItemTemplate.content.firstElementChild.cloneNode(true);
    const $image = $imageTemplate.content.firstElementChild.cloneNode(true);
    $token.querySelector(".amount").textContent = tokenAmounts[token] || 0;
    $image.querySelector("source").srcset = "../assets/images/UI/tokens/" + mapTokens[token] + "_chip.webp"
    $image.querySelector("img").src = "../assets/images/fallback/UI/tokens/black_chip.png"
    $token.insertAdjacentHTML("beforeend", $image.outerHTML);
    containerToInsertInto.appendChild($token);
  }
}

export { renderPage };