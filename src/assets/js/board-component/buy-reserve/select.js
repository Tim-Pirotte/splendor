import { hideSwitchPaymentButtons } from "../renderer/current-player-renderer.js";
import { validCardBuy, validCardReserve } from "../state-machine/valid-action-checker.js";
import { getReserveCardButton } from "./helper.js";
import {
    clearDatasetAttributes,
    deselectAll,
    getActionButton,
    isCurrentlyPlaying,
    setActionButtonState,
} from "../game-status-interface.js";
import {
    getCard,
    setActionToBuyReserve,
    unHighlightCards,
} from "./buy-handler.js";
import { loadFromStorage } from "../../data-connector/local-storage-abstractor.js";
import { GAME_STATE } from "../state-machine/data.js";

function selectCard(e) {
    const $card = getCard(e);

    if (!($card && isCurrentlyPlaying() && loadFromStorage("gameData")["gameState"] === GAME_STATE.TURN_ACTION)) return;

    const cardName = $card.dataset.name;

    sessionStorage.removeItem("paymentMethod");

    const previousSelectedCardName = getActionButton().dataset.name;
    deselectAll();

    if (cardName === previousSelectedCardName) return;

    setActionToBuyReserve($card, validCardBuy(cardName), validCardReserve($card));
}

function deselectCard(currentlyClickedIsCard = false) {
    hideSwitchPaymentButtons();

    unHighlightCards();

    getActionButton().disabled = false;
    getReserveCardButton().classList.add("hidden");

    clearDatasetAttributes(getReserveCardButton());

    if (currentlyClickedIsCard) {
        setActionButtonState("skip turn", "skipTurn", {}, true);
    }
}

export { selectCard, deselectCard };
