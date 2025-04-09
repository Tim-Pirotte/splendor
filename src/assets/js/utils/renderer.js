import { copyNode } from "./data-handler.js";

function insertImageInto($container, standardPath, insertAtStart, alt, prefix = "..") {
    const $image = copyNode(document.querySelector("#image-template"));
    setImageData($image, standardPath, alt, prefix);

    $container.insertAdjacentHTML(insertAtStart ? "afterbegin" : "beforeend", $image.outerHTML);
}

function setImageData($image, standardPath, alt, prefix) {
    $image.querySelector("source").srcset = `${prefix}/assets/images/${standardPath}.webp`;

    const $img = $image.querySelector("img");

    $img.src = `${prefix}/assets/images/fallback/${standardPath}.png`;
    $img.alt = $img.title = alt;
}

export { insertImageInto };
