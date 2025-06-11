"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const rFile = (0, fs_1.readFileSync)("test.txt", "utf-8");
console.log(rFile);
const str = "Max 3 2 2 3 2 1 3 4 <= >= 5 7";
// Max | Min // N Linhas // N variáveis // Primeira Linha // Colunas // Sinais // Independentes
const inputs = str.split(" ");
const maxMin = inputs.shift();
const nLinhas = parseInt(inputs.shift());
const nVariaveis = parseInt(inputs.shift());
const mat = [];
const vF = [];
const vIndependentes = [];
for (let i = 0; i < nLinhas - 1; i++) {
    mat.push([]);
}
for (let i = 0; i < nVariaveis; i++) {
    // Construir termos da função a ser otimizada
    vF.push(parseFloat(inputs.shift()));
    // Inserir linhas da matriz.
    for (let j = 0; j < nLinhas - 1; j++) {
        mat[j].push(parseFloat(inputs.shift()));
    }
}
for (let i = 0; i < nLinhas - 1; i++) {
    // Ler símbolos
}
function printMatriz(mat) {
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat.length; j++) {
            process.stdout.write(mat[i][j].toString() + " ");
        }
        console.log("");
    }
}
printMatriz(mat);
