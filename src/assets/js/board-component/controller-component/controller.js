import {CURSOR_GAP, DEAD_ZONE, LEFT_TRIGGER, RIGHT_TRIGGER, SPEED} from "./config.js";

function initController() {
    setCursor("none");

    window.addEventListener("gamepadconnected", () => {
        requestAnimationFrame(() => updateController(getCursor()));
        setCursor("block");
    });

    window.addEventListener("gamepaddisconnected", () => {
        setCursor("none");
    });
}

function getCursor() {
    return document.querySelector("#cursor");
}

function setCursor(status) {
    document.querySelector("#cursor").style.display = status;
}

let leftTriggerPressedPreviously = false;
let rightTriggerPressedPreviously = false;

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

function updateController($cursor) {
    const gamepads = navigator.getGamepads();
    const gamePad = gamepads[0];

    if (!gamePad) return;

    handleButtonPress(gamePad);
    handleJoyStickMovement(gamePad, $cursor);

    requestAnimationFrame(() => updateController($cursor));
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

function handleJoyStickMovement(gamePad, $cursor) {
    const xAxis = gamePad.axes[0];
    const yAxis = gamePad.axes[1];

    const deltaX = Math.abs(xAxis) > DEAD_ZONE ? xAxis : 0;
    const deltaY = Math.abs(yAxis) > DEAD_ZONE ? yAxis : 0;

    posX += deltaX * SPEED;
    posY += deltaY * SPEED;

    const cursorSize = $cursor.getBoundingClientRect().width;

    posX = Math.max(0, Math.min(window.innerWidth - cursorSize - CURSOR_GAP, posX));
    posY = Math.max(0, Math.min(window.innerHeight - cursorSize - CURSOR_GAP, posY));

    $cursor.style.left = `${posX}px`;
    $cursor.style.top = `${posY}px`;
}

export { initController };
