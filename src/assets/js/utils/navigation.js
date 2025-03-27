import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function redirectFromIndexToPageInPages(page, relativePathIndicators = ".") {
    location.href = `${relativePathIndicators}/pages/${page}.html`;
}

function navigateToMain() {
    location.href = "../index.html";
}

function navigateToMainIfNoPlayerName() {
    if (!loadFromStorage("playerName")) {
        navigateToMain();
    }
}

export { redirectFromIndexToPageInPages, navigateToMain, navigateToMainIfNoPlayerName };
