import EventEmitter from "events";
import { Player } from "./player";

export class Game
{
    #possibleShipPlacement = [
        [
            { start: { x: 0, y: 1 }, end: { x: 4, y: 1 } }, // Carrier
            { start: { x: 5, y: 2 }, end: { x: 5, y: 5 } }, // Battleship
            { start: { x: 7, y: 0 }, end: { x: 9, y: 0 } }, // Cruiser
            { start: { x: 3, y: 7 }, end: { x: 5, y: 7 } }, // Submarine
            { start: { x: 0, y: 9 }, end: { x: 1, y: 9 } }, // Destroyer
        ],
        [
            { start: { x: 2, y: 0 }, end: { x: 6, y: 0 } }, // Carrier
            { start: { x: 8, y: 2 }, end: { x: 8, y: 5 } }, // Battleship
            { start: { x: 1, y: 5 }, end: { x: 3, y: 5 } }, // Cruiser
            { start: { x: 6, y: 7 }, end: { x: 8, y: 7 } }, // Submarine
            { start: { x: 9, y: 3 }, end: { x: 8, y: 3 } }, // Destroyer
        ],
        [
            { start: { x: 5, y: 0 }, end: { x: 9, y: 0 } }, // Carrier
            { start: { x: 0, y: 2 }, end: { x: 0, y: 5 } }, // Battleship
            { start: { x: 4, y: 4 }, end: { x: 6, y: 4 } }, // Cruiser
            { start: { x: 7, y: 6 }, end: { x: 7, y: 8 } }, // Submarine
            { start: { x: 2, y: 9 }, end: { x: 3, y: 9 } }, // Destroyer
        ],
        [
            { start: { x: 0, y: 4 }, end: { x: 4, y: 4 } }, // Carrier
            { start: { x: 6, y: 2 }, end: { x: 6, y: 5 } }, // Battleship
            { start: { x: 2, y: 7 }, end: { x: 4, y: 7 } }, // Cruiser
            { start: { x: 9, y: 5 }, end: { x: 9, y: 7 } }, // Submarine
            { start: { x: 5, y: 9 }, end: { x: 6, y: 9 } }, // Destroyer
        ],
        [
            { start: { x: 3, y: 3 }, end: { x: 7, y: 3 } }, // Carrier
            { start: { x: 1, y: 6 }, end: { x: 1, y: 9 } }, // Battleship
            { start: { x: 8, y: 8 }, end: { x: 6, y: 8 } }, // Cruiser
            { start: { x: 0, y: 8 }, end: { x: 0, y: 6 } }, // Submarine
            { start: { x: 4, y: 0 }, end: { x: 5, y: 0 } }, // Destroyer
        ],
    ];

    #availableComputerMoves = [];

    constructor()
    {
        this.humanPlayer = new Player(true);
        this.computerPlayer = new Player(false);

        for(let i = 0; i < this.humanPlayer.gameboard.width; i++)
        {
            for(let j = 0; j < this.humanPlayer.gameboard.height; j++)
            {
                this.#availableComputerMoves.push({x:i, y:j});
            }
        }

        this.eventEmitter = new EventEmitter();

        this.computerPlayer.gameboard.eventEmitter.on('gameOver', () => {
            this.eventEmitter.emit('gameOver', {isYourWin: true, message: "You won!"});
        });

        this.humanPlayer.gameboard.eventEmitter.on('gameOver', () => {
            this.eventEmitter.emit('gameOver', {isYourWin: false, message: "You lost..."});
        });
    }

    populateShips()
    {
        this.humanPlayer.gameboard.clear();
        this.computerPlayer.gameboard.clear();

        const playerPlacementIndex = Math.floor(Math.random() * this.#possibleShipPlacement.length);
        const computerPlacementIndex = Math.floor(Math.random() * this.#possibleShipPlacement.length);

        this.#possibleShipPlacement[playerPlacementIndex].forEach(ship => {
            this.humanPlayer.gameboard.addShip([ship.start.x, ship.start.y], [ship.end.x, ship.end.y]);
        });

        this.#possibleShipPlacement[computerPlacementIndex].forEach(ship => {
            this.computerPlayer.gameboard.addShip([ship.start.x, ship.start.y], [ship.end.x, ship.end.y]);
        });
    }

    handlePlayerInput(x, y)
    {
        if(this.computerPlayer.receiveAttack(x,y).isLegalMove)
        {
            this.#makeComputerPlay();
        }
    }

    #makeComputerPlay()
    {
        const randomPlayIndex = Math.floor(Math.random() * this.#availableComputerMoves.length);

        const selectedPlay = this.#availableComputerMoves.splice(randomPlayIndex, 1)[0];

        console.log(`Computer selected to play ${selectedPlay.x} : ${selectedPlay.y}`);
        this.humanPlayer.receiveAttack(selectedPlay.x, selectedPlay.y);
    }
}
