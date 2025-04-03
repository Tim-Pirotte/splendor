import { addImageToContainer } from "../utils/renderer.js";
import { avatars } from "../old-main-menu-component/data.js";

function renderAvatarSelectionList() {
    const avatarsSection = document.querySelector("section ul");

    document.querySelectorAll("li").forEach(li => li.remove());
    avatars.forEach(avatar => addImageToContainer(avatarsSection, avatar, ".", false, avatar));
}

export { renderAvatarSelectionList };
