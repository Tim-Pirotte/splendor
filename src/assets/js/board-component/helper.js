function setActionButton(message, tokenType, action) {
    const $actionButton = document.querySelector(".action-button");
    $actionButton.textContent = message;
    $actionButton.dataset.type = tokenType;
    $actionButton.dataset.action = action;
}

export {setActionButton};