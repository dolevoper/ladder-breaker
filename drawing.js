import { intersections, boardSize, boardMargin, distanceBetweenIntersections, starPoints } from "./consts.js";
import { cordToPos } from "./utils.js";

export function drawBoard(ctx) {
    ctx.fillStyle = "brown";
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.strokeRect(boardMargin, boardMargin, boardSize - 2 * boardMargin, boardSize - 2 * boardMargin);

    for (let i = 1; i <= intersections - 2; i++) {
        ctx.moveTo(boardMargin, i * distanceBetweenIntersections + boardMargin);
        ctx.lineTo(boardSize - boardMargin, i * distanceBetweenIntersections + boardMargin);
        ctx.moveTo(i * distanceBetweenIntersections + boardMargin, boardMargin);
        ctx.lineTo(i * distanceBetweenIntersections + boardMargin, boardSize - boardMargin);
    }

    ctx.stroke();

    ctx.fillStyle = "black";
    starPoints.forEach(cords => {
        const [x, y] = cords.map(cordToPos);

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
        ctx.fill();
    });
}

export function drawStones(ctx, stones) {
    stones.forEach(([color, ...cords]) => {
        const [x, y] = cords.map(cordToPos);

        ctx.beginPath();
        ctx.arc(x, y, distanceBetweenIntersections / 2, 0, 2 * Math.PI, true);
        ctx.fillStyle = color;
        ctx.fill();
    });
}
