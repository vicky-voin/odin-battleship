import EventEmitter from "events";
import "./gameboardView.css"

export class GameboardView
{
    #cells = [];
    #height = 0;
    #width = 0;
    #isEnemyBoard = false;

    constructor()
    {
        this.eventEmitter = new EventEmitter();
    }

    init(document, player)
    {
        this.#isEnemyBoard = !player.isHuman;
        const gameboard = player.gameboard;

        const root = document.createElement('div');
        root.className = "gameboard-grid";

        if(this.#isEnemyBoard)
        {
            root.classList.add('opponent');
        }
        else
        {
            root.classList.add('player');
        }

        for(let i = 0; i < gameboard.width; i++)
        {
            for(let j = 0; j < gameboard.height; j++)
            {
                const cell = document.createElement('div');
                cell.className = "gameboard-cell";

                cell.addEventListener('click', () => {this.#cellClicked(j,i);})

                this.#cells.push(cell);

                root.appendChild(cell);
            }
        }

        gameboard.eventEmitter.on('shipAdded', (start, end) => this.#onShipAdded(start, end));
        gameboard.eventEmitter.on('hit', (x, y) => this.#setCellHit(x, y));
        gameboard.eventEmitter.on('miss', (x, y) => this.#setCellMiss(x, y));
        
        this.#width = gameboard.width;
        this.#height = gameboard.height;

        return root;
    }

    #onShipAdded(start, end){
        const [startX, startY] = start;
        const [endX, endY] = end;
        const dx = Math.sign(endX - startX);
        const dy = Math.sign(endY - startY);
        let x = startX, y = startY;

        while (true) {
            const cell = this.#getCell(x, y);
            if (cell) {
            cell.classList.add('ship');
            }
            if (x === endX && y === endY) break;
            x += dx;
            y += dy;
        }
    }

    #getCell(x,y)
    {
        return this.#cells[y * this.#height + x];
    }

    #cellClicked(x,y)
    {
        this.eventEmitter.emit('cellClicked', x, y);
    }

    #setCellHit(x,y)
    {
        this.#getCell(x,y).classList.add('hit');
    }

    #setCellMiss(x,y)
    {
        this.#getCell(x,y).classList.add('miss');
    }
}