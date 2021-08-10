import { stone } from "./stone.js";

export const sourceComponents = [
    [
        stone("white", 5, 2),
        stone("white", 4, 1),
        stone("white", 3, 1),
        stone("white", 3, 2),
        stone("white", 2, 3, true),
        stone("black", 4, 2),
        stone("black", 2, 2),
        stone("black", 3, 3),
        stone("black", 3, 4),
        stone("black", 5, 4),
        stone("black", 1, 3)
    ]
];

export const destinationComponents = [
    [
        stone("white", 2, 6),
        stone("white", 1, 5),
        stone("white", 1, 4),
        stone("white", 2, 3),
        stone("white", 2, 2),
        stone("black", 3, 6),
        stone("black", 1, 3),
        stone("black", 1, 2),
        stone("black", 1, 1),
        stone("black", 2, 1)
    ]
];
