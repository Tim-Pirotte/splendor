import { getRelativePathIndicators } from "./helper.js";

function setSoundButtonImgSource(soundStatus) {
    const isUserOnIndexPage = document.querySelector(".sound-button").dataset.index === "true";

    document.querySelector(".sound-button source")
        .setAttribute("srcset", `${getRelativePathIndicators(isUserOnIndexPage)}/assets/images/UI/sound_${soundStatus}.webp`);
    document.querySelector(".sound-button img")
        .setAttribute("src", `${getRelativePathIndicators(isUserOnIndexPage)}/assets/images/fallback/UI/sound_${soundStatus}.png`);
}

export { setSoundButtonImgSource };
