import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";
import {updateTokens} from "./token-handler.js";

function takeTwoGemsRequest(tokenType) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("playerName");

    const body = {"take": {}};
    body["take"][tokenType] = 2;

    fetchFromServer(`/games/${gameId}/players/${playerName}/tokens`, "PATCH", body)
        .then(res => updateTokens(res));
}

export {takeTwoGemsRequest};