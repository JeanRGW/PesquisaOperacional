"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fase1;
const adicionarArtificiais_1 = __importDefault(require("./adicionarArtificiais"));
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
// Produto interno entre dois vetores
function produtoInterno(v1, v2) {
    return v1.reduce((soma, val, i) => soma + val * v2[i], 0);
}
function solucaoBasicaInicial(problemaArtificial) {
    const { A, variaveisBasicas } = problemaArtificial;
    const n = A[0].length;
    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
    const invB = (0, inversa_1.default)(B, problemaArtificial.b);
    if (!invB)
        throw new Error(`A matriz B não é invertível.\n${B}`);
    const xB = (0, multiplicarMatriz_1.default)(invB, problemaArtificial.b.map((x) => [x]));
    const x = Array(n).fill(0);
    variaveisBasicas.forEach((indice, i) => {
        x[indice] = xB[i][0];
    });
    return x;
}
function calcularCustosReduzidos(problemaArtificial) {
    const { A, b, variaveisBasicas, variaveisNaoBasicas, objetivo } = problemaArtificial;
    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
    const invB = (0, inversa_1.default)(B, b);
    if (!invB)
        throw new Error(`A matriz B não é invertível.\n${B}`);
    const cB = variaveisBasicas.map((j) => objetivo[j]);
    // λ^T = cB^T * B⁻¹
    const lambdaT = (0, multiplicarMatriz_1.default)([cB], invB)[0];
    // Vetor de custos reduzidos (um para cada variável não-básica)
    const custosRelativos = [];
    for (const j of variaveisNaoBasicas) {
        const aNj = A.map((linha) => linha[j]); // coluna j
        const custoRelativo = objetivo[j] - produtoInterno(lambdaT, aNj);
        custosRelativos.push(custoRelativo);
    }
    return { custosRelativos, lambdaT, invB };
}
// Passo 2.3: Determinar qual variável entra na base
function escolherVariavelQueEntra(custosRelativos, variaveisNaoBasicas) {
    let minCusto = Infinity;
    let indice = -1;
    custosRelativos.forEach((custo, i) => {
        if (custo < minCusto) {
            minCusto = custo;
            indice = i;
        }
    });
    const entra = minCusto < 0 ? variaveisNaoBasicas[indice] : null;
    return { entra, custo: minCusto };
}
// Passo 3: Teste de Otimalidade da Fase I
function testeOtimalidadeFase1(custoMinimo, variaveisBasicas, numVariaveisOriginais) {
    if (custoMinimo >= 0) {
        const artificiaisNaBase = variaveisBasicas.some((j) => j >= numVariaveisOriginais);
        if (artificiaisNaBase) {
            console.log("Problema inviável: ainda há variáveis artificiais na base.");
            return "inviavel";
        }
        else {
            console.log("Fase I concluída com sucesso. Prosseguir para Fase II.");
            return "fase2";
        }
    }
    return "continua"; // Caso contrário, segue com o algoritmo (ainda não ótimo)
}
function calcularDirecaoSimplex(A, invB, variavelEntrante) {
    const aNk = A.map(linha => linha[variavelEntrante]); // a_{Nk}
    const aNkColuna = aNk.map(x => [x]); // transforma em matriz coluna
    const y = (0, multiplicarMatriz_1.default)(invB, aNkColuna);
    console.log(y);
    return y;
}
function fase1(problema) {
    const problemaArtificial = (0, adicionarArtificiais_1.default)(problema.mat, problema.ind);
    const x = solucaoBasicaInicial(problemaArtificial);
    const { custosRelativos, lambdaT, invB } = calcularCustosReduzidos(problemaArtificial);
    const { entra, custo } = escolherVariavelQueEntra(custosRelativos, problemaArtificial.variaveisNaoBasicas);
    const status = testeOtimalidadeFase1(custo, problemaArtificial.variaveisBasicas, problema.mat[0].length);
    console.log("Solução Básica Inicial:", x);
    console.log("Custos Reduzidos:", custosRelativos);
    console.log(status);
    if (entra !== null) {
        const y = calcularDirecaoSimplex(problemaArtificial.A, invB, entra);
        console.log("Direção simplex (y):", y);
    }
}
