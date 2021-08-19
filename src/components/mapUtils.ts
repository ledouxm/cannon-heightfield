import { chunk, makeArrayOf } from "@pastable/core";
import { DataTexture, RGBFormat } from "three";

type Grid = number[][];

export const makeRandomMap = (
    perlin: number[][],
    width: number,
    height: number,
    threshold: number,
    maxHeight: number
) => {
    const buffer = makeArrayOf(height).map(() => makeArrayOf(width).map(() => 0));
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            if (i === 0 || i === width - 1 || j === 0 || j === height - 1) buffer[i][j] = 0;
            else buffer[i][j] = perlin[i][j] > threshold ? maxHeight : 0;
        }
    }

    return buffer;
};

const getSurroundingWallCount = (buffer: Grid, x: number, y: number, maxHeight: number) => {
    let wallCount = 0;

    const obj = { x, y, tested: [] };

    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i !== x || j !== y) {
                obj.tested.push([i, j]);
                if (i >= 0 && i < buffer.length && j >= 0 && j < buffer[i].length) {
                    wallCount += buffer[i][j] / maxHeight;
                } else wallCount++;
            }
        }
    }

    return wallCount;
};

export const smoothMap = (buffer: Grid, maxHeight: number) => {
    const newBuffer = JSON.parse(JSON.stringify(buffer)) as number[][];

    for (let i = 0; i < buffer.length; i++) {
        for (let j = 0; j < buffer[i].length; j++) {
            const neighbourWallTiles = getSurroundingWallCount(buffer, i, j, maxHeight);
            if (neighbourWallTiles > 4) {
                newBuffer[i][j] = maxHeight;
            } else if (neighbourWallTiles < 4) {
                newBuffer[i][j] = 0;
            } else {
                newBuffer[i][j] = buffer[i][j];
            }
        }
    }
    console.log("smoothed", buffer, newBuffer);

    return newBuffer;
};

export const makeTextureMap = (buffer: Grid, maxHeight: number) => {
    const nb = buffer.flatMap((row) =>
        row.flatMap((cell) => [
            cell * (255 / maxHeight),
            cell * (255 / maxHeight),
            cell * (255 / maxHeight),
        ])
    );
    const newBuffer = new Uint8Array(nb.length);
    nb.forEach((cell, i) => (newBuffer[i] = cell));

    const texture = new DataTexture(newBuffer, buffer.length, buffer[0].length, RGBFormat);

    return texture;
};
