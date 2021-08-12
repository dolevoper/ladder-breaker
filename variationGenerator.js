import { getColor, getCords, getIsLaddered, stone } from "./stone.js";
import { flipColor } from "./utils.js";

export function generateVariations(stones) {
    const board = stonesToBoard(stones);
    const ladderedStone = getCords(stones.find(getIsLaddered));

    return escapeLadder(board, ladderedStone).map(({position, winner}) => boardToStones(position, ladderedStone));
}

function stonesToBoard(stones) {
    return stones.reduce(
        (res, stone) => placeStone(getCords(stone), getColor(stone), res),
        {}
    );
}

function boardToStones(board, ladderedStone) {
    return Object.entries(board).flatMap(([xKey, col]) => Object.entries(col).map(([yKey, color]) => {
        const x = parseInt(xKey);
        const y = parseInt(yKey);

        return stone(color, x, y, ladderedStone[0] === x && ladderedStone[1] === y);
    }));
}

function escapeLadder(board, ladderedStone) {
    if (!board) return [];

    const defenderColor = colorAt(ladderedStone, board);
    const attackerColor = flipColor(defenderColor);

    const {liberties, neighbors} = getLibertiesAndNeighbors(ladderedStone, board);
    const candidateMoves = liberties;
    for (const neighbor of neighbors) {
        const neighborLiberties = getLiberties(neighbor, board);
        if (neighborLiberties.length === 1)
            candidateMoves.push(neighborLiberties[0]);
    }

    const winningOutcomes = [], runningMoves = [];
    for (const move of candidateMoves) {
        const position = makeMove(defenderColor, move, board);
        if (!position) continue;

        const liberties = getLiberties(ladderedStone, position).length;
        if (liberties > 2) {
            winningOutcomes.push({position, winner: defenderColor});
        } else if (liberties === 2) {
            runningMoves.push(position);
        }
    }

    const runningOutcomes = runningMoves.flatMap(position => captureLadder(position, ladderedStone));
    winningOutcomes.push(...runningOutcomes.filter(({winner}) => winner === defenderColor));

    if (winningOutcomes.length > 0) {
        return winningOutcomes;
    } else if (runningOutcomes.length > 0) {
        return runningOutcomes;
    } else {
        return {position: board, winner: attackerColor};
    }
}

function captureLadder(board, ladderedStone) {
    const defenderColor = colorAt(ladderedStone, board);
    const attackerColor = flipColor(defenderColor);

    const winningOutcomes = [], chasingMoves = [];
    for (const move of getLiberties(ladderedStone, board)) {
        const position = makeMove(attackerColor, move, board);
        if (!position) continue;

        if (!colorAt(ladderedStone, position)) {
            winningOutcomes.push({position: board, winner: attackerColor});
        } else {
            const liberties = getLiberties(ladderedStone, position);
            if (liberties.length === 1) {
                const positionAfterEscape = makeMove(defenderColor, liberties[0], position);
                if (!positionAfterEscape) {
                    winningOutcomes.push({position, winner: attackerColor});
                } else if (getLiberties(ladderedStone, positionAfterEscape).length <= 2) {
                    chasingMoves.push(position);
                }
            }
        }
    }

    const chasingOutcomes = chasingMoves.flatMap(position => escapeLadder(position, ladderedStone));
    winningOutcomes.push(...chasingOutcomes.filter(({winner}) => winner === attackerColor));

    if (winningOutcomes.length > 0) {
        return winningOutcomes;
    } else if (chasingOutcomes.length > 0) {
        return chasingOutcomes;
    } else {
        return {position: board, winner: defenderColor};
    }
}

function getLiberties(cords, board) {
    return getLibertiesAndNeighbors(cords, board).liberties;
}

function getLibertiesAndNeighbors(cords, board) {
    const stoneColor = colorAt(cords, board);
    const visited = new Set();
    const queue = [cords];
    const liberties = [], neighbors = [];

    while (queue.length > 0) {
        const cordToCheck = queue.pop();

        const key = `${cordToCheck[0]},${cordToCheck[1]}`;
        if (visited.has(key)) continue;
        visited.add(key);

        const colorAtCord = colorAt(cordToCheck, board);

        if (!colorAtCord) {
            liberties.push(cordToCheck);
        } else if (colorAtCord === stoneColor) {
            queue.push(...getNeighbors(cordToCheck));
        } else {
            neighbors.push(cordToCheck);
        }
    }
    return {liberties, neighbors};
}

function makeMove(color, cords, board) {
    if (colorAt(cords, board)) return;

    const candidate = getNeighbors(cords).reduce(
        (res, cordToCheck) => {
            const colorAtCord = colorAt(cordToCheck, res);

            if (colorAtCord && colorAtCord !== color && !getLiberties(cordToCheck, res).length) return removeGroup(cordToCheck, res);

            return res;
        },
        placeStone(cords, color, board)
    );

    if (!getLiberties(cords, candidate).length) return;

    return candidate;
}

function colorAt(cords, board) {
    return board[cords[0]]?.[cords[1]];
}

function placeStone(at, color, board) {
    return {
        ...board,
        [at[0]]: {
            ...(board[at[0]] ?? {}),
            [at[1]]: color
        }
    };
}

function removeGroup(at, board) {
    const colorToRemove = colorAt(at, board);

    return getNeighbors(at).reduce(
        (res, cordToCheck) => {
            const colorAtCord = colorAt(cordToCheck, res);

            return colorAtCord !== colorToRemove ? res : removeGroup(cordToCheck, res);
        },
        placeStone(at, undefined, board)
    );
}

function getNeighbors(cords) {
    return [
        [cords[0], cords[1] - 1],
        [cords[0], cords[1] + 1],
        [cords[0] + 1, cords[1]],
        [cords[0] - 1, cords[1]]
    ].filter(([x, y]) => x > 0 && x < 20 && y > 0 && y < 20);
}
