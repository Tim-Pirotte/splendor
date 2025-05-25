import { AUDIO_BASE_PATH, EFFECTS_BASE_PATH } from "./config.js";
import {
    loadFromStorage,
    loadFromStorageWithDefault,
    saveToStorage,
} from "../data-connector/local-storage-abstractor.js";
import { setSoundButtonImgSource } from "./renderer.js";
import { renderErrorMessage } from "../utils/renderer.js";

const sounds = {};
const background = document.querySelector("audio[autoplay]");
const soundButton = document.querySelector(".sound-button");

function init() {
    canAutoplay()
        .then(allowed => {
            const soundEnabled = loadFromStorageWithDefault("sound", false);

            if (soundEnabled) {
                playBackground();

                if (!allowed) {
                    renderErrorMessage("Please enable Autoplay in the browser");
                }
            }

            saveToStorage("sound", soundEnabled);
            setSoundButtonImgSource(soundEnabled);

            soundButton.addEventListener("click", () => {
                toggleSound();
                effects.playClick();
            });
        });
}

function canAutoplay() { // check if unmuted audio can be autoplayed
    const audio = new Audio(`${AUDIO_BASE_PATH}/silent.webm`); // short silent audio file to test autoplay
    audio.muted = true;

    return audio.play()
        .then(() => true)
        .catch(() => false);
}

function unMuteEffects() {
    Object.values(sounds)
        .forEach(effect => effect.muted = false);
}

function muteEffects() {
    Object.values(sounds)
        .forEach(effect => effect.muted = true);
}

function playBackground() {
    if (background) {
        background.volume = 0.05;
        background.muted = false;
        background.play().catch(() => {
        });
    }
}

function pauseBackground() {
    if (background) {
        background.pause();
    }
}

function toggleSound() {
    const soundEnabled = !loadFromStorageWithDefault("sound", false);

    if (soundEnabled) {
        playBackground();
        unMuteEffects();
    } else {
        pauseBackground();
        muteEffects();
    }

    saveToStorage("sound", soundEnabled);
    setSoundButtonImgSource(soundEnabled);
}

function playEffect(name, loop, volume) {
    const soundEnabled = loadFromStorage("sound");
    let effect = sounds[name];

    if (effect === undefined) {
        effect = new Audio(`${EFFECTS_BASE_PATH}/${name}.mp3`);
        effect.loop = loop;
        effect.volume = volume;
        sounds[name] = effect;
    }

    if (!effect.loop) effect.currentTime = 0;
    effect.muted = !soundEnabled;
    effect.play().catch(() => {
    });

    return effect;
}

const effects = {
    playTimer() {
        playEffect("timer", true, 0.1);
    },

    stopTimer() {
        if ("timer" in sounds) {
            const timer = sounds["timer"];
            timer.pause();
            timer.currentTime = 0;
        }
    },

    playClick() {
        playEffect("button-press", false, 1.0);
    },

    playWin() {
        playEffect("win", false, 1.0);
    },

    playLevelUp() {
        playEffect("level-up", false, 0.5);
    },

    playWoosh() {
        playEffect("woosh", false, 1.0);
    },

    playFlip() {
        playEffect("flip", false, 1.0);
    },

    playLose(){
        playEffect("lose", false, 1.0);
    },

    playCountDown() {
        playEffect("count-down", false, 0.5);
    },
};

init();

export { effects };
