"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inversa;
function inversa(mat, ind) {
    const n = mat.length;
    if (!mat.every(row => row.length === n)) {
        console.error("A matriz deve ser quadrada.");
        return null;
    }
    const identidade = [];
    for (let i = 0; i < n; i++) {
        identidade.push([]);
        for (let j = 0; j < n; j++) {
            identidade[i].push(i === j ? 1 : 0);
        }
    }
    for (let i = 0; i < n; i++) {
        maiorDaColuna(mat, ind, i);
        if (mat[i][i] === 0) {
            console.error("A matriz não é invertível.");
            return null;
        }
        for (let j = i + 1; j < n; j++) {
            const fator = mat[j][i] / mat[i][i];
            for (let k = 0; k < n; k++) {
                mat[j][k] -= fator * mat[i][k];
                identidade[j][k] -= fator * identidade[i][k];
            }
        }
    }
    return identidade;
}
function maiorDaColuna(mat, ind, index) {
    let maiorI = index;
    for (let i = index; i < mat.length; i++) {
        if (Math.abs(mat[i][index]) > Math.abs(mat[maiorI][index]))
            maiorI = i;
    }
    permutaLinhas(mat, ind, index, maiorI);
}
function permutaLinhas(mat, ind, i, j) {
    {
        const temp = mat[i];
        mat[i] = mat[j];
        mat[j] = temp;
    }
    {
        const temp = ind[i];
        ind[i] = ind[j];
        ind[j] = temp;
    }
}
