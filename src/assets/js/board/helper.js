import {CHIP_SPACING} from "./config.js";

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

function renderProgressBar($progressBar, value, color) {
  let background = "";

  for (let i = 0; i < value - 1; i++) {
    background += "url(\"../assets/images/UI/tokens/" + color + "_topdown_chip.webp\") " + i * CHIP_SPACING + "rem 100%,\n";
  }

  if (value > 0) {
    background += "url(\"../assets/images/UI/tokens/" + color + "_topdown_chip_end.webp\") " + (value - 1) * CHIP_SPACING + "rem 100%";
  }

  $progressBar.style.background = background;
  $progressBar.style.backgroundRepeat = "no-repeat";
  $progressBar.style.width = (value + 1) * CHIP_SPACING + "rem";
}

export { insertImageInto, renderProgressBar };