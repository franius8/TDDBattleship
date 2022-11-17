const Ship = ((length) => {
    const _length = length
    let _timesHit = 0;
    const getlLength = () => _length;
    const hit = () => _timesHit += 1;
    const getTimesHit = () => _timesHit;
    const isSunk = () => _timesHit === length;
    return {getLength: getlLength, hit: hit, getTimesHit:getTimesHit, isSunk: isSunk}
})

const GameBoard = (() => {
    const _board = new Array(10).fill(new Array(10).fill(null))
    const _pastMoves = []
    const _missedAttacks = []
    let _shipsRemaining = 0;
    const _convertCoordinate = (coordinate) => {
        const row = coordinate.charCodeAt(0) - 65;
        const column = Number(coordinate[1]) - 1
        return [row, column]
    }
    const getBoard = () => _board
    const placeShip = (length, ...coordinates) => {
        if (length !== coordinates.length) {
            throw new Error ('Number of coordinates does not match ship length')
        }
        const ship = Ship(length)
        coordinates.forEach(coordinate => {
            const [row, column] = _convertCoordinate(coordinate)
            _board[row][column] = ship;
        });
        _shipsRemaining += 1;
        return _board
    }
    const receiveAttack = (coordinate) => {
        const [row, column] = _convertCoordinate(coordinate)
        if (_board[row][column] !== null) {
            const ship = _board[row][column]
            ship.hit()
            if (ship.isSunk()) {
                _shipsRemaining -= 1;
            }
            return ship.getTimesHit()
        } else {
            _missedAttacks.push(coordinate)
            return coordinate;
        }
    }
    const areAllSunk = () => _shipsRemaining === 0;
    const getMissedAttacks = () => _missedAttacks;
    const getPastMoves = () => _pastMoves;
    return {getBoard, placeShip, receiveAttack, areAllSunk, getMissedAttacks, getPastMoves}
})

const Player = ((isComputer) => {
    const _isComputer = isComputer;
    const _randomCoordinate = () => {
        const randomLetter = String.fromCharCode(Math.floor(Math.random() * 9 + 65));
        const randomColumn = String(Math.floor(Math.random() * 10 + 1));
        return randomLetter + randomColumn;
    }
    const move = (pastMoves) => {
        let coordinate;
        if (_isComputer) {
            let validCoordinate = false;
            while (!validCoordinate) {
                coordinate = _randomCoordinate();
                if (!pastMoves.includes(coordinate)) {
                    validCoordinate = true;
                }
            }
        }
        return coordinate;
    }
    return {move};
})

module.exports = {
    Ship: Ship,
    GameBoard: GameBoard,
    Player: Player
}
