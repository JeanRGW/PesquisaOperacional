"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fase2;
const fase1_1 = require("./fase1");
const simplex_1 = require("./simplex");
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(A, invB, indiceQueEntra, variaveisNaoBasicas) {
    const variavelEntrante = variaveisNaoBasicas[indiceQueEntra];
    console.log(variavelEntrante);
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
    console.log("Indices:", problema.vb, problema.vnb);
    const B = problema.A.map((linha) => problema.vb.map((j) => linha[j]));
    const { n } = problema;
    const maxIt = 1000;
    let it = 1;
    let solucaoBasica = null;
    do {
        console.log(`Iteração ${it} da fase 2:`);
        solucaoBasica = (0, simplex_1.calcularSolucaoBasica)(problema);
        const resultadoCustos = (0, simplex_1.calcularCustosRelativos)(problema);
        if (resultadoCustos.indiceQueEntra === null) {
            console.log("Solução ótima encontrada:");
            console.log(solucaoBasica.x);
            console.log(problema.c);
            const z = calcularValorObjetivo(solucaoBasica.x, problema.c);
            console.log("Valor da função objetivo:", z);
            break;
        }
        else {
            const direcao = calcularDirecaoSimplex(problema.A, resultadoCustos.invB, resultadoCustos.indiceQueEntra, problema.vnb);
            const xB = problema.vb
                .map((j) => solucaoBasica.x[j])
                .map((val) => [val]);
            const { indiceQueSai, epsilon } = (0, fase1_1.determinarVariavelQueSai)(direcao, xB);
            console.log("Epsilon: " + epsilon);
            console.log("Logs ultra sérios");
            console.log(problema.vb[indiceQueSai], problema.vnb[resultadoCustos.indiceQueEntra]);
            if (indiceQueSai === null) {
                return "ilimitado";
            }
            console.log(`Variável que sai da base: x_${problema.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`);
            (0, fase1_1.atualizarBase)(problema, indiceQueSai, resultadoCustos.indiceQueEntra);
            it++;
        }
    } while (it < maxIt);
    console.log("Fase 2 concluída. Fé");
    console.log(solucaoBasica);
    return calcularValorObjetivo(solucaoBasica.x, problema.c);
}
