import { renderErrorMessage } from "../utils/renderer.js";

function validatePlayerName(playerName) {
    const playerNameRegex = /^[a-zA-Z0-9]{1,16}$/;
    return playerNameRegex.test(playerName) && playerName.length <= 16;
}

function isValidPlayerName(playerName) {
    const isValid = document.querySelector("form").reportValidity() && validatePlayerName(playerName);

    if (isValid) return true;

    if (playerName === "") {
        renderErrorMessage("Please enter a username");
    } else {
        renderErrorMessage("Invalid playername: (no spaces or special characters).");
    }
}

export { isValidPlayerName };