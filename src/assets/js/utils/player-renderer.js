import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";
import { copyNode } from "./data-handler.js";

function renderPlayerInformation() {
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").textContent = loadFromStorage("playerName");

    renderAvatar(document.querySelector("#avatar-template"),
        document.querySelector("#playerInformation"),
        avatar, "..");
}

function renderAvatar($template, $container, avatar, relativePath = ".") {
    const $picture = copyNode($template);
    const $img = $picture.querySelector("img");

    $picture.querySelector("source").srcset = `${relativePath}/assets/images/avatars/${avatar}.webp`;
    $img.src = `${relativePath}/assets/images/fallback/avatars/${avatar}.png`;
    $img.alt = $img.title = avatar;

    $container.insertAdjacentHTML("beforeend", $picture.outerHTML);
}

export { renderPlayerInformation, renderAvatar };
