function validatePlayerName(playerName) {
    const playerNameRegex = /^[a-zA-Z0-9]{1,16}$/;
    return playerNameRegex.test(playerName) && playerName.length <= 16;  
}

export { validatePlayerName };