import { loadFromStorage } from "../data-connector/local-storage-abstractor.js";

function renderPlayerInformation() {
    const avatar = loadFromStorage("avatar");

    document.querySelector("#playerName").innerText = loadFromStorage("playerName");

    renderAvatar(document.querySelector("#avatar-template"),
                 document.querySelector("#playerInformation"),
                 avatar, "..");
}

function renderAvatar($template, $container, avatar, relativePath = ".") {
    const $picture = $template.content.firstElementChild.cloneNode(true);
    const $img = $picture.querySelector("img");

    $picture.querySelector("source").srcset = `${relativePath}/assets/images/avatars/${avatar}.webp`;
    $img.src = `${relativePath}/assets/images/fallback/avatars/${avatar}.png`;
    $img.alt = $img.title = avatar;

    $container.insertAdjacentHTML("beforeend", $picture.outerHTML);
}

export { renderPlayerInformation, renderAvatar };
