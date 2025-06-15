"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formarProblemaArtificial = formarProblemaArtificial;
exports.calcularCustosRelativos = calcularCustosRelativos;
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
const produtoInterno_1 = __importDefault(require("./utils/produtoInterno"));
function formarProblemaArtificial(p) {
    const { A, b } = p;
    const m = b.length; // número de restrições
    const n = A[0].length;
    // Função objetivo artificial: 0 para as n variáveis originais, 1 para as m artificiais
    const c = [...Array(n).fill(0), ...Array(m).fill(1)];
    // Matriz A estendida com identidade para variáveis artificiais
    const novaA = A.map((linha, i) => {
        const artificiais = Array(m).fill(0);
        artificiais[i] = 1;
        return [...linha, ...artificiais];
    });
    // Índices básicos: artificiais (n, n+1, ..., n+m-1)
    const vb = Array.from({ length: m }, (_, j) => n + j);
    // Índices não-básicos: variáveis originais (0 até n-1)
    const vnb = Array.from({ length: n }, (_, i) => i);
    console.log("vb e vnb artificiais:", vb, vnb);
    return {
        A: novaA,
        b,
        c,
        vb,
        vnb,
        ops: [...p.ops],
        isMax: p.isMax,
        n: p.n,
    };
}
function calcularCustosRelativos(problema) {
    const { A, b, c, vb, vnb } = problema;
    const B = A.map((linha) => vb.map((j) => linha[j]));
    console.table(B);
    const invB = (0, inversa_1.default)(B);
    if (!invB)
        throw new Error("A matriz B não é inversível: \n" + JSON.stringify(B));
    const cB = vb.map((j) => c[j]);
    const lambdaT = (0, multiplicarMatriz_1.default)([cB], invB)[0];
    const custosRelativos = vnb.map((j) => {
        const aNj = A.map((linha) => linha[j]); // coluna j
        return c[j] - (0, produtoInterno_1.default)(lambdaT, aNj);
    });
    let indiceQueEntra = null;
    let menorCusto = 0;
    custosRelativos.forEach((custo, i) => {
        if (custo < menorCusto) {
            menorCusto = custo;
            indiceQueEntra = i;
        }
    });
    console.log("Indice que entra: " + indiceQueEntra);
    return {
        custosRelativos,
        lambdaT,
        invB,
        indiceQueEntra,
        custo: menorCusto,
    };
}
