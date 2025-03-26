import {loadFromStorage} from "../../data-connector/local-storage-abstractor.js";
import {fetchFromServer} from "../../data-connector/api-communication-abstractor.js";

function takeTwoGemsRequest(tokenType) {
    const gameId = loadFromStorage("gameId");
    const playerName = loadFromStorage("username");

    const body = {"take": {}};
    body["take"][tokenType] = 2;

    fetchFromServer(`/games/${gameId}/players/${playerName}/tokens`, "PATCH", body)
        .then(res => console.log(res));
}

export {takeTwoGemsRequest};