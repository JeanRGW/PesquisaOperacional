export default function determinante(mat: number[][]): number {
    if (mat.length === 1) return mat[0][0];

    let sum = 0;
    let j = 0;

    for (let i = 0; i < mat.length; i++) {
        sum += mat[i][j] * (-1) ** (i + 2) * determinante(subMatriz(mat, i, j));
    }

    return sum;
}

function subMatriz(
    mat: number[][],
    excludeI: number,
    excludeJ: number
): number[][] {
    const newMat: number[][] = [];

    let linha = 0;
    for (let i = 0; i < mat.length; i++) {
        if (i !== excludeI) {
            newMat.push([]);
            let coluna = 0;

            for (let j = 0; j < mat[0].length; j++) {
                if (j !== excludeJ) {
                    newMat[linha].push(mat[i][j]);
                    coluna++;
                }
            }

            linha++;
        }
    }

    return newMat;
}