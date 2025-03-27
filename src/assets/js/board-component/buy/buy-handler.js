function selectCard(e) {
    if (e.target.closest(".card")) {
        console.log("clicked");
    }
}

export {selectCard};