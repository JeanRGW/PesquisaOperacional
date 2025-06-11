"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = encontraBeNB;
const determinante_1 = __importDefault(require("./utils/determinante"));
function gerarB(M, I) {
    const n = M.length;
    const newMat = [];
    for (let i = 0; i < n; i++) {
        newMat.push([]);
        for (let j = 0; j < n; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }
    return newMat;
}
function gerarNB(M, I) {
    const nLinhas = M.length;
    const newI = [...I];
    newI.splice(0, nLinhas);
    const newMat = [];
    for (let i = 0; i < nLinhas; i++) {
        newMat.push([]);
        for (let j = 0; j < newI.length; j++) {
            console.log;
            newMat[i].push(M[i][I[j]]);
        }
    }
    return newMat;
}
function permutaTesta(M, I, NI) {
    if (NI.length === M.length) {
        if ((0, determinante_1.default)(gerarB(M, NI)) !== 0)
            return I;
        return null;
    }
    for (let i = 0; i < I.length; i++) {
        const NI2 = [...NI, I[i]];
        const I2 = [...I];
        I2.splice(i, 1);
        console.log("NI2: " + NI2);
        if (permutaTesta(M, I2, NI2) !== null) {
            return I2;
        }
    }
    return null;
}
function encontraBeNB(M) {
    const n = M[0].length;
    const I = new Array(n).fill(0).map((_, i) => i);
    const pCorreta = permutaTesta(M, I, []);
    if (pCorreta === null) {
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
    };
}
const M = [
    [1, 1, 1, 0],
    [1, 0, 0, -1],
    [0, 1, 0, 0]
];
console.log(encontraBeNB(M));
