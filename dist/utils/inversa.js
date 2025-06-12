"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = inversa;
function inversa(mat) {
    const n = mat.length;
    if (!mat.every((row) => row.length === n)) {
        console.error("A matriz deve ser quadrada.");
        return null;
    }
    // Copiar a matriz original
    const A = mat.map((row) => row.slice());
    // Criar a matriz identidade
    const I = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
    for (let i = 0; i < n; i++) {
        // Encontrar o maior elemento em valor absoluto na coluna i
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
                maxRow = k;
            }
        }
        // Trocar as linhas i e maxRow
        [A[i], A[maxRow]] = [A[maxRow], A[i]];
        [I[i], I[maxRow]] = [I[maxRow], I[i]];
        // Verificar se a matriz é singular
        if (A[i][i] === 0) {
            console.error("A matriz não é invertível.");
            return null;
        }
        // Normalizar a linha i
        const pivot = A[i][i];
        for (let j = 0; j < n; j++) {
            A[i][j] /= pivot;
            I[i][j] /= pivot;
        }
        // Eliminar os outros elementos na coluna i
        for (let k = 0; k < n; k++) {
            if (k === i)
                continue;
            const fator = A[k][i];
            for (let j = 0; j < n; j++) {
                A[k][j] -= fator * A[i][j];
                I[k][j] -= fator * I[i][j];
            }
        }
    }
    return I;
}
