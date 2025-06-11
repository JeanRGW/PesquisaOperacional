export default function multiplicarMatriz(A: number[][], B: number[][]): number[][] {
    if (A[0].length !== B.length) {
        throw new Error("Impossível multiplicar as matrizes: número de colunas de A deve ser igual ao número de linhas de B.");
    }

    // Inicializa a matriz de resultado com zeros
    const result: number[][] = Array(A.length)
        .fill(0)
        .map(() => Array(B[0].length).fill(0));

    // Realiza a multiplicação de matrizes
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < B.length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}