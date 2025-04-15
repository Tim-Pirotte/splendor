//TODO make and add correct images
const WINNER_ANIMATION_IMAGES = [
    "./../assets/images/fallback/UI/tokens/black_chip.png",
    "./../assets/images/fallback/UI/tokens/blue_chip.png",
    "./../assets/images/fallback/UI/tokens/gold_chip.png",
];

const LOSER_ANIMATION_IMAGES = [
    "./../assets/images/fallback/UI/tokens/green_chip.png",
    "./../assets/images/fallback/UI/tokens/red_chip.png",
    "./../assets/images/fallback/UI/tokens/white_chip.png",
];

const INTERVAL_BETWEEN_ANIMATING_IMAGES = 50;

//the animation takes 3 seconds
const TIMEOUT_BEFORE_ANIMATED_IMAGE_DELETION = 3100;

export {
    WINNER_ANIMATION_IMAGES,
    LOSER_ANIMATION_IMAGES,
    INTERVAL_BETWEEN_ANIMATING_IMAGES,
    TIMEOUT_BEFORE_ANIMATED_IMAGE_DELETION,
};
