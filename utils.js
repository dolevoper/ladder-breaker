import { distanceBetweenIntersections, boardMargin } from "./consts.js";

export const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;
export const identity = x => x;
