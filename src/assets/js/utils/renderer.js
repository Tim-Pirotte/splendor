import { copyNode } from "./data-handler.js";

function addImageToContainer($targetContainer, imageName, insertAtStart, alt, relatievePathIndicator = "..") {
    const position = insertAtStart ? "afterbegin" : "beforeend";
    const $template = copyNode(document.querySelector("#image-template"));
    const $source = $template.querySelector("source");
    const $img = $template.querySelector("img");

    $source.srcset = `${relatievePathIndicator}/assets/images/${imageName}.webp`;
    $img.src = `${relatievePathIndicator}/assets/images/fallback/${imageName}.png`;
    $img.alt = $img.title = alt;

    $targetContainer.insertAdjacentHTML(position, $template.outerHTML);
}

export { addImageToContainer };
