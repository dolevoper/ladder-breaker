import { distanceBetweenIntersections, boardMargin } from "./consts.js";

export const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;
export const binary = fn => (a, b) => fn(a, b);
export const identity = x => x;
