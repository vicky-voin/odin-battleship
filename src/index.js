import { Game } from "./game";
import { GameboardView } from "./gameboardView";
import "./index.css"

const game = new Game();
const player1BoardView = new GameboardView();
const player2BoardView = new GameboardView();

const randomizePositionButton = document.querySelector(".randomize-position");
randomizePositionButton.addEventListener('click', () =>
{
    game.populateShips();
})

player2BoardView.eventEmitter.on('cellClicked', (x,y) => {
    randomizePositionButton.hidden = true;
    game.handlePlayerInput(x,y);
});

const player1BoardDOMObject = player1BoardView.init(document, game.humanPlayer);
const player2BoardDOMObject = player2BoardView.init(document, game.computerPlayer);

const player1BoardRoot = document.querySelector(".board-container#board1");
const player2BoardRoot = document.querySelector(".board-container#board2");

player1BoardRoot.appendChild(player1BoardDOMObject);
player2BoardRoot.appendChild(player2BoardDOMObject);

const resultMessage = document.querySelector(".game-result");

game.populateShips();
game.eventEmitter.on('gameOver', (result) => 
{
    player1BoardView.handleGameOver(result.isYourWin);
    player2BoardView.handleGameOver(!result.isYourWin);
    resultMessage.textContent = result.message;
});