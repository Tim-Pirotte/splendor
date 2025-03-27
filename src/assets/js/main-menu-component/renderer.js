import { renderAvatar } from "../utils/player-renderer.js";
import { avatars } from "./data.js";

function renderSelectableAvatars() {
    const $template = document.querySelector("#avatar-template");
    const $container = document.querySelector("section");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => renderAvatar($template, $container, avatar));
}

function renderSelectedAvatars(avatar) {
    const $template = document.querySelector("#avatar-template");
    const $button = document.querySelector(".avatar-selector button");

    $button.innerHTML= "";
    renderAvatar($template, $button, avatar);
}

export { renderSelectableAvatars, renderSelectedAvatars };
