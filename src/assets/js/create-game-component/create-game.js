import { navigateToMain, navigateToMainIfLocalStorageIsEmpty } from "../utils/navigation.js";
import { renderPlayerInformation } from "../utils/player-renderer.js";
import { handleCreateGameSubmit } from "./handler.js";

function createInit() {
    navigateToMainIfLocalStorageIsEmpty();
    renderPlayerInformation();

    document.querySelector("#back-button").addEventListener("click", navigateToMain);
    document.querySelector("form").addEventListener("submit", handleCreateGameSubmit);
}

createInit();
