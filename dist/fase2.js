"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fase2;
const fase1_1 = require("./fase1");
const simplex_1 = require("./simplex");
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
function calcularSolucaoBasica(problema) {
    const { A, b, variaveisBasicas, variaveisNaoBasicas } = problema;
    const n = A[0].length;
    // Matriz B com colunas da base
    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
    const invB = (0, inversa_1.default)(B);
    if (!invB) {
        console.table(B);
        throw new Error("A matriz B não é invertível.");
    }
    // Resolve xB = invB * b
    const xB = (0, multiplicarMatriz_1.default)(invB, b.map((v) => [v])).map((x) => x[0]);
    // xN são zeros
    const xN = Array(variaveisNaoBasicas.length).fill(0);
    // Monta o vetor x completo (xN = 0)
    const x = Array(n).fill(0);
    variaveisBasicas.forEach((indice, i) => {
        x[indice] = xB[i];
    });
    return { x, xB, xN };
}
// function calcularCustosReduzidos(
//     problemaArtificial: ProblemaArtificial
// ): ResultadoCustos {
//     // 2.1) Calcular λ^T = cB^T * inv(B)
//     const { A, b, objetivo, variaveisBasicas, variaveisNaoBasicas } = problemaArtificial;
//     const c = problemaArtificial.objetivo;
//     const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
//     const invB = inversa(B);
//     if (!invB) {
//         console.table(B);
//         throw new Error("A matriz B não é invertível.");
//     }
//     const cB = variaveisBasicas.map((j) => c[j]);
//     const lambdaT = multiplicarMatriz([cB], invB)[0];
//     // 2.2) Custos reduzidos: ĉ_Nj = c_Nj - λ^T * a_Nj
//     const custosReduzidos = variaveisNaoBasicas.map((j) => {
//         const aNj = A.map((linha) => linha[j]);
//         const lambdaTAj = objetivo[j] - produtoInterno(lambdaT, aNj);
//         return c[j] - lambdaTAj;
//     });
//     // 2.3) Determinar a variável que entra na base (mínimo custo reduzido)
//     let indiceQueEntra: number | null = null;
//     let menorCusto = 0;
//     for (let i = 0; i < custosReduzidos.length; i++) {
//         if (custosReduzidos[i] < menorCusto) {
//             menorCusto = custosReduzidos[i];
//             indiceQueEntra = i;
//         }
//     }
//     return {
//         lambda: lambdaT,
//         custosReduzidos,
//         indiceQueEntra,
//     };
// }
// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(A, invB, variavelEntrante) {
    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = (0, multiplicarMatriz_1.default)(invB, aNkColuna);
    console.log("Direção simplex (y):", direcao);
    return direcao;
}
function calcularValorObjetivo(c, x) {
    return c.reduce((soma, coef, i) => soma + coef * x[i], 0);
}
function fase2(problema) {
    const n = problema.objetivo.length;
    const maxIt = 1000;
    let it = 1;
    do {
        console.log(`Iteração ${it} da fase 2`);
        const solucaoBasica = calcularSolucaoBasica(problema);
        const resultadoCustos = (0, simplex_1.calcularCustosRelativos)(problema);
        if (resultadoCustos.indiceQueEntra === null) {
            console.log("Solução ótima encontrada:");
            console.log(solucaoBasica.x);
            console.log(problema.objetivo);
            const z = calcularValorObjetivo(solucaoBasica.x, problema.objetivo);
            console.log("Valor da função objetivo:", z);
            break;
        }
        else {
            const direcao = calcularDirecaoSimplex(problema.A, resultadoCustos.invB, resultadoCustos.indiceQueEntra);
            const xB = problema.variaveisBasicas.map((j) => solucaoBasica.x[j]).map((val) => [val]);
            const { sai, epsilon } = (0, fase1_1.determinarVariavelQueSai)(direcao, xB, problema.variaveisBasicas);
            console.log("Epsilon: " + epsilon);
            if (!sai) {
                throw new Error("Não foi possível determinar a variável que sai da base.");
            }
            console.log(`Variável que sai da base: x_${sai}, razão mínima ε = ${epsilon}`);
            (0, fase1_1.atualizarBase)(problema, sai, resultadoCustos.indiceQueEntra);
            it++;
        }
    } while (it < maxIt);
}
