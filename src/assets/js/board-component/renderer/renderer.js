import { renderClientPlayer, renderHeader } from "./current-player-renderer.js";
import { renderOtherPlayers } from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { GEMS } from "../data.js";

function renderPage(gameData) {
    renderHeader(gameData["currentPlayer"]);
    renderCards(gameData["market"]);
    renderNobles(gameData["unclaimedNobles"]);
    renderOtherPlayers(gameData["players"], GEMS);
    renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length);
    renderClientPlayer(gameData["players"], GEMS);
}

export { renderPage };