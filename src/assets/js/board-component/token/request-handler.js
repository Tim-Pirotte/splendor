import * as API from "../../api.js";
import { updateTokens } from "./token-handler.js";

function takeGemsRequest(tokenTypes , action) {
    const requestBody = { "take": {} };

    if (action === "takeTwo") {
        requestBody["take"][tokenTypes] = 2;
    }else{
        for (const token of tokenTypes){
            if (token !== undefined && token !== ""){
                requestBody["take"][token] = 1;
            }
        }
    }

    API.takeTokens(requestBody)
        .then(res => updateTokens(res));
}

export { takeGemsRequest };
