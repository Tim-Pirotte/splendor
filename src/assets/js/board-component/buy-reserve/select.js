import {getActionButton, setActionButtonState} from "../game-status-interface.js";
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
    getReserveCardButton().classList.remove("hidden");

    if (cardAlreadySelected(cardName)) {
        deselectCard();
        return;
    }

    unHighlightTokens();
    highlightCard($card);
    setActionToBuyReserve($card);

    const isValidCardBuy = validCardBuy(cardName);
    const isValidCardReserve = validCardReserve($card);

    if (isValidCardBuy) allowToBuy($card);
    if (isValidCardReserve) allowToReserve();

    getActionButton().disabled = !isValidCardBuy;
    getReserveCardButton().disabled = !isValidCardReserve;
}

function deselectCard() {
    unHighlightCards();

    getActionButton().disabled = false;
    setActionButtonState("skip turn", "skipTurn", {}, true);

    getReserveCardButton().removeAttribute("data-name");
    getReserveCardButton().classList.add("hidden");
}

export { selectCard, deselectCard };
