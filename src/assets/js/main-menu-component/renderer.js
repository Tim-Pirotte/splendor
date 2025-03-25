import {avatars} from "./data.js";

function renderSelectableAvatars() {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector("section");

    document.querySelectorAll("li")
            .forEach(li => li.outerHTML = "");

    for (const avatar of avatars) {
        renderAvatar($template, $container, avatar);
    }
}

function renderSelectedAvatars(avatar) {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector(".avatar-selector button");

    $container.innerHTML= "";

    renderAvatar($template, $container, avatar);
}

function renderAvatar($template, $container, avatar) {
    const $picture = $template.content.firstElementChild.cloneNode(true);
    $picture.querySelector("source").setAttribute("srcset", `./assets/images/avatars/${avatar}.webp`);
    $picture.querySelector("img").setAttribute("src", `./assets/images/fallback/avatars/${avatar}.png`);
    $picture.querySelector("img").setAttribute("alt", `${avatar}`);
    $picture.querySelector("img").setAttribute("title", `${avatar}`);
    $container.insertAdjacentHTML("beforeend", $picture.outerHTML);
}

export {renderSelectableAvatars, renderSelectedAvatars};
