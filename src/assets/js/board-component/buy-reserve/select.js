import { getActionButton, isCurrentlyPlaying, setActionButtonState } from "../game-status-interface.js";
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

function selectCard(e) {
    const $card = getCard(e);

    if (!($card && isCurrentlyPlaying())) return;

    const cardName = $card.dataset.name;

    hideSwitchPaymentButtons();
    sessionStorage.removeItem("paymentMethod");
    getReserveCardButton().classList.remove("hidden");
    deselectCard();

    if (cardAlreadySelected(cardName)) {
        //This can not be inside the deselectCard to prevent issues with taking tokens
        setActionButtonState("skip turn", "skipTurn", {}, true);
        return;
    }

    deselectCard();
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
    getReserveCardButton().removeAttribute("data-level");
    getReserveCardButton().removeAttribute("data-name");
    getReserveCardButton().classList.add("hidden");
}

export { selectCard, deselectCard };
