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

            /*
            Only enable sound if user enabled it and autoplay is allowed
            It would be technically possible to play audio when a user clicks a button
            while autoplay is disabled by the browser, but this behaviour is turned off.
            This is because it wouldn't be possible to play for example the timer sound in this
            situation. And this would lead to some effects being muted and others not.
             */
            if (allowed && soundEnabled) {
                playBackground();
            } else {
                soundEnabled = false;
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
    if (background) {
        background.volume = 0.20;
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
        effect = new Audio(`${EFFECTS_BASE_PATH}${name}.mp3`);
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
        playEffect("level-up", false, 1.0);
    },

    playWoosh() {
        playEffect("woosh", false, 1.0);
    },
};

soundInit();

export { effects };
