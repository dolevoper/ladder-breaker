import { getColor, getCords, getIsLaddered, stone } from "./stone.js";
import { flipColor } from "./utils.js";

export function generateVariations(stones) {
    const board = stonesToBoard(stones);
    const ladderedStone = getCords(stones.find(getIsLaddered));

    return ladder(board, ladderedStone).map(position => boardToStones(position, ladderedStone));
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

function ladder(board, ladderedStone) {
    if (!board) return [];

    const [runningMove] = getLiberties(ladderedStone, board);
    const defenderColor = colorAt(ladderedStone, board);
    const positionToCapture = makeMove(defenderColor, runningMove, board);

    if (!positionToCapture) return [board];

    const candidateMoves = getLiberties(ladderedStone, positionToCapture);

    if (candidateMoves.length > 2) return [positionToCapture];
    if (candidateMoves.length === 1) return [board];

    const nextPositions = candidateMoves
        .map(move => makeMove(flipColor(defenderColor), move, positionToCapture))
        .filter(position => {
            if (!position) return false;

            const positionAfterNextDefense = makeMove(defenderColor, getLiberties(ladderedStone, position)[0], position);

            if (!positionAfterNextDefense) return true;

            return getLiberties(ladderedStone, positionAfterNextDefense).length < 3;
        });

    if (!nextPositions.length) return [positionToCapture];

    return nextPositions.flatMap(position => ladder(position, ladderedStone));
}

function getLiberties(cords, board) {
    const stoneColor = colorAt(cords, board);
    const visited = new Set();
    const queue = [cords];
    const liberties = [];

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
        }
    }
    return liberties;
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
