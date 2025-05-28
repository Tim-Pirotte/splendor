const AUDIO_BASE_PATH = new URL("../../audio/", import.meta.url);
const EFFECTS_BASE_PATH = new URL("./effects", AUDIO_BASE_PATH);

const tokenVolume = 0.04;

export { EFFECTS_BASE_PATH, AUDIO_BASE_PATH, tokenVolume };
