import { avatars } from "./data.js";

function renderSelectableAvatars() {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector("section");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => renderAvatar($template, $container, avatar));
}

function renderSelectedAvatars(avatar) {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector(".avatar-selector button");

    $container.innerHTML= "";
    renderAvatar($template, $container, avatar);
}

export { renderSelectableAvatars, renderSelectedAvatars };
