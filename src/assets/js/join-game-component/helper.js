import { getCurrentUsersAmount, getMaxUsersAmount, getGameState } from "../general-logic/object-handler.js";

function getAmountText(game) {
    return `${getCurrentUsersAmount(game)}/${getMaxUsersAmount(game)}`;
}

function getGameButtonText(game) {
    return getGameState(game) === "join" ? "Join game" : "Spectate game";
}

function intersection(setA, setB) {
    const result = new Set();

    for (const item of setA) {
        if (setB.has(item)) {
            result.add(item);
        }
    }

    return result;
}

export { getAmountText, getGameButtonText, intersection };
