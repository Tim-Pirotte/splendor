import {renderCurrentPlayer, renderHeader} from "./current-player-renderer.js";
import {renderOtherPlayers} from "./sidebar-renderer.js";
import {renderBoardTokens, renderCards, renderNobles} from "./board-renderer.js";

function renderPage(gameData) {
    renderHeader();
    renderOtherPlayers(gameData.players);
    renderCards(gameData.market);
    renderBoardTokens(gameData.unclaimedTokens, gameData.players.length);
    renderNobles(gameData.unclaimedNobles);
    renderCurrentPlayer(gameData.players);
}

export { renderPage };