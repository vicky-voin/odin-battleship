import { Player } from "../player";

test('a human player is created with a gameboard', () =>
{
    const human = new Player(true);

    expect(human.isHuman).toBeTruthy();
    expect(human.gameboard).toBeDefined();
});

test('a computer player is created with a gameboard', () =>
{
    const computer = new Player(false);

    expect(computer.isHuman).toBeFalsy();
    expect(computer.gameboard).toBeDefined();
});