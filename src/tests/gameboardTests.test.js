import { Gameboard } from "../gameboard";

test('adds ship successfully if enough space is availabe', () => {
    const gameboard = new Gameboard(10,10);

    const result = gameboard.addShip([1,2], [3,2]);

    expect(result).toBeTruthy();
})

test('does not add ship if not enough space', () => 
{
    const gameboard = new Gameboard(10,10);

    const result = gameboard.addShip([9,9], [11,9]);

    expect(result).toBeFalsy();
})

test('does not add ship if there is overlap with another ship', () => 
{
    const gameboard = new Gameboard(10,10);

    gameboard.addShip([1,2], [3,2]);
    const result = gameboard.addShip([1,2], [1,6]);

    expect(result).toBeFalsy();
})

test('reports successful attack when a ship cell is hit', () => {
    const gameboard = new Gameboard(10,10);
    
    const hitCallback = jest.fn();
    gameboard.eventEmitter.on('hit', (x,y) => {
        hitCallback(x,y);
    });

    gameboard.addShip([0,1], [3,1]);
    expect(gameboard.receiveAttack(1,1)).toBeTruthy();
    expect(hitCallback).toHaveBeenCalledWith(1,1);
})

test('reports a miss when an empty cell is hit', () => {
    const gameboard = new Gameboard(10,10);

    const missCallback = jest.fn();
    gameboard.eventEmitter.on('miss', (x,y) => {
        missCallback(x,y);
    });

    gameboard.addShip([0,1], [3,1]);
    expect(gameboard.receiveAttack(5,5)).toBeFalsy();
    expect(missCallback).toHaveBeenCalledWith(5,5);
})

test('reports when all ships have sunk', () => {
    const gameboard = new Gameboard(10,10);

    const gameOverCallback = jest.fn();
    gameboard.eventEmitter.on('gameOver', () => {
        gameOverCallback();
    })

    gameboard.addShip([0,1], [0,2]);
    gameboard.addShip([5,3], [7,3]);

    expect(gameboard.receiveAttack(0,1)).toBeTruthy();
    expect(gameboard.receiveAttack(0,2)).toBeTruthy();

    expect(gameboard.receiveAttack(5,3)).toBeTruthy();
    expect(gameboard.receiveAttack(6,3)).toBeTruthy();
    expect(gameboard.receiveAttack(7,3)).toBeTruthy();

    expect(gameOverCallback).toHaveBeenCalled();
})