import {avatars} from "./data.js";

function renderSelectableAvatars() {
    const $avatars = document.querySelector("section");
    const $template = document.querySelector("#avatar-template")

    $avatars.innerHTML = "";
    for (const avatar of avatars) {
        const $picture = $template.content.firstElementChild.cloneNode(true);
        $picture.querySelector("source").setAttribute("srcset", `./assets/images/avatars/${avatar}.webp`);
        $avatars.insertAdjacentHTML("beforeend", $picture.outerHTML);
    }
}

export {renderSelectableAvatars};
