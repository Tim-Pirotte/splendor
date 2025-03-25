function insertImageInto($container, standardPath, before=false) {
  const $image = document.querySelector("#image-template").content.firstElementChild.cloneNode(true);

  $image.querySelector("source").srcset = "../assets/images/" + standardPath + ".webp";
  $image.querySelector("img").src = "../assets/images/fallback/" + standardPath + ".png";

  let position = "beforeend";
  if (before) {
    position = "afterbegin";
  }

  $container.insertAdjacentHTML(position, $image.outerHTML);
}

export { insertImageInto };