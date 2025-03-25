const hardCodedGames = {
    "games": [
        {
          "players": [
            "Alice",
            "Bob"
          ],
          "started": false,
          "gameId": 0,
          "gameName": null,
          "numberOfPlayers": 3,
          "returnExcessTokensRequired": true,
          "pickNobleRequired": false
        },
        {
          "players": [
            "Alice",
            "Bob"
          ],
          "started": true,
          "gameId": 1,
          "gameName": "The Splendid Splendors",
          "numberOfPlayers": 2,
          "returnExcessTokensRequired": false,
          "pickNobleRequired": false
        },
        {
            "players": [
              "Alice",
              "Bob",
              "Niels"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "Niels games",
            "numberOfPlayers": 3,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob",
              "Arne",
              "Alex"
            ],
            "started": false,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 4,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 2,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 2,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 2,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 2,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          },
          {
            "players": [
              "Alice",
              "Bob"
            ],
            "started": true,
            "gameId": 1,
            "gameName": "The Splendid Splendors",
            "numberOfPlayers": 2,
            "returnExcessTokensRequired": false,
            "pickNobleRequired": false
          }
  ]
}

function getDummyGames(){
    return hardCodedGames;
}


export { getDummyGames }