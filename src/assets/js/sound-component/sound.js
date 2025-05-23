import { EFFECTS_BASE_PATH } from "./config.js";
import {
    loadFromStorage,
    loadFromStorageWithDefault,
    saveToStorage,
} from "../data-connector/local-storage-abstractor.js";
import { setSoundButtonImgSource } from "./renderer.js";

const sounds = {};
const background = document.querySelector("audio[autoplay]");
const soundButton = document.querySelector(".sound-button");

function soundInit() {
    canAutoplay()
        .then((allowed) => {
            let soundEnabled = loadFromStorageWithDefault("sound", false);

            if (allowed && soundEnabled) {
                playBackground();
            } else {
                soundEnabled = false;
            }

            saveToStorage(soundEnabled);
            setSoundButtonImgSource(soundEnabled);

            soundButton.addEventListener("click", () => {
                toggleSound();
                playEffect("button-press", false);
            });
        });
}

function canAutoplay() { // check if unmuted audio can be autoplayed
    const audio = new Audio();
    audio.muted = false;

    return audio.play()
        .then(() => true)
        .catch((e) => false);
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
    if (background !== null) {
        background.volume = 0.20;
        background.muted = false;
        background.play();
    }
}

function pauseBackground() {
    if (background !== null) {
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

function playEffect(name, loop) {
    const soundEnabled = loadFromStorage("sound");
    let effect = sounds[name];

    if (effect === undefined) {
        effect = new Audio(`${EFFECTS_BASE_PATH}${name}.mp3`);
        effect.loop = loop;
        sounds[name] = effect;
    }

    if (!effect.loop) effect.currentTime = 0;
    effect.muted = !soundEnabled;
    effect.play();

    return effect;
}

function playTimer() {
    const effect = playEffect("timer", true);
    effect.volume = 0.1;
}

function stopTimer() {
    if ("timer" in sounds) {
        const timer = sounds["timer"];
        timer.pause();
        timer.currentTime = 0;
    }
}

function playClick() {
    playEffect("button-press", false);
}

export { soundInit, playEffect, playTimer, stopTimer, playClick };
