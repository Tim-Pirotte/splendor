function selectCard(e) {
    if (isCard(e)) {
        console.log("clicked");
    }
}

function isCard(e) {
    return e.target.closest(".card")
}
export {selectCard};