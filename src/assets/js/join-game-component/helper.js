import { getCurrentUsersAmount, getMaxUsersAmount, getGameState } from "./object-handler.js";

function getAmountText(game){
    return `${getCurrentUsersAmount(game)}/${getMaxUsersAmount(game)}`;
};

function getGameButtonText(game){
    return getGameState(game) === "join" ? "Join game" : "Spectate game";
};

export { getAmountText, getGameButtonText };