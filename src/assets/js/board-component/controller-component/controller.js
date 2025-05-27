import {LEFT_TRIGGER, RIGHT_TRIGGER} from "./config.js";

function initController() {
    setCursor("none");

    window.addEventListener("gamepadconnected", () => {
        requestAnimationFrame(updateController);
        setCursor("block");
    });

    window.addEventListener("gamepaddisconnected", () => {
        setCursor("none");
    });
}

function setCursor(status) {
    document.querySelector("#cursor").style.display = status;
}

let leftTriggerPressedPreviously = false;
let rightTriggerPressedPreviously = false;

function updateController() {
    const gamepads = navigator.getGamepads();
    const gamePad = gamepads[0];

    if (!gamePad) return;

    handleButtonPress(gamePad);

    requestAnimationFrame(updateController);
}

function handleButtonPress(gamepad) {
    const rightTriggerPressed = gamepad.buttons[RIGHT_TRIGGER].pressed;
    const leftTriggerPressed = gamepad.buttons[LEFT_TRIGGER].pressed;

    if (rightTriggerPressed && !rightTriggerPressedPreviously) {
        document.querySelector(".action-button")?.click();
    }

    if (leftTriggerPressed && !leftTriggerPressedPreviously) {
        const $reserveButton = document.querySelector(".reserve-button");
        if (!$reserveButton.classList.contains("hidden")) $reserveButton?.click();
    }

    leftTriggerPressedPreviously = leftTriggerPressed;
    rightTriggerPressedPreviously = rightTriggerPressed;
}

export { initController };
