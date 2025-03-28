import { selectCardForReserve } from "./reserve-handler.js";

function reserveInit() {
    document.querySelector(".decks").addEventListener("click", selectCardForReserve);
}


export { reserveInit };