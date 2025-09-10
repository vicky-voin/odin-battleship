import { Player } from "./player";

export class Game
{
    #defaultShips = [
        // Carrier (5)
        { start: { x: 0, y: 0 }, end: { x: 4, y: 0 } },
        // Battleship (4)
        { start: { x: 2, y: 2 }, end: { x: 2, y: 5 } },
        // Cruiser (3)
        { start: { x: 6, y: 1 }, end: { x: 8, y: 1 } },
        // Submarine (3)
        { start: { x: 5, y: 5 }, end: { x: 5, y: 7 } },
        // Destroyer (2)
        { start: { x: 9, y: 9 }, end: { x: 8, y: 9 } },
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
    }

    populateShips()
    {
        this.#defaultShips.forEach(ship => {
            this.humanPlayer.gameboard.addShip([ship.start.x, ship.start.y], [ship.end.x, ship.end.y]);
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
