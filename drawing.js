import { intersections, boardSize, boardMargin, distanceBetweenIntersections, starPoints } from "./consts.js";
import { getColor, getCords, getIsLaddered } from "./stone.js";
import { cordToPos, flipColor } from "./utils.js";

export function drawBoard(ctx) {
    ctx.fillStyle = "#c84";
    ctx.fillRect(0, 0, boardSize, boardSize);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
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
    stones.forEach(stone => {
        const [x, y] = getCords(stone).map(cordToPos);

        ctx.beginPath();
        ctx.arc(x, y, distanceBetweenIntersections * 0.48, 0, 2 * Math.PI, true);
        ctx.fillStyle = getColor(stone);
        ctx.fill();

        if (getIsLaddered(stone)) {
            ctx.beginPath();
            ctx.arc(x, y, distanceBetweenIntersections * 0.26, 0, 2 * Math.PI, true);
            ctx.lineWidth = 3;
            ctx.strokeStyle = flipColor(getColor(stone));
            ctx.stroke();
        }
    });
}
