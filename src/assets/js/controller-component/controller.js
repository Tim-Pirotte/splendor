import {A_BUTTON, CURSOR_GAP, DEAD_ZONE, LEFT_TRIGGER, RIGHT_TRIGGER, SPEED} from "./config.js";

function initController() {
    setCursor("none");

    window.addEventListener("gamepadconnected", () => {
        requestAnimationFrame(() => updateController(getCursor()));
        setCursor("block");
    });

    window.addEventListener("gamepaddisconnected", () => {
        setCursor("none");
    });

    window.addEventListener("beforeunload", () => {
        const gamePad = navigator.getGamepads()[0];
        if (gamePad) stopVibration(gamePad);
    });
}

function stopVibration(gamePad) {
    playHapticEffect(gamePad, 0, 0);
}

function getCursor() {
    return document.querySelector("#cursor");
}

function setCursor(status) {
    document.querySelector("#cursor").style.display = status;
}

let leftTriggerPressedPreviously = false;
let rightTriggerPressedPreviously = false;
let aButtonPressedPreviously = false;

let posX = window.innerWidth / 2;
let posY = window.innerHeight / 2;

function updateController($cursor) {
    const gamepads = navigator.getGamepads();
    const gamePad = gamepads[0];

    if (!gamePad) return;

    handleButtonPress(gamePad, $cursor);
    handleJoyStickMovement(gamePad, $cursor);

    requestAnimationFrame(() => updateController($cursor));
}

function handleButtonPress(gamePad, $cursor) {
    const rightTriggerPressed = gamePad.buttons[RIGHT_TRIGGER].pressed;
    const leftTriggerPressed = gamePad.buttons[LEFT_TRIGGER].pressed;

    if (rightTriggerPressed && !rightTriggerPressedPreviously) {
        const $actionButton = document.querySelector(".action-button");

        if ($actionButton && !$actionButton.disabled) {
            $actionButton.click();
            playHapticEffect(gamePad, 0.9, 150);
        }
    }

    if (leftTriggerPressed && !leftTriggerPressedPreviously) {
        const $reserveButton = document.querySelector(".reserve-button");

        if ($reserveButton && !$reserveButton.classList.contains("hidden")) {
            $reserveButton.click();
            playHapticEffect(gamePad, 0.9, 150);
        }
    }

    leftTriggerPressedPreviously = leftTriggerPressed;
    rightTriggerPressedPreviously = rightTriggerPressed;
}

function handleJoyStickMovement(gamePad, $cursor) {
    const aButtonPressed = gamePad.buttons[A_BUTTON].pressed;

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

    if (aButtonPressed && !aButtonPressedPreviously) {
        const target = document.elementFromPoint(posX + cursorSize / 2, posY + cursorSize / 2);
        target?.click();

        playHapticEffect(gamePad, 0.4, 100);
    }

    aButtonPressedPreviously = aButtonPressed;
}

function playHapticEffect(gamePad, strength, duration) {
    const actuator = gamePad.vibrationActuator;

    if (actuator && actuator.type === "dual-rumble") {
        actuator.playEffect("dual-rumble", {
            duration: duration,
            strongMagnitude: strength,
            weakMagnitude: strength,
        });
    }
}

export { initController };
