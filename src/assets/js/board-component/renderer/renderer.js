import {
    renderAmountOfSpectators,
    renderClientPlayer,
    renderGameStatusMessage,
    renderPlayerProfile,
} from "./current-player-renderer.js";
import { renderHistory, renderOtherPlayers } from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { GEMS } from "../data.js";
import { checkCompatibility } from "../../server-version-component/server-version.js";

function renderPage(gameData) {
    checkCompatibility(2)
        .then(compatible => {
            if (compatible) {
                renderAmountOfSpectators(gameData["spectators"]);
            }

            renderPlayerProfile(gameData["players"][0]["name"], gameData["spectators"]);
            renderGameStatusMessage(gameData["currentPlayer"]);
            renderOtherPlayers(gameData["players"], gameData["currentPlayer"]);
            renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length);
            renderClientPlayer(gameData["players"], GEMS);
            renderHistory(gameData["history"]);
            // Has to be rendered after the client player so that the player wallet exists
            renderCards(gameData["market"]);
            renderNobles(gameData["unclaimedNobles"]);
        })
}

export { renderPage };