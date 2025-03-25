import {loadFromStorage} from "../data-connector/local-storage-abstractor.js";

function renderPage() {
  renderClientUser();
}

function renderClientUser() {
  document.querySelector(".top-bar h2").textContent = loadFromStorage("username")
}

export { renderPage };