# Programming project web project group [04]

## Known bugs
None to our knowledge.

## Points of interest
- A multifunctional button to perform in game actions: [game-status-interface.js](src/assets/js/board-component/game-status-interface.js)
- A centralized way to communicate with the server: [api.js](src/assets/js/api.js)
- A state machine to properly control the flow of the game: [state-machine.js](src/assets/js/board-component/state-machine/state-machine.js)

- A sharing link to easily share the game with friends: [handler.js](src/assets/js/lobby-component/handler.js)
- A small animation library to add complex FLIP animations: [animation-handler.js](src/assets/js/board-component/animation-component/animation-handler.js)
- A mini template language to inject variables and functions into animations: [template-renderer.js](src/assets/js/board-component/animation-component/template-renderer.js)
- A synchronous SHA256 implementation: [crypto.js](src/assets/js/utils/crypto.js)
  - Pull request to fix an issue with the source: [Pull request](https://github.com/liangtengyu/wx_gzh_article)
- A way for players to collect cards that are saved in a tree structure to save on memory: [card-collection.js](src/assets/js/card-collection-component/card-collection.js)

All art is custom-made.