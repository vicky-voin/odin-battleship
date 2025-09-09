import EventEmitter from "events";
import { Ship } from "./ship";

export class Gameboard
{
    #cells = [];
    #width = 0;
    #height = 0;

    #ships = [];

    constructor(width, height)
    {
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                row.push({isEmpty : true});
            }
            this.#cells.push(row);
        }

        this.#width = width;
        this.#height = height;
        this.eventEmitter = new EventEmitter();
    }

    addShip(start, end)
    {
        if (
            start[0] < 0 || start[0] >= this.#width - 1 ||
            start[1] < 0 || start[1] >= this.#height - 1  ||
            end[0] < 0 || end[0] >= this.#width - 1 ||
            end[1] < 0 || end[1] >= this.#height - 1
        ) {
            return false;
        }

        const xDirection = Math.sign(end[0] - start[0]);
        const yDirection = Math.sign(end[1] - start[1]);
        
        let x = start[0];
        let y = start[1];
        let length = 0;

        while (true) {
            
            if(this.#isOverlapping(x,y))
                return false;

            length++;

            if (x === end[0] && y === end[1]) break;
            x += xDirection;
            y += yDirection;
        }

        x = start[0];
        y = start[1];

        const shipObject = new Ship(length);
        this.#ships.push(shipObject);

        while (true) {
            
            this.#cells[y][x].isEmpty = false;
            this.#cells[y][x].ship = shipObject;
            if (x === end[0] && y === end[1]) break;
            x += xDirection;
            y += yDirection;
        }

        return true;
    }

    #isOverlapping(x, y)
    {
        if(!this.#cells[y][x].isEmpty)
        {
            return true;
        }

        for (let directionY = -1; directionY <= 1; directionY++) {
            for (let directionX = -1; directionX <= 1; directionX++) {
                if (directionX === 0 && directionY === 0) continue;
                const neighbourX = x + directionX;
                const neighbourY = y + directionY;
                if (
                    neighbourX >= 0 && neighbourX < this.#width &&
                    neighbourY >= 0 && neighbourY < this.#height &&
                    !this.#cells[neighbourY][neighbourX].isEmpty
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    receiveAttack(x,y)
    {
        const wasHit = !this.#cells[y][x].isEmpty;
        if(wasHit)
        {
            const ship = this.#cells[y][x].ship;
            ship.hit();
        }
        this.eventEmitter.emit(wasHit? "hit" : "miss", x,y);

        if(this.#isGameOver())
        {
            this.eventEmitter.emit('gameOver');
        }

        return !this.#cells[y][x].isEmpty;
    }

    #isGameOver()
    {
        return this.#ships.every(ship => ship.isSunk());
    }
}