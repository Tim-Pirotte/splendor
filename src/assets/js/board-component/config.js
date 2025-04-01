const PRESTIGE_POINTS_NEEDED_TO_WIN = 15;
const MAX_TOKENS_ALLOWED = 10;
const CHIP_SPACING = 0.15;

const NOBLES_MAPPER = {
    "Elizabeth of Austria": "noble_border",
    "Suleiman the Magnificent": "noble_border",
    "Isabella of Castile": "noble_border",
    "Mary Stuart": "noble_border",
    "Henry VIII": "noble_border",
    "Niccolo Machiavelli": "noble_border",
    "Catherine de Medici": "noble_border",
    "Anne of Brittany": "noble_border",
    "Charles the Fifth": "noble_border",
    "Francois the 1st": "noble_border",
};

const TOKEN_MAPPER = {
    "Emerald": "green",
    "Sapphire": "blue",
    "Ruby": "red",
    "Diamond": "white",
    "Onyx": "black",
    "Gold": "gold",
};

const TOKEN_LIMIT_TWO_PLAYERS = 4;
const TOKEN_LIMIT_THREE_PLAYERS = 5;
const TOKEN_LIMIT = 7;
const GOLD_TOKEN_LIMIT = 5;

const MAX_TAKE_TOKENS = 3;

const SECONDS_PER_ROUND = 45;
const SECONDS_WHEN_TURN_ALMOST_ENDS = 10;

export {
    PRESTIGE_POINTS_NEEDED_TO_WIN,
    MAX_TOKENS_ALLOWED,
    CHIP_SPACING,
    NOBLES_MAPPER,
    TOKEN_MAPPER,
    TOKEN_LIMIT_TWO_PLAYERS,
    TOKEN_LIMIT_THREE_PLAYERS,
    TOKEN_LIMIT,
    GOLD_TOKEN_LIMIT,
    MAX_TAKE_TOKENS,
    SECONDS_PER_ROUND,
    SECONDS_WHEN_TURN_ALMOST_ENDS,
};
