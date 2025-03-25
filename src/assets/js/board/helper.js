function insertImageInto($container, standardPath) {
  const $image = document.querySelector("#image-template").content.firstElementChild.cloneNode(true);

  $image.querySelector("source").srcset = "../assets/images/" + standardPath + ".webp";
  $image.querySelector("img").src = "../assets/images/fallback/" + standardPath + ".png";

  $container.insertAdjacentHTML("beforeend", $image.outerHTML);
}

export { insertImageInto };