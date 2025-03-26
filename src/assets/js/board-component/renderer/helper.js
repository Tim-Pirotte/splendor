import {CHIP_SPACING} from "../config.js";

function insertImageInto($container, standardPath, before=false, alt="TODO") {
  const $image = document.querySelector("#image-template").content.firstElementChild.cloneNode(true);

  $image.querySelector("source").srcset = "../assets/images/" + standardPath + ".webp";
  const $img = $image.querySelector("img");
  $img.src = "../assets/images/fallback/" + standardPath + ".png";
  $img.alt = $img.title = alt;

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

function formatNumber(number) {
  return number.toString().padStart(2, '0');
}

export { insertImageInto, renderProgressBar, formatNumber};