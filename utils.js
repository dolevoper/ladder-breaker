import { distanceBetweenIntersections, boardMargin } from "./consts.js";

export const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;
export const identity = x => x;

export const flipColor = color => ({ white: "black", black: "white" })[color];
