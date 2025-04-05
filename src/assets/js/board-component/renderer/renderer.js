import { renderClientPlayer, renderHeader } from "./current-player-renderer.js";
import {renderHistory, renderOtherPlayers} from "./sidebar-renderer.js";
import { renderBoardTokens, renderCards, renderNobles } from "./board-renderer.js";
import { GEMS } from "../data.js";

function renderPage(gameData) {
    renderHeader(gameData["currentPlayer"]);
    renderCards(gameData["market"]);
    renderNobles(gameData["unclaimedNobles"]);
    // Functions relying on the response of gems are last in order to minimize disruptions
    const gems = GEMS;
    renderOtherPlayers(gameData["players"], gems);
    renderHistory();
    renderBoardTokens(gameData["unclaimedTokens"], gameData["players"].length);
    renderClientPlayer(gameData["players"], gems);
}

export { renderPage };