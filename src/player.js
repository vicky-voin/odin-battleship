import {Gameboard} from "./gameboard"

export class Player
{
    constructor(isHuman)
    {
        this.isHuman = isHuman;
        this.gameboard = new Gameboard(10,10);
    }
}