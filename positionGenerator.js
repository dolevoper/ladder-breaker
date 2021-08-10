import { intersections } from "./consts.js";
import { sourceComponents, destinationComponents } from "./components.js";
import { binary } from "./utils.js";
import { maybe, either, randInt } from "./randomness.js";

export function generatePosition() {
    const components = selectComponents();

    return placeComponents(components)
        .map(maybe(mirrorX))
        .map(maybe(mirrorY))
        .map(maybe(flipColors))
        .map(maybe(either(rotateCW, rotateCCW)));
}

function selectComponents() {
    return {
        source: sourceComponents[randInt(sourceComponents.length)],
        destination: destinationComponents[randInt(destinationComponents.length)]
    };
}

function placeComponents({ source, destination }) {
    const generateOffset = dim => randInt((intersections + 1) / 2 - dim + 1)
    const sourceOffset = calcComponentDimensions(source).map(generateOffset);
    const destinationOffset = calcComponentDimensions(destination).map(generateOffset);

    return [
        ...source.map(([color, x, y]) => [color, x + (intersections - 1) / 2 + sourceOffset[0], y + sourceOffset[1]]),
        ...destination.map(([color, x, y]) => [color, x + destinationOffset[0], y + (intersections - 1) / 2 + destinationOffset[1]])
    ];
}

function calcComponentDimensions(component) {
    return [
        component.map(([_, x]) => x).reduce(binary(Math.max), 0),
        component.map(([_, __, y]) => y).reduce(binary(Math.max), 0)
    ];
}

function mirrorX([color, x, y]) {
    return [color, intersections + 1 - x, y];
}

function mirrorY([color, x, y]) {
    return [color, x, intersections + 1 - y];
}

function flipColors([color, x, y]) {
    return [color === "white" ? "black" : "white", x, y];
}

function rotateCW([color, x, y]) {
    return [color, intersections - y + 1, x];
}

function rotateCCW([color, x, y]) {
    return [color, y, x];
}
