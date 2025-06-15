"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = lerProblema;
const fs_1 = require("fs");
function preparaEntrada() {
    const rFile = (0, fs_1.readFileSync)("test.txt", "utf-8");
    return rFile
        .split(/\r?\n/) // Divide em linhas
        .filter((x) => x.trim() !== "") // Remove linhas vazias
        .map((line) => line.split(" ")); // Quebra em elementos da linha
}
function extraiProblema(entrada) {
    const primeiraLinha = entrada.shift();
    if (!primeiraLinha)
        throw new Error("Erro na entrada.");
    const [maxMinStr, , , ...resto] = primeiraLinha;
    const isMax = maxMinStr.toLowerCase() === "max";
    let c = extraiFuncF(resto);
    let nVars = c.length;
    let ops = [];
    const A = montarMatriz(entrada, nVars);
    interpretaSinais(entrada, c, A, ops);
    const b = entrada.map((x) => parseFloat(x[0]));
    return {
        isMax,
        A,
        b,
        c,
        ops,
        n: A[0].length, // Numero de variáveis reais
        vb: [],
        vnb: [],
    };
}
function extraiFuncF(entrada) {
    const funcF = [];
    let sinal = "+";
    for (const c of entrada) {
        if (c === "+" || c === "-") {
            sinal = c;
        }
        else {
            const split = c.split("x");
            const valor = split[0] === ""
                ? 1
                : split[0] === "-"
                    ? -1
                    : parseFloat(split[0]);
            funcF.push(sinal === "+" ? valor : valor * -1);
            sinal = "+";
        }
    }
    return funcF;
}
function montarMatriz(entrada, nVars) {
    const mat = [];
    for (let i = 0; i < entrada.length; i++) {
        mat.push([]);
        for (let j = 0; j < nVars; j++) {
            mat[i].push(0);
        }
    }
    let linhaAtual = 0;
    for (const linha of entrada) {
        let sinal = "+";
        while (linha.length > 0 && !linha[0].match(/<|>|=/g)) {
            const c = linha.shift();
            if (c === "+" || c === "-") {
                sinal = c;
            }
            else {
                const split = c.split("x");
                const valor = split[0] === ""
                    ? 1
                    : split[0] === "-"
                        ? -1
                        : parseFloat(split[0]);
                const iVar = (parseInt(split[1]) - 1);
                mat[linhaAtual][iVar] = sinal === "+" ? valor : valor * -1;
                sinal = "+";
            }
        }
        linhaAtual++;
    }
    return mat;
}
function interpretaSinais(entrada, vetorF, mat, ops) {
    for (let i = 0; i < entrada.length; i++) {
        const c = entrada[i].shift();
        ops.push(c);
        if (c !== "=") {
            const valor = c.match("<") ? 1 : -1;
            vetorF.push(0);
            for (let j = 0; j < entrada.length; j++) {
                if (j === i) {
                    mat[j].push(valor);
                }
                else {
                    mat[j].push(0);
                }
            }
        }
    }
}
function lerProblema() {
    const entrada = preparaEntrada();
    return extraiProblema(entrada);
}
