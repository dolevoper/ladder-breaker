// this is a test commit
import { boardSize } from "./consts.js";
import { drawBoard, drawStones } from "./drawing.js";
import { generatePosition } from "./positionGenerator.js";
import { generateVariations } from "./variationGenerator.js";

export const canvasSize = 1000;

const canvas = document.getElementById("board");
const generateNewPositionButton = document.getElementById("generateNewPosition");
const showVariationsButton = document.getElementById("showVariations");
const variationsList = document.getElementById("variations");
const ctx = canvas.getContext("2d");

let position;
let variations;
let display;

generateNewPositionButton.addEventListener("click", init);

showVariationsButton.addEventListener("click", function () {
    variationsList.classList.remove("hidden");
});

function init() {
    position = generatePosition();
    variations = generateVariations(position);
    display = position;

    variationsList.innerHTML = "";
    variationsList.classList.add("hidden");

    const originalPositionNode = document.createElement("li");

    originalPositionNode.innerText = "Original position";
    originalPositionNode.addEventListener("click", function () { display = position; });
    variationsList.appendChild(originalPositionNode);

    variations.forEach((variation, i) => {
        const variationNode = document.createElement("li");

        variationNode.innerText = `Variation #${i + 1}`;
        variationNode.addEventListener("click", function () { display = variation; });
        variationsList.appendChild(variationNode);
    });
}

init();

requestAnimationFrame(function draw() {
    ctx.resetTransform();

    drawBackground();

    ctx.translate((canvasSize - boardSize) / 2, (canvasSize - boardSize) / 2);

    drawBoard(ctx);
    drawStones(ctx, display);

    requestAnimationFrame(draw);
});

function drawBackground() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}
