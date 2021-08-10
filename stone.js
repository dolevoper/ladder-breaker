export const stone = (color, x, y, isLaddered = false) => [color, x, y, isLaddered];

export const mapColor = fn => ([color, x, y, isLaddered]) => stone(fn(color), x, y, isLaddered);
export const mapCords = fn => ([color, x, y, isLaddered]) => stone(color, ...fn([x, y]), isLaddered);
export const mapX = fn => ([color, x, y, isLaddered]) => stone(color, fn(x), y, isLaddered);
export const mapY = fn => ([color, x, y, isLaddered]) => stone(color, x, fn(y), isLaddered);

export const getCords = ([, x, y]) => [x, y];
export const getColor = ([color]) => color;
export const getIsLaddered = ([,,, isLaddered]) => isLaddered;
