import { intersections } from "./consts.js";
import { sourceComponents, destinationComponents } from "./components.js";
import { compose, flipColor, identity } from "./utils.js";
import { maybe, either, randInt } from "./randomness.js";
import { getCords, mapColor, mapCords, mapX, mapY } from "./stone.js";

const mirror = c => intersections + 1 - c;
const mirrorX = mapX(mirror);
const mirrorY = mapY(mirror);
const reverseColors = mapColor(flipColor);
const rotateCW = mapCords(([x, y]) => [intersections - y + 1, x]);
const rotateCCW = mapCords(([x, y]) => [y, x]);

const transformationToQuery = new Map([
    [mirrorX, "mx"],
    [mirrorY, "my"],
    [reverseColors, "rc"],
    [rotateCW, "rcw"],
    [rotateCCW, "rccw"]
]);

const queryToTransform = {
    mx: mirrorX,
    my: mirrorY,
    rc: reverseColors,
    rcw: rotateCW,
    rccw: rotateCCW
};

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
            maybe(mirrorX),
            maybe(mirrorY),
            maybe(reverseColors),
            maybe(either(rotateCW, rotateCCW))
        ]
    };
}

export function fromConfig({ transformations = [], ...componentsData }) {
    return placeComponents(componentsData)
        .map(transformations.reduce(compose, identity));
}

export function configToQuery({ source, destination, sourceOffset, destinationOffset, transformations }) {
    const byRef = o1 => o2 => o1 === o2;
    const query = new URLSearchParams();

    query.append("s", sourceComponents.findIndex(byRef(source)));
    query.append("d", destinationComponents.findIndex(byRef(destination)))
    query.append("so", sourceOffset.join(","));
    query.append("do", destinationOffset.join(","));

    transformations
        .filter(t => t !== identity)
        .forEach(t => query.append(transformationToQuery.get(t), true));

    return query.toString();
}

export function configFromQuery(str) {
    const query = new URLSearchParams(str);

    return {
        source: sourceComponents[parseInt(query.get("s"))],
        destination: destinationComponents[parseInt(query.get("d"))],
        sourceOffset: query.get("so").split(",").map(n => parseInt(n)),
        destinationOffset: query.get("do").split(",").map(n => parseInt(n)),
        transformations: Object.entries(queryToTransform).filter(([q]) => query.has(q)).map(([, t]) => t)
    };
}

export function isConfigValid({ source, destination, sourceOffset, destinationOffset }) {
    if (!source || !destination || !sourceOffset || !destinationOffset) return false;

    return placeComponents({ source, destination, sourceOffset, destinationOffset })
        .flatMap(getCords)
        .every(n => n > 0 & n <= intersections);
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
