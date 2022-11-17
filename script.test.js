const testModule = require('./script')
const Ship = testModule.Ship;
const GameBoard = testModule.GameBoard;
const Player = testModule.Player;

test('crate a ship with length 4', () => {
    expect(Ship(4).getLength()).toBe(4)
})

test('crate a ship with length 15', () => {
    expect(Ship(15).getLength()).toBe(15)
})

test('hits on new Ship object equal to 0', () => {
    expect(Ship(3).getTimesHit()).toBe(0)
})

test('single hit increments hit number by 1', () => {
    expect(Ship(3).hit()).toBe(1)
})

test('mutltiple hits increment hit number correctly', () => {
    const ship = Ship(3)
    ship.hit()
    ship.hit()
    ship.hit()
    expect(ship.getTimesHit()).toBe(3)
})

test('isSunk method on new Ship returns false', () => {
    expect(Ship(3).isSunk()).toBe(false)
})

test('isSunk method on sunken Ship returns true', () => {
    const ship = Ship(2);
    ship.hit()
    ship.hit()
    expect(ship.isSunk()).toBe(true)
})

test('GameBoard is correctly initialized', () => {
    expect(GameBoard().getBoard()[0][0]).toBe(null)
})

test('GameBoard is correctly initialized - second test', () => {
    expect(GameBoard().getBoard()[9][9]).toBe(null)
})

test('placing ship with number of coordinates greater than ship length throws and error', () => {
    expect(() => GameBoard().placeShip(1, 2, 3, 5)).toThrow()
})

test('ship placing methods works correctly', () => {
    expect(GameBoard().placeShip(1, 'A1')[0][0]).not.toBe(null)
})

test('attack that hits a ship is marked correcly', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    expect(board.receiveAttack('A1')).toBe(1)
})

test('attack that hit an empty space returns coordinates', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    expect(board.receiveAttack('A2')).toBe('A2')
})

test('areAllSunk with remaining ships returns false', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    expect(board.areAllSunk()).toBe(false)
})

test('areAllSunk with all ships sunk returns true', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    board.receiveAttack('A1')
    expect(board.areAllSunk()).toBe(true)
});

test('before any attacks the missed attacks array is empty', () => {
    const board = GameBoard()
    expect(board.getMissedAttacks().length).toBe(0)
})

test('missed attack is correctly added to the array', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    board.receiveAttack('A2')
    expect(board.getMissedAttacks()).toEqual(['A2'])
})

test('multiple missed attacks are correctly added to the array', () => {
    const board = GameBoard()
    board.placeShip(1, 'A1')
    board.receiveAttack('A2')
    board.receiveAttack('A5')
    board.receiveAttack('C6')
    expect(board.getMissedAttacks()).toEqual(['A2', 'A5', 'C6'])
})

test("computer's move generates random coordinates", () => {
    const player = Player(true)
    expect(player.move([])).toMatch(/[A-J][1-9]/)
})

test("computer's move does not generate already used coordinates", () => {
    let boardArray = new Array(10).fill(new Array(10).fill(null))
    let letter = 'A'
    boardArray = boardArray.map(row => {
        let columnNum = 0
        const mappedRow = row.map(column => {
            columnNum++
            return letter + columnNum
        });
        letter = String.fromCharCode(letter.charCodeAt(0) + 1)
        return mappedRow
    });
    boardArray = boardArray.flat()
    boardArray.shift()
    const player = Player(true)
    expect(player.move(boardArray)).toBe('A1')
})
