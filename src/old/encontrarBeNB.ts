import determinante from "../utils/determinante";

export function gerarB(M: number[][], I: number[]): number[][] {
    const n = M.length;
    const newMat: number[][] = [];

    for (let i = 0; i < n; i++) {
        newMat.push([]);
        for (let j = 0; j < I.length; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }

    return newMat;
}

function gerarNB(M: number[][], I: number[]): number[][] {
    const nLinhas = M.length;
    const newMat: number[][] = [];

    for (let i = 0; i < nLinhas; i++) {
        newMat.push([]);
        for (let j = 0; j < I.length; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }

    return newMat;
}

function permutaTesta(
    M: number[][],
    I: number[],
    NI: number[]
): number[] | null {
    if (NI.length === M.length) {
        return determinante(gerarB(M, NI)) !== 0 ? NI : null;
    }

    for (let i = 0; i < I.length; i++) {
        const NI2 = [...NI, I[i]];
        const I2 = [...I];
        I2.splice(i, 1);

        const resultado = permutaTesta(M, I2, NI2);
        if (resultado !== null) {
            return resultado;
        }
    }

    return null;
}

export default function encontraBeNB(M: number[][]): {
    B: number[][];
    NB: number[][];
    iB: number[];
    iNB: number[];
} | null {
    const n = M[0].length;
    const I = Array.from({ length: n }, (_, i) => i);

    const pCorreta = permutaTesta(M, I, []);
    if (pCorreta === null) {
        return null;
    }

    const iB = pCorreta;
    const iNB = I.filter((i) => !iB.includes(i));

    const B = gerarB(M, iB);
    const NB = gerarNB(M, iNB);

    return {
        B,
        NB,
        iB,
        iNB,
    };
}
