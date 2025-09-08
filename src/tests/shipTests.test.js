import { Ship } from "../ship";

test('ship length reduces when hit', () => {
    const ship = new Ship(3);

    expect(ship.hit()).toBe(2);
    expect(ship.length).toBe(2);
})

test('ship length does not reduce below 0', () => {
    const ship = new Ship(0);

    expect(ship.hit()).toBe(0);
    expect(ship.length).toBe(0);
})

test('ship is not sunk when any length left', () => {
    const ship = new Ship(2);

    ship.hit();

    expect(ship.isSunk()).toBeFalsy();
})

test('ship sunk when length is at 0', () => {
    const ship = new Ship(1);

    ship.hit();

    expect(ship.isSunk()).toBeTruthy();

    ship.hit();

    expect(ship.isSunk()).toBeTruthy();
})