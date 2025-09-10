import { Gameboard } from "../gameboard";

test('adds ship successfully if enough space is availabe', () => {
    const gameboard = new Gameboard(10,10);

    const shipAddedCallback = jest.fn();
    gameboard.eventEmitter.on('shipAdded', (start, end) => {
        shipAddedCallback(start, end);
    });

    const result = gameboard.addShip([1,2], [3,2]);

    expect(result).toBeTruthy();
    expect(shipAddedCallback).toHaveBeenCalledWith([1,2], [3,2]);
})

test('does not add ship if not enough space', () => 
{
    const gameboard = new Gameboard(10,10);

    const shipAddedCallback = jest.fn();
    gameboard.eventEmitter.on('shipAdded', (start, end) => {
        shipAddedCallback(start, end);
    });

    const result = gameboard.addShip([9,9], [11,9]);

    expect(result).toBeFalsy();
    expect(shipAddedCallback).not.toHaveBeenCalled();
})

test('does not add ship if there is overlap with another ship', () => 
{
    const gameboard = new Gameboard(10,10);

    gameboard.addShip([1,2], [3,2]);

    const shipAddedCallback = jest.fn();
    gameboard.eventEmitter.on('shipAdded', (start, end) => {
        shipAddedCallback(start, end);
    });

    const result = gameboard.addShip([1,2], [1,6]);

    expect(result).toBeFalsy();
    expect(shipAddedCallback).not.toHaveBeenCalled();
})

test('reports successful attack when a ship cell is hit', () => {
    const gameboard = new Gameboard(10,10);
    
    const hitCallback = jest.fn();
    gameboard.eventEmitter.on('hit', (x,y) => {
        hitCallback(x,y);
    });

    gameboard.addShip([0,1], [3,1]);
    expect(gameboard.receiveAttack(1,1)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });
    expect(hitCallback).toHaveBeenCalledWith(1,1);
})

test('reports a failed attack if a cell has already been attacked', () => {
    const gameboard = new Gameboard(10,10);

    gameboard.addShip([0,1], [3,1]);
    gameboard.receiveAttack(1,1);

    const hitCallback = jest.fn();
    gameboard.eventEmitter.on('hit', (x,y) => {
        hitCallback(x,y);
    });

    const missCallback = jest.fn();
    gameboard.eventEmitter.on('miss', (x,y) => {
        missCallback(x,y);
    });

    expect(gameboard.receiveAttack(1,1)).toMatchObject({
        isHit: false,
        isLegalMove: false
    });
    expect(hitCallback).not.toHaveBeenCalled();
    expect(missCallback).not.toHaveBeenCalled();
})

test('reports a miss when an empty cell is hit', () => {
    const gameboard = new Gameboard(10,10);

    const missCallback = jest.fn();
    gameboard.eventEmitter.on('miss', (x,y) => {
        missCallback(x,y);
    });

    gameboard.addShip([0,1], [3,1]);
    expect(gameboard.receiveAttack(5,5)).toMatchObject({
        isHit: false,
        isLegalMove: true
    });
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

    expect(gameboard.receiveAttack(0,1)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });
    expect(gameboard.receiveAttack(0,2)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });

    expect(gameboard.receiveAttack(5,3)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });
    expect(gameboard.receiveAttack(6,3)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });
    expect(gameboard.receiveAttack(7,3)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });

    expect(gameOverCallback).toHaveBeenCalled();
})

test('clearing the board resets board state', () => {
    const gameboard = new Gameboard(10,10);

    gameboard.addShip([0,1], [3,1]);
    gameboard.receiveAttack(5,5);
    gameboard.receiveAttack(0,1);

    const resetCallback = jest.fn();
    gameboard.eventEmitter.on('reset', () => {
        resetCallback();
    });

    const missCallback = jest.fn();
    gameboard.eventEmitter.on('miss', (x,y) => {
        missCallback(x,y);
    });

    const hitCallback = jest.fn();
    gameboard.eventEmitter.on('hit', (x,y) => {
        hitCallback(x,y);
    });

    gameboard.clear();

    expect(gameboard.receiveAttack(0,1)).toMatchObject({
        isHit: false,
        isLegalMove: true
    });

    expect(gameboard.receiveAttack(5,6)).toMatchObject({
        isHit: false,
        isLegalMove: true
    });

    expect(gameboard.addShip([4,1], [5,1])).toBeTruthy();

    expect(gameboard.receiveAttack(4,1)).toMatchObject({
        isHit: true,
        isLegalMove: true
    });

    expect(missCallback).toHaveBeenCalledTimes(2);
    expect(hitCallback).toHaveBeenCalledTimes(1);
    expect(resetCallback).toHaveBeenCalled();
});