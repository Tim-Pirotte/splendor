import {getActionButton} from "../game-status-interface.js";
import {hideSwitchPaymentButtons} from "../renderer/current-player-renderer.js";
import {validCardBuy, validCardReserve} from "../state-machine/valid-action-checker.js";
import {unHighlightTokens} from "../token/token-handler.js";
import {
    allowToBuy,
    cardAlreadySelected,
    getCard,
    highlightCard,
    setActionToBuyReserve,
    unHighlightCards
} from "./buy-handler.js";
import {allowToReserve} from "./reserve-handler.js";
import {getReserveCardButton} from "./helper.js";

function selectCard(e) {
    const $card = getCard(e);

    if (!$card) return;

    const cardName = $card.dataset.name;

    hideSwitchPaymentButtons();
    sessionStorage.removeItem("paymentMethod");

    if (cardAlreadySelected(cardName)) {
        deselectCard();
        return;
    }

    const isValidCardBuy = validCardBuy(cardName);
    const isValidCardReserve = validCardReserve();

    if (isValidCardBuy || isValidCardReserve) {
        unHighlightTokens();
        highlightCard($card);
        setActionToBuyReserve($card);
    }

    if (isValidCardBuy) allowToBuy($card);

    getActionButton().disabled = !isValidCardBuy;

    if (isValidCardReserve) allowToReserve();
}

function deselectCard() {
    unHighlightCards();

    getActionButton().dataset.name = "";
    getActionButton().disabled = false;

    getReserveCardButton().dataset.name = "";
    getReserveCardButton().classList.add("hidden");
    getReserveCardButton().disabled = true;
}

export { selectCard, deselectCard };
