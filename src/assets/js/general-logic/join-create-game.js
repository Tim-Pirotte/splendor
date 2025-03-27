import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";

function processResponse(res) {
    saveToStorage("gameId", res["gameId"]);
    saveToStorage("playerToken", res["playerToken"]);
    location.href = "./lobby-page.html";
}

function navigateToMain(e) {
    location.href = "../index.html";
}

function renderPlayerInformation() {
    document.querySelector("#playerName").innerText = loadFromStorage("playerName");

    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector("#playerInformation");
    const avatar = loadFromStorage("avatar");

    renderAvatar($template, $container, avatar, "..");
}

function renderAvatar($template, $container, avatar, relativePathIndicators = ".") {
    const $picture = $template.content.firstElementChild.cloneNode(true);
    const $img = $picture.querySelector("img");

    $picture.querySelector("source").srcset = `${relativePathIndicators}/assets/images/avatars/${avatar}.webp`;
    $img.src = `${relativePathIndicators}/assets/images/fallback/avatars/${avatar}.png`;
    $img.alt = $img.title = avatar;

    $container.insertAdjacentHTML("beforeend", $picture.outerHTML);
}

export {processResponse, navigateToMain, renderPlayerInformation, renderAvatar};
