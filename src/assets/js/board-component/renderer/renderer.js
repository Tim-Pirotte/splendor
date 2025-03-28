import { renderCurrentPlayer, renderHeader } from "./current-player-renderer.js";
import { renderOtherPlayers } from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { waitOnTokenData } from "../game-data-handler.js";

function renderPage(gameData) {
    renderHeader();
    renderCards(gameData["market"]);
    renderNobles(gameData["unclaimedNobles"]);
    // Functions relying on the response of gems are last in order to minimize disruptions
    const gems = waitOnTokenData();
    renderOtherPlayers(gameData["players"], gems);
    renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length, gems);
    renderCurrentPlayer(gameData["players"], gems);
}

export { renderPage };
