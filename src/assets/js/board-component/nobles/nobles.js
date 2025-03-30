import { selectNoble } from "./nobles-handler.js";

function noblesInit() {
    document.querySelector(".nobles").addEventListener("click", selectNoble);
}

export { noblesInit };