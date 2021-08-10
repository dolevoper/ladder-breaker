import { intersections } from "./consts.js";
import { sourceComponents, destinationComponents } from "./components.js";
import { flipColor } from "./utils.js";
import { maybe, either, randInt } from "./randomness.js";
import { getCords, mapColor, mapCords, mapX, mapY } from "./stone.js";

export function generatePosition() {
    const components = selectComponents();

    return placeComponents(components)
        .map(maybe(mapX(mirror)))
        .map(maybe(mapY(mirror)))
        .map(maybe(mapColor(flipColor)))
        .map(maybe(either(mapCords(rotateCW), mapCords(rotateCCW))));
}

function selectComponents() {
    return {
        source: sourceComponents[randInt(sourceComponents.length)],
        destination: destinationComponents[randInt(destinationComponents.length)]
    };
}

function placeComponents({ source, destination }) {
    const generateOffset = dim => randInt((intersections + 1) / 2 - dim + 1);
    const sourceOffset = calcComponentDimensions(source).map(generateOffset);
    const destinationOffset = calcComponentDimensions(destination).map(generateOffset);

    const sum = ([x1, y1]) => ([x2, y2]) => [x1 + x2, y1 + y2];

    return [
        ...source
            .map(mapX(x => x + (intersections - 1) / 2))
            .map(mapCords(sum(sourceOffset))),
        ...destination
            .map(mapY(y => y + (intersections - 1) / 2))
            .map(mapCords(sum(destinationOffset)))
    ];
}

function calcComponentDimensions(component) {
    return component.map(getCords).reduce(
        ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)],
        [0, 0]
    );
}

const mirror = c => intersections + 1 - c;
const rotateCW = ([x, y]) => [intersections - y + 1, x];
const rotateCCW = ([x, y]) => [y, x];
