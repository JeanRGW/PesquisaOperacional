"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinarVariavelQueSai = determinarVariavelQueSai;
exports.atualizarBase = atualizarBase;
exports.formarProblemaArtificial = formarProblemaArtificial;
exports.calcularCustosRelativos = calcularCustosRelativos;
exports.calcularSolucaoBasica = calcularSolucaoBasica;
exports.calcularDirecaoSimplex = calcularDirecaoSimplex;
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
const produtoInterno_1 = __importDefault(require("./utils/produtoInterno"));
function determinarVariavelQueSai(y, // vetor coluna (m x 1)
xB // vetor coluna (m x 1)
) {
    let minRazao = Infinity;
    let indiceMinimo = -1;
    for (let i = 0; i < y.length; i++) {
        const yi = y[i][0];
        if (yi > 0) {
            const razao = xB[i][0] / yi;
            if (razao < minRazao) {
                minRazao = razao;
                indiceMinimo = i;
            }
        }
    }
    // Nenhuma razão válida -> problema ilimitado
    if (indiceMinimo === -1) {
        console.warn("Problema ilimitado: nenhuma direção positiva encontrada.");
        return { indiceQueSai: null, epsilon: Infinity };
    }
    return { indiceQueSai: indiceMinimo, epsilon: minRazao };
}
function atualizarBase(problema, posSai, // índice da variável que sai da base
posEntra // índice da variável que entra na base
) {
    const entra = problema.vnb[posEntra];
    const sai = problema.vb[posSai];
    // Troca os índices nas listas de variáveis
    problema.vb[posSai] = entra;
    problema.vnb[posEntra] = sai;
}
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
function calcularSolucaoBasica(problema) {
    const { A, b, vb, vnb } = problema;
    const n = A[0].length;
    // Matriz B com colunas da base
    const B = A.map((linha) => vb.map((j) => linha[j]));
    const invB = (0, inversa_1.default)(B);
    if (!invB) {
        console.table(B);
        throw new Error("A matriz B não é invertível.");
    }
    // Resolve xB = invB * b
    const xB = (0, multiplicarMatriz_1.default)(invB, b.map((v) => [v])).map((x) => x[0]);
    for (let i = 0; i < xB.length; i++) {
        if (xB[i] < -1e-8) {
            throw new Error(`Solução inviável: valor negativo em xB[${i}] = ${xB[i]}`);
        }
    }
    // xN são zeros
    const xN = Array(vnb.length).fill(0);
    // Monta o vetor x completo (xN = 0)
    const x = Array(n).fill(0);
    vb.forEach((indice, i) => {
        x[indice] = xB[i];
    });
    return { x, xB, xN };
}
function calcularDirecaoSimplex(A, invB, indiceQueEntra, variaveisNaoBasicas) {
    const variavelEntrante = variaveisNaoBasicas[indiceQueEntra];
    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = (0, multiplicarMatriz_1.default)(invB, aNkColuna);
    return direcao;
}
