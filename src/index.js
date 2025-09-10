import { Game } from "./game";
import { GameboardView } from "./gameboardView";
import "./index.css"

const game = new Game();
const player1BoardView = new GameboardView();
const player2BoardView = new GameboardView();

player2BoardView.eventEmitter.on('cellClicked', (x,y) => {
    game.handlePlayerInput(x,y);
});

const player1BoardDOMObject = player1BoardView.init(document, game.humanPlayer);
const player2BoardDOMObject = player2BoardView.init(document, game.computerPlayer);

const player1BoardRoot = document.querySelector(".board-container#board1");
const player2BoardRoot = document.querySelector(".board-container#board2");

player1BoardRoot.appendChild(player1BoardDOMObject);
player2BoardRoot.appendChild(player2BoardDOMObject);

game.populateShips();