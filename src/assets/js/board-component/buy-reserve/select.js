import {
    getActionButton,
    isCurrentlyPlaying,
    setActionButtonState,
} from "../game-status-interface.js";
import { hideSwitchPaymentButtons } from "../renderer/current-player-renderer.js";
import { validCardBuy, validCardReserve } from "../state-machine/valid-action-checker.js";
import {
    allowToBuy,
    cardAlreadySelected,
    getCard,
    highlightCard,
    setActionToBuyReserve,
    unHighlightCards,
} from "./buy-handler.js";
import { allowToReserve } from "./reserve-handler.js";
import { getReserveCardButton } from "./helper.js";
import { unHighlightTokens } from "../token/token-handler.js";

function selectCard(e) {
    const $card = getCard(e);

    if (!($card && isCurrentlyPlaying())) return;

    const cardName = $card.dataset.name;

    sessionStorage.removeItem("paymentMethod");
    hideSwitchPaymentButtons();
    getReserveCardButton().classList.remove("hidden");

    if (cardAlreadySelected(cardName)) {
        deselectCard(true);
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

function deselectCard(previousSelectedWasCard = false) {
    unHighlightCards();
    getActionButton().disabled = false;
    getReserveCardButton().classList.add("hidden");

    getReserveCardButton().removeAttribute("data-level");
    if (previousSelectedWasCard) {
        setActionButtonState("skip turn", "skipTurn", {}, true);

    }

}

export { selectCard, deselectCard };
