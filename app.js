import { boardSize } from "./consts.js";
import { drawBoard, drawStones } from "./drawing.js";
import { generatePosition } from "./positionGenerator.js";

export const canvasSize = 1000;

const canvas = document.getElementById("board");
const generateNewPositionButton = document.getElementById("generateNewPosition");
const ctx = canvas.getContext("2d");

let stones = generatePosition();

generateNewPositionButton.addEventListener("click", function () {
    stones = generatePosition();
});

requestAnimationFrame(function draw() {
    ctx.resetTransform();

    drawBackground();

    ctx.translate((canvasSize - boardSize) / 2, (canvasSize - boardSize) / 2);

    drawBoard(ctx);
    drawStones(ctx, stones);

    requestAnimationFrame(draw);
});

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}
