import { procesReserve, selectCardForReserve } from "./reserve-handler.js";

function reserveInit() {
    document.querySelector(".decks").addEventListener("click", selectCardForReserve);
    document.querySelector(".reserve-button").addEventListener("click", procesReserve);
}


export { reserveInit };