import { renderPage } from "../renderer/renderer.js";
import { DUMMY_DATA } from "../../dummy-data.js"
import { checkCompatibility } from "../../server-version-component/server-version.js";

function spectateGame(gameId) {
    location.href = "./board.html"
    //renderPage(DUMMY_DATA);
    // checkCompatibility(2)
    //     .then(isCompatible => {
    //         if (!isCompatible) spectateNotAvailable();
    //     });
}

function spectateNotAvailable() {
    console.log("It is not implemented");
}


export { spectateGame }