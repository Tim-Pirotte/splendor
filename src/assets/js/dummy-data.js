const DUMMY_DATA =
{
    gameId: 239,
    gameName: "test18game",
    numberOfPlayers: 2,
    returnExcessTokensRequired: true,
    pickNobleRequired: true,
    players: [
        {
            name: "test18",
            tokens: {},
            reserve: [],
            built: [],
            nobles: [],
            bonuses: {},
            totalPrestigePoints: 0,
        },
        {
            name: "johny",
            tokens: {},
            reserve: [],
            built: [],
            nobles: [],
            bonuses: {},
            totalPrestigePoints: 0,
        },
    ],
    spectators: [
        "spectator"
    ],
    market: [
        {
            level: 1,
            cardStackSize: 36,
            visibleCards: [
                {
                    name: "Diamond Vein",
                    level: 1,
                    cost: {
                        Onyx: 2,
                        Sapphire: 2,
                    },
                    bonus: "Diamond",
                    prestigePoints: 0,
                },
                {
                    name: "Fiery Chamber",
                    level: 1,
                    cost: {
                        Diamond: 4,
                    },
                    bonus: "Ruby",
                    prestigePoints: 1,
                },
                {
                    name: "Verdant Quarry",
                    level: 1,
                    cost: {
                        Emerald: 1,
                        Sapphire: 3,
                        Diamond: 1,
                    },
                    bonus: "Emerald",
                    prestigePoints: 0,
                },
                {
                    name: "Lush Gem Mine",
                    level: 1,
                    cost: {
                        Ruby: 1,
                        Onyx: 2,
                        Sapphire: 1,
                        Diamond: 1,
                    },
                    bonus: "Emerald",
                    prestigePoints: 0,
                },
            ],
        },
        {
            level: 2,
            cardStackSize: 26,
            visibleCards: [
                {
                    name: "Radiant Vault",
                    level: 2,
                    cost: {
                        Ruby: 2,
                        Onyx: 3,
                        Sapphire: 3,
                    },
                    bonus: "Ruby",
                    prestigePoints: 1,
                },
                {
                    name: "Gleaming Estate",
                    level: 2,
                    cost: {
                        Ruby: 5,
                    },
                    bonus: "Diamond",
                    prestigePoints: 2,
                },
                {
                    name: "Azure Refinery",
                    level: 2,
                    cost: {
                        Sapphire: 3,
                        Diamond: 5,
                    },
                    bonus: "Sapphire",
                    prestigePoints: 2,
                },
                {
                    name: "Blazing Refinery",
                    level: 2,
                    cost: {
                        Emerald: 2,
                        Sapphire: 4,
                        Diamond: 1,
                    },
                    bonus: "Ruby",
                    prestigePoints: 2,
                },
            ],
        },
        {
            level: 3,
            cardStackSize: 16,
            visibleCards: [
                {
                    name: "Master Onyx Atelier",
                    level: 3,
                    cost: {
                        Ruby: 7,
                        Onyx: 3,
                    },
                    bonus: "Onyx",
                    prestigePoints: 5,
                },
                {
                    name: "Royal Ruby Chamber",
                    level: 3,
                    cost: {
                        Emerald: 7,
                    },
                    bonus: "Ruby",
                    prestigePoints: 4,
                },
                {
                    name: "Grand Diamond Vault",
                    level: 3,
                    cost: {
                        Ruby: 5,
                        Onyx: 3,
                        Emerald: 3,
                        Sapphire: 3,
                    },
                    bonus: "Diamond",
                    prestigePoints: 3,
                },
                {
                    name: "Master Diamond Atelier",
                    level: 3,
                    cost: {
                        Onyx: 7,
                        Diamond: 3,
                    },
                    bonus: "Diamond",
                    prestigePoints: 5,
                },
            ],
        },
    ],
    unclaimedTokens: {
        Ruby: 4,
        Onyx: 4,
        Emerald: 4,
        Gold: 5,
        Sapphire: 4,
        Diamond: 4,
    },
    unclaimedNobles: [
        {
            name: "Suleiman the Magnificent",
            neededBonuses: {
                Emerald: 4,
                Sapphire: 4,
            },
            prestigePoints: 3,
        },
        {
            name: "Henry VIII",
            neededBonuses: {
                Ruby: 4,
                Onyx: 4,
            },
            prestigePoints: 3,
        },
        {
            name: "Niccolo Machiavelli",
            neededBonuses: {
                Sapphire: 4,
                Diamond: 4,
            },
            prestigePoints: 3,
        },
    ],
    active: true,
    gameState: "TurnAction",
    currentPlayer: "johny",
    winner: null,
    started: true,
};

export { DUMMY_DATA };