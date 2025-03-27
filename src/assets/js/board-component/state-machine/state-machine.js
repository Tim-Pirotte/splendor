import { setActionButtonState } from "../game-status-interface.js";

function initRoundBegin(gameIsDone){

    if(gameIsDone){
        // Go the the victory screen
        location.href = `./results.html`;
    }else {
        // Set the init state of the button -> TODO: @tim write the skipTurn function
        setActionButtonState("skip turn", "skipTurn", {});
    }
    
}