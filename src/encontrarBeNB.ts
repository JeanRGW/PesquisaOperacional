import determinante from "./utils/determinante";

function gerarB(M: number[][], I: number[]) : number[][] {
    const n = M.length;

    const newMat: number[][] = []
    for(let i = 0; i < n; i++) {
        newMat.push([]);
        for(let j = 0; j < n; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }

    return newMat;
}

function gerarNB(M: number[][], I: number[]) : number[][] {
    const nLinhas = M.length;

    const newI = [...I];
    newI.splice(0, nLinhas);

    const newMat: number[][] = []
    for(let i = 0; i<nLinhas; i++) {
        newMat.push([]);
        
        for(let j = 0; j < newI.length; j++) {
            console.log
            newMat[i].push(M[i][I[j]]);
        }
    }

    return newMat;
}

function permutaTesta(M: number[][], I: number[], NI: number[]) : number[] | null {
    if(NI.length === M.length){
        if(determinante(gerarB(M, NI)) !== 0)
            return I;

        return null;
    }

    for(let i=0; i<I.length; i++){
        const NI2 = [...NI, I[i]];
        const I2 = [...I];
        I2.splice(i, 1);
        console.log("NI2: " + NI2);
        
        if(permutaTesta(M, I2, NI2) !== null){
            return I2;
        }
    }

    return null;
}

export default function encontraBeNB(M: number[][]) : {
    B: number[][],
    NB: number[][],
    iB: number[],
    iNB: number[]
} | null {
    const n = M[0].length;
    const I = new Array(n).fill(0).map((_, i) => i);

    const pCorreta = permutaTesta(M, I, []);

    if(pCorreta === null) {
        return null;
    }

    const B = gerarB(M, pCorreta);
    const NB = gerarNB(M, I);
    const iB = pCorreta;
    const iNB = I.filter(i => !pCorreta.includes(i));

    return {
        B,
        NB,
        iB,
        iNB
    }
}

const M = [
    [1, 1, 1, 0],
    [1, 0, 0, -1],
    [0, 1, 0, 0]
]

console.log(encontraBeNB(M));