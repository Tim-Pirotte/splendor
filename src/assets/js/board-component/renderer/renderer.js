import { renderClientPlayer, renderHeader } from "./current-player-renderer.js";
import { renderOtherPlayers } from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { GEMS } from "../data.js";

function renderPage(gameData) {
    renderHeader(gameData["currentPlayer"], gameData["players"][0]["name"]);
    renderNobles(gameData["unclaimedNobles"]);
    renderOtherPlayers(gameData["players"], gameData["currentPlayer"]);
    renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length);
    renderClientPlayer(gameData["players"], GEMS);
    // Cards have to be rendered after the client player so that the player wallet exists
    renderCards(gameData["market"]);
}

export { renderPage };