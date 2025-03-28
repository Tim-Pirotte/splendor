import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {updateTokens} from "./token-handler.js";

function takeGemsRequest(tokenTypes , action) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");
    const body = {"take": {}};

    if (action === "takeTwo") {
        body["take"][tokenTypes] = 2;
    }else{
        for (const token of tokenTypes){
            if (token !== undefined && token !== ""){
                body["take"][token] = 1;
            }
        }
    }

    fetchFromServer(`/games/${gameId}/players/${playerName}/tokens`, "PATCH", body)
        .then(res => updateTokens(res));

}


export {takeGemsRequest};