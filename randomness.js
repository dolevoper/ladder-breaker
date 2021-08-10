import { identity } from "./utils.js";

export const randInt = n => Math.floor(Math.random() * n);

const randBool = () => !!randInt(2);

export const either = (fx, gx) => randBool() ? fx : gx;
export const maybe = fn => either(fn, identity);
