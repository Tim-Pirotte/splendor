import {
    clearDatasetAttributes,
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
import { getReserveCardButton } from "./helper.js";
import { unHighlightTokens } from "../token/token-handler.js";

function selectCard(e) {
    const $card = getCard(e);

    if (!($card && isCurrentlyPlaying())) return;

    const cardName = $card.dataset.name;

    sessionStorage.removeItem("paymentMethod");
    hideSwitchPaymentButtons();

    if (cardAlreadySelected(cardName)) {
        deselectCard(true);
        return;
    }

    getReserveCardButton().classList.remove("hidden");

    highlightCard($card);
    setActionToBuyReserve($card);

    const isValidCardBuy = validCardBuy(cardName)
    if (isValidCardBuy) allowToBuy($card);

    getActionButton().disabled = !isValidCardBuy;
    getReserveCardButton().disabled = !validCardReserve($card);
}

function deselectCard(currentlyClickedIsCard = false) {
    unHighlightCards();
    getActionButton().disabled = false;
    getReserveCardButton().classList.add("hidden");

    clearDatasetAttributes(getReserveCardButton());
    if (currentlyClickedIsCard) {
        setActionButtonState("skip turn", "skipTurn", {}, true);
    }

}

export { selectCard, deselectCard };
