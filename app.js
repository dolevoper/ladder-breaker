import { boardSize } from "./consts.js";
import { drawBoard, drawStones } from "./drawing.js";
import { configFromQuery, configToQuery, fromConfig, isConfigValid, randomConfig } from "./positionGenerator.js";
import { generateVariations } from "./variationGenerator.js";

export const canvasSize = 900;

const canvas = document.getElementById("board");
const generateNewPositionButton = document.getElementById("generateNewPosition");
const showVariationsButton = document.getElementById("showVariations");
const shareButton = document.getElementById("share");
const variationsList = document.getElementById("variations");
const toaster = document.getElementById("toaster");
const ctx = canvas.getContext("2d");

let config = window.location.search ?
    configFromQuery(window.location.search) :
    randomConfig();
let position;
let variations;
let display;

generateNewPositionButton.addEventListener("click", function () {
    config = randomConfig();

    init();
});

showVariationsButton.addEventListener("click", function () {
    variationsList.classList.remove("hidden");
});

shareButton.addEventListener("click", async function () {
    await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${window.location.pathname}?${configToQuery(config)}`);

    toast("Copied to clipboard");
});

function init() {
    position = fromConfig(config);
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

if (!isConfigValid(config)) {
    config = randomConfig();
    toast("Invalid URL");
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

async function toast(message) {
    toaster.innerHTML = `<h2>${message}</h2>`;
    toaster.classList.remove("hidden");

    await new Promise(resolve => setTimeout(resolve, 3000));

    toaster.classList.add("hidden");
}
