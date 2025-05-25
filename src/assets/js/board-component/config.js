const PRESTIGE_POINTS_NEEDED_TO_WIN = 15;
const MAX_TOKENS_ALLOWED = 10;
const CHIP_SPACING = 0.3;
const CARDS_IN_DECK_TO_DECK_HEIGHT_SCALE = 45;
const CARDS_IN_DECK_TO_DECK_HEIGHT_OFFSET = 0.05;

const NOBLES_MAPPER = {
    "Elizabeth of Austria": "gert_samson",
    "Suleiman the Magnificent": "trump",
    "Isabella of Castile": "sam_altman",
    "Mary Stuart": "boma",
    "Henry VIII": "monopoly_man",
    "Niccolo Machiavelli": "mark",
    "Catherine de Medici": "dagobert_duck",
    "Anne of Brittany": "frank_verstreaten",
    "Charles the Fifth": "elon_musk",
    "Francois the 1st": "jef_bezos",
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

const MIN_TOKENS_FOR_PICKING_TWO = 4;
const MAX_TAKE_TOKENS = 3;
const MAX_RESERVED_AMOUNT = 3;

const SECONDS_PER_ROUND = 45;
const SECONDS_WHEN_TURN_ALMOST_ENDS = 10;

const ANIMATION_FINISH_DELAY = 500;

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
    MAX_RESERVED_AMOUNT,
    SECONDS_PER_ROUND,
    SECONDS_WHEN_TURN_ALMOST_ENDS,
    CARDS_IN_DECK_TO_DECK_HEIGHT_SCALE,
    CARDS_IN_DECK_TO_DECK_HEIGHT_OFFSET,
    MIN_TOKENS_FOR_PICKING_TWO,
    ANIMATION_FINISH_DELAY,
};
