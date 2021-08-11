import { intersections } from "./consts.js";
import { sourceComponents, destinationComponents } from "./components.js";
import { compose, flipColor, identity } from "./utils.js";
import { maybe, either, randInt } from "./randomness.js";
import { getCords, mapColor, mapCords, mapX, mapY } from "./stone.js";

export function randomConfig() {
    const generateOffset = dim => randInt((intersections + 1) / 2 - dim + 1);
    const { source, destination } = selectComponents();
    const sourceOffset = calcComponentDimensions(source).map(generateOffset);
    const destinationOffset = calcComponentDimensions(destination).map(generateOffset);

    return {
        source,
        destination,
        sourceOffset,
        destinationOffset,
        transformations: [
            maybe(mapX(mirror)),
            maybe(mapY(mirror)),
            maybe(mapColor(flipColor)),
            maybe(either(mapCords(rotateCW), mapCords(rotateCCW)))
        ]
    };
}

export function fromConfig({ transformations = [], ...componentsData }) {
    return placeComponents(componentsData)
        .map(transformations.reduce(compose, identity));
}

function selectComponents() {
    return {
        source: sourceComponents[randInt(sourceComponents.length)],
        destination: destinationComponents[randInt(destinationComponents.length)]
    };
}

function placeComponents({ source, destination, sourceOffset, destinationOffset }) {
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
