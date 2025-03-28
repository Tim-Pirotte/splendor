import * as API from "../../api.js";
import { updateTokens } from "./token-handler.js";

function takeTwoGemsRequest(tokenType) {
    const requestBody = {"take": {}};
    requestBody["take"][tokenType] = 2;

    API.takeTokens(requestBody)
        .then(res => updateTokens(res));
}

export { takeTwoGemsRequest };
