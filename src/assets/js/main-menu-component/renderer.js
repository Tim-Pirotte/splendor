import {avatars} from "./data.js";

function renderSelectableAvatars() {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector("section");

    document.querySelectorAll("li")
            .forEach(li => li.remove());

    avatars.forEach(avatar => renderAvatar($template, $container, avatar));
}

function renderSelectedAvatars(avatar) {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector(".avatar-selector button");

    $container.innerHTML= "";

    renderAvatar($template, $container, avatar);
}

function renderAvatar($template, $container, avatar) {
    const $picture = $template.content.firstElementChild.cloneNode(true);
    const $img = $picture.querySelector("img");

    $picture.querySelector("source").srcset = `./assets/images/avatars/${avatar}.webp`;
    $img.src = `./assets/images/fallback/avatars/${avatar}.png`;
    $img.alt = $img.title = avatar;

    $container.insertAdjacentHTML("beforeend", $picture.outerHTML);
}

export {renderSelectableAvatars, renderSelectedAvatars};
