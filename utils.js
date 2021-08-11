import { distanceBetweenIntersections, boardMargin } from "./consts.js";

export const identity = x => x;
export const compose = (g, f) => x => g(f(x));

export const cordToPos = n => (n - 1) * distanceBetweenIntersections + boardMargin;
export const flipColor = color => ({ white: "black", black: "white" })[color];
