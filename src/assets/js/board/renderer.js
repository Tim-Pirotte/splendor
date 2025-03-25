import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

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

    $otherPlayerContainer.appendChild($playerCard);
  }
}

export { renderPage };