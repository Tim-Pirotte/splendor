import { renderClientPlayer, renderHeader } from "./current-player-renderer.js";
import { renderHistory, renderOtherPlayers } from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { GEMS } from "../data.js";

function renderPage(gameData) {
    renderHeader(gameData["currentPlayer"], gameData["players"][0]["name"]);
    renderOtherPlayers(gameData["players"], gameData["currentPlayer"]);
    renderHistory(gameData["history"]);
    renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length);
    renderClientPlayer(gameData["players"], GEMS);
    // Has to be rendered after the client player so that the player wallet exists
    renderCards(gameData["market"]);
    renderNobles(gameData["unclaimedNobles"]);
}

export { renderPage };