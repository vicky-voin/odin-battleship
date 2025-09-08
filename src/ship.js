export class Ship
{
    #length = 0;

    constructor(length)
    {
        this.#length = length;    
    }

    get length() {return this.#length;}

    hit()
    {
        this.#length = Math.max(0, this.#length - 1);
        return this.#length;
    }

    isSunk()
    {
        return this.#length === 0;
    }
}