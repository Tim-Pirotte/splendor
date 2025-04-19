import {
    getCategoryNodes,
    renderCannotRestoreMessage,
    renderCardCollection,
    renderCorruptDataMessage
} from "./renderer.js";
import {hashToNumber} from "../board-component/card-collection-component/card-collection.js";
import {hashDigest} from "../utils/crypto.js";
import {CHANCE_CATEGORIES, CHANCES, ILLUSTRATIONS} from "./data.js";
import {getChanceCategory} from "../board-component/renderer/helper.js";
import {TOKEN_MAPPER} from "../board-component/config.js";
import {loadFromStorage, saveToStorage} from "../data-connector/local-storage-abstractor.js";
import {convertTreeToArray, removeFromTree} from "./helper.js";
import {GEMS} from "../board-component/data.js";

function init() {
    document.querySelector("main").addEventListener("click", handleCorruptButtonClick);

    try {
        renderCardCollection();
    } catch (err) {
        console.error(err);
        renderCorruptDataMessage();
    }
}

init();

function isValidCard(illustration, category, gameId, cardName, misprintType, cardBonus) {
    if (!isCorrectIllustration(illustration, gameId, cardName)) return false;
    if (!isCorrectCategory(category, gameId, cardName)) return false;
    if (misprintType) return isCorrectMisprint(misprintType, gameId, cardName, cardBonus);

    return true;
}

function isCorrectIllustration(illustration, gameId, cardName) {
    const illustrationSeed = hashToNumber(hashDigest(`${gameId}-${cardName}`), ILLUSTRATIONS.length);
    const validIllustration = ILLUSTRATIONS[illustrationSeed];

    return illustration === validIllustration;
}

function isCorrectCategory(category, gameId, cardName) {
    const illustrationModifierSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-modifier`));
    const validCategory = getChanceCategory(illustrationModifierSeed, CHANCES, CHANCE_CATEGORIES);

    return category === validCategory;
}


function isCorrectMisprint(misprintType, gameId, cardName, cardBonus) {
    const colorsToChooseFrom = Object.keys(TOKEN_MAPPER).filter(k => k !== cardBonus);
    const misprintSeed = hashToNumber(hashDigest(`${gameId}-${cardName}-misprint`), colorsToChooseFrom.length);
    const validMisprintType = colorsToChooseFrom[misprintSeed];

    return misprintType === validMisprintType;
}

function handleCorruptButtonClick(e) {
    if (e.target.tagName.toLowerCase() !== "button") return;

    e.target.disabled = true;

    if (e.target.dataset.action === "deleteData") {
        deleteData();
        location.reload();
    } else {
        tryRestoringData();
    }
}

function deleteData() {
    saveToStorage("cardCollection", {});
}

function tryRestoringData() {
    try {
        restoreData();
    } catch (err) {
        console.error(err);
        renderCannotRestoreMessage();
    }
}

function restoreData() {
    const seenTree = loadFromStorage("cardCollection") || {};

    const faultyBranches = getFaultyBranches(seenTree);

    console.log("NRESKBJDKBQSLKJQDKQDSK")
    removeFaultyBranches(faultyBranches, seenTree);

    console.log(seenTree);
    //localStorage.setItem("cardCollection", JSON.stringify(seenTree));

    // Loop through cards
    // If card is invalid
    // Let user know that data coudn't be restored
}

function getFaultyBranches(seenTree) {
    const faultyBranches = [];

    const cardCollection = [];
    convertTreeToArray(seenTree, ["bonusColor", "illustrationName", "variant"], cardCollection, {}, 4);

    for (const card of cardCollection) {
        if (isFaultyBranch(card)) {
            if (card["variant"] !== "MISPRINT") {
                faultyBranches.push([card["bonusColor"], card["illustrationName"], card["variant"]]);
            } else {
                for (const tokenType of GEMS) {
                    if (tokenType in card) {
                        faultyBranches.push([card["bonusColor"], card["illustrationName"], card["variant"], tokenType]);
                    }
                }
            }
        }
    }

    return faultyBranches;
}

function isFaultyBranch(card) {
    if (card["variant"] !== "MISPRINT") {
        if (!isValidCard(
            card["illustrationName"],
            card["variant"],
            card["gameId"],
            card["cardName"],
            null,
            card["bonusColor"]
        )) {
            return true;
        }
    } else {
        for (const tokenType of GEMS) {
            if (tokenType in card) {
                if (!isValidCard(
                    card["illustrationName"],
                    "MISPRINT",
                    card[tokenType]["gameId"],
                    card[tokenType]["cardName"],
                    tokenType,
                    card["bonusColor"]
                )) {
                    return true;
                }
            }
        }
    }

    return false;
}

function removeFaultyBranches(faultyBranches, seenTree) {
    for (const faultyBranch of faultyBranches) {
        console.log(faultyBranch)
        removeFromTree(seenTree, faultyBranch);
    }
}

function countCards(cardCollection) {
    const cardCounts = {total: 0};

    for (const card of cardCollection) {
        if (card["variant"] in cardCounts) {
            cardCounts[card["variant"]]++;
        } else {
            cardCounts[card["variant"]] = 1;
        }
    }

    for (const amount of Object.values(cardCounts)) {
        cardCounts["total"] += amount;
    }

    return cardCounts;
}

export { isValidCard, isCorrectIllustration, isCorrectCategory, isCorrectMisprint, countCards };
