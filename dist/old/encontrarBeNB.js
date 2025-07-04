"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarB = gerarB;
exports.default = encontraBeNB;
const determinante_1 = __importDefault(require("../utils/determinante"));
function gerarB(M, I) {
    const n = M.length;
    const newMat = [];
    for (let i = 0; i < n; i++) {
        newMat.push([]);
        for (let j = 0; j < I.length; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }
    return newMat;
}
function gerarNB(M, I) {
    const nLinhas = M.length;
    const newMat = [];
    for (let i = 0; i < nLinhas; i++) {
        newMat.push([]);
        for (let j = 0; j < I.length; j++) {
            newMat[i].push(M[i][I[j]]);
        }
    }
    return newMat;
}
function permutaTesta(M, I, NI) {
    if (NI.length === M.length) {
        return (0, determinante_1.default)(gerarB(M, NI)) !== 0 ? NI : null;
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
function encontraBeNB(M) {
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
