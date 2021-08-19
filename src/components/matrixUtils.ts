// from https://blog.devgenius.io/lets-rotate-a-matrix-clockwise-javascript-beginners-65a9c34aa0a6
export const rotateMatrix = (matrix) => {
    flipMajorDiagonal(matrix);
    reverseEachRow(matrix);
    return matrix;
};

export const flipMajorDiagonal = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = i; j < matrix[0].length; j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    return matrix;
};

export const reverseEachRow = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        matrix[i].reverse();
    }
    return matrix;
};
