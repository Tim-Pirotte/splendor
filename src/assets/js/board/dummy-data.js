const dummyData = {
  "gameId": 2,
  "gameName": null,
  "numberOfPlayers": 2,
  "returnExcessTokensRequired": false,
  "pickNobleRequired": false,
  "players": [
    {
      "name": "Alice",
      "tokens": {
        "Diamond": 2
      },
      "reserve": [],
      "built": [
        {
          "name": "Obsidian Workshop",
          "level": 1,
          "cost": {
            "Emerald": 2,
            "Diamond": 2
          },
          "bonus": "Onyx",
          "prestigePoints": 0
        }
      ],
      "nobles": [],
      "totalPrestigePoints": 0,
      "bonuses": {
        "Onyx": 1,
        "Ruby": 2
      }
    },
    {
      "name": "Bob",
      "tokens": {
        "Ruby": 2
      },
      "reserve": [],
      "built": [
        {
          "name": "Shimmering Quarry",
          "level": 1,
          "cost": {
            "Sapphire": 3
          },
          "bonus": "Diamond",
          "prestigePoints": 0
        }
      ],
      "nobles": [],
      "totalPrestigePoints": 0,
      "bonuses": {
        "Diamond": 1
      }
    }
  ],
  "market": [
    {
      "level": 1,
      "cardStackSize": 34,
      "visibleCards": [
        {
          "name": "Fiery Chamber",
          "level": 1,
          "cost": {
            "Diamond": 4
          },
          "bonus": "Ruby",
          "prestigePoints": 1
        },
        {
          "name": "Celestial Chamber",
          "level": 1,
          "cost": {
            "Ruby": 4
          },
          "bonus": "Sapphire",
          "prestigePoints": 1
        },
        {
          "name": "Gloomy Chamber",
          "level": 1,
          "cost": {
            "Sapphire": 4
          },
          "bonus": "Onyx",
          "prestigePoints": 1
        },
        {
          "name": "Dark Gem Cave",
          "level": 1,
          "cost": {
            "Emerald": 1,
            "Ruby": 1,
            "Diamond": 1,
            "Sapphire": 1
          },
          "bonus": "Onyx",
          "prestigePoints": 0
        }
      ]
    },
    {
      "level": 2,
      "cardStackSize": 26,
      "visibleCards": [
        {
          "name": "Azure Refinery",
          "level": 2,
          "cost": {
            "Diamond": 5,
            "Sapphire": 3
          },
          "bonus": "Sapphire",
          "prestigePoints": 2
        },
        {
          "name": "Obsidian Vault",
          "level": 2,
          "cost": {
            "Emerald": 2,
            "Diamond": 3,
            "Sapphire": 2
          },
          "bonus": "Onyx",
          "prestigePoints": 1
        },
        {
          "name": "Polished Vault",
          "level": 2,
          "cost": {
            "Emerald": 3,
            "Ruby": 2,
            "Onyx": 2
          },
          "bonus": "Diamond",
          "prestigePoints": 1
        },
        {
          "name": "Ruby Guild",
          "level": 2,
          "cost": {
            "Onyx": 5
          },
          "bonus": "Ruby",
          "prestigePoints": 2
        }
      ]
    },
    {
      "level": 3,
      "cardStackSize": 16,
      "visibleCards": [
        {
          "name": "Royal Sapphire Chamber",
          "level": 3,
          "cost": {
            "Diamond": 7
          },
          "bonus": "Sapphire",
          "prestigePoints": 4
        },
        {
          "name": "Master Onyx Atelier",
          "level": 3,
          "cost": {
            "Ruby": 7,
            "Onyx": 3
          },
          "bonus": "Onyx",
          "prestigePoints": 5
        },
        {
          "name": "Master Emerald Atelier",
          "level": 3,
          "cost": {
            "Emerald": 3,
            "Sapphire": 7
          },
          "bonus": "Emerald",
          "prestigePoints": 5
        },
        {
          "name": "Exquisite Diamond Vault",
          "level": 3,
          "cost": {
            "Onyx": 7
          },
          "bonus": "Diamond",
          "prestigePoints": 4
        }
      ]
    }
  ],
  "unclaimedTokens": {
    "Emerald": 4,
    "Ruby": 2,
    "Gold": 5,
    "Diamond": 2,
    "Sapphire": 4,
    "Onyx": 4
  },
  "unclaimedNobles": [
    {
      "name": "Elizabeth of Austria",
      "neededBonuses": {
        "Diamond": 3,
        "Sapphire": 3,
        "Onyx": 3
      },
      "prestigePoints": 3
    },
    {
      "name": "Suleiman the Magnificent",
      "neededBonuses": {
        "Emerald": 4,
        "Sapphire": 4
      },
      "prestigePoints": 3
    },
    {
      "name": "Isabella of Castile",
      "neededBonuses": {
        "Diamond": 4,
        "Onyx": 4
      },
      "prestigePoints": 3
    }
  ],
  "gameState": "TurnAction",
  "currentPlayer": "Alice",
  "winner": null
}

export { dummyData };