import {Gameboard} from "./gameboard"

export class Player
{
    constructor(isHuman)
    {
        this.isHuman = isHuman;

        const boardWidth = 10;
        const boardHeight = 10;

        this.gameboard = new Gameboard(boardWidth,boardHeight);
    }

    receiveAttack(x,y)
    {
        if(x < 0 || x >= this.gameboard.width ||
            y < 0 || y >= this.gameboard.height
        )
        {
            console.log("Move is outside the bounds!");
            return false;
        }

        return this.gameboard.receiveAttack(x,y);
    }
}