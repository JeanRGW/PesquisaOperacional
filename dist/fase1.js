"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.determinarVariavelQueSai = determinarVariavelQueSai;
exports.atualizarBase = atualizarBase;
exports.default = fase1;
const adicionarArtificiais_1 = __importDefault(require("./adicionarArtificiais"));
const fase2_1 = __importDefault(require("./fase2"));
const simplex_1 = require("./simplex");
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
function solucaoBasicaInicial(problemaArtificial) {
    const { A, variaveisBasicas } = problemaArtificial;
    const n = A[0].length;
    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
    console.log("Matriz B:", B);
    console.log("Vetor b:", problemaArtificial.b);
    const invB = (0, inversa_1.default)(B);
    if (!invB) {
        console.table(B);
        throw new Error(`A matriz B não é invertível.\n$`);
    }
    const xB = (0, multiplicarMatriz_1.default)(invB, problemaArtificial.b.map((x) => [x]));
    const x = Array(n).fill(0);
    variaveisBasicas.forEach((indice, i) => {
        x[indice] = xB[i][0];
    });
    return x;
}
// function calcularCustosReduzidos(problemaArtificial: ProblemaArtificial) {
//     const { A, b, variaveisBasicas, variaveisNaoBasicas, objetivo } =
//         problemaArtificial;
//     const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
//     const invB = inversa(B);
//     if (!invB) throw new Error(`A matriz B não é invertível.\n${B}`);
//     const cB = variaveisBasicas.map((j) => objetivo[j]);
//     // λ^T = cB^T * B⁻¹
//     const lambdaT = multiplicarMatriz([cB], invB)[0];
//     // Vetor de custos reduzidos (um para cada variável não-básica)
//     const custosRelativos: number[] = [];
//     for (const j of variaveisNaoBasicas) {
//         const aNj = A.map((linha) => linha[j]); // coluna j
//         const custoRelativo = objetivo[j] - produtoInterno(lambdaT, aNj);
//         custosRelativos.push(custoRelativo);
//     }
//     return { custosRelativos, lambdaT, invB };
// }
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
// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(A, invB, variavelEntrante) {
    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = (0, multiplicarMatriz_1.default)(invB, aNkColuna);
    console.log("Direção simplex (y):", direcao);
    return direcao;
}
function determinarVariavelQueSai(y, // vetor coluna (m x 1)
xB, // vetor coluna (m x 1)
variaveisBasicas) {
    var _a;
    let minRazao = Infinity;
    let indiceMinimo = -1;
    if (y.every(x => x[0] <= 0))
        console.log("Todas as direções são não positivas, problema inviável.");
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
    const sai = (_a = variaveisBasicas[indiceMinimo]) !== null && _a !== void 0 ? _a : null;
    return { sai, epsilon: minRazao };
}
function atualizarBase(problema, sai, // índice da variável que sai da base
entra // índice da variável que entra na base
) {
    const posSai = problema.variaveisBasicas.indexOf(sai);
    const posEntra = problema.variaveisNaoBasicas.indexOf(entra);
    if (posSai === -1 || posEntra === -1) {
        throw new Error("Erro ao atualizar base: índices inválidos.");
    }
    // Troca os índices nas listas de variáveis
    problema.variaveisBasicas[posSai] = entra;
    problema.variaveisNaoBasicas[posEntra] = sai;
}
function removerVariaveisArtificiais(problema, numOriginais) {
    const indicesArtificiais = [];
    for (let j = numOriginais; j < problema.A[0].length; j++) {
        indicesArtificiais.push(j);
    }
    // Remove colunas de A
    problema.A = problema.A.map((linha) => linha.filter((_, j) => j < numOriginais));
    // Remove variáveis artificiais das listas
    problema.variaveisBasicas = problema.variaveisBasicas.filter((j) => j < numOriginais);
    problema.variaveisNaoBasicas = problema.variaveisNaoBasicas.filter((j) => j < numOriginais);
}
function fase1(problema) {
    const n = problema.c.length;
    const cOrigianis = [...problema.c];
    const problemaArtificial = (0, adicionarArtificiais_1.default)(problema.A, problema.b);
    const maxIt = 1000;
    let it = 1;
    let artificiaisNaBase = true;
    do {
        console.log(`Iteração ${it}`);
        const x = solucaoBasicaInicial(problemaArtificial);
        console.log("Solução Básica Inicial:", x);
        const { custosRelativos, lambdaT, invB } = (0, simplex_1.calcularCustosRelativos)(problemaArtificial);
        console.log("Custos Reduzidos:", custosRelativos);
        const { entra, custo } = escolherVariavelQueEntra(custosRelativos, problemaArtificial.variaveisNaoBasicas);
        const status = testeOtimalidadeFase1(custo, problemaArtificial.variaveisBasicas, problema.A[0].length);
        console.log(status);
        if (status === "continua" && entra !== null) {
            const y = calcularDirecaoSimplex(problemaArtificial.A, invB, entra);
            if (y.every((val) => val[0] <= 0))
                throw new Error("Problema não tem solução ótima finita, problema original infactível");
            const xB = problemaArtificial.variaveisBasicas
                .map((j) => x[j])
                .map((val) => [val]);
            console.log("xB: " + xB);
            const { sai, epsilon } = determinarVariavelQueSai(y, xB, problemaArtificial.variaveisBasicas);
            if (!sai) {
                throw new Error("Não foi possível determinar a variável que sai da base.");
            }
            console.log(`Variável que sai da base: x_${sai}, razão mínima ε = ${epsilon}`);
            atualizarBase(problemaArtificial, sai, entra);
            if (!problemaArtificial.variaveisBasicas.some((j) => j >= n))
                artificiaisNaBase = false;
            it++;
        }
        else {
            if (status === "fase2") {
                console.log("Iniciando Fase II com a base atual.");
            }
            else if (status === "inviavel") {
                throw new Error("Problema inviável: não é possível encontrar uma solução.");
            }
            else {
                throw new Error("Isso não devia chegar aqui.");
            }
        }
    } while (artificiaisNaBase && it < maxIt);
    console.log(problemaArtificial.variaveisBasicas);
    console.log(problemaArtificial.variaveisNaoBasicas);
    console.log("Base inicial encontrada para Fase 2: " +
        problemaArtificial.variaveisBasicas);
    removerVariaveisArtificiais(problemaArtificial, n);
    problemaArtificial.objetivo = cOrigianis;
    return (0, fase2_1.default)(problemaArtificial);
}
