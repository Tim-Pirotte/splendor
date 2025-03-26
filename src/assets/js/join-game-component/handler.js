function playerJoinGame(e) {
    e.preventDefault()

    console.log(e.target.closest("li"));
}

export {playerJoinGame};
