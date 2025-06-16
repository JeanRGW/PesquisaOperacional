"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fase2;
const simplex_1 = require("./simplex");
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
        console.log(`\nIteração ${it} da fase 2:`);
        solucaoBasica = (0, simplex_1.calcularSolucaoBasica)(problema);
        const resultadoCustos = (0, simplex_1.calcularCustosRelativos)(problema);
        if (resultadoCustos.indiceQueEntra === null) {
            console.log("Solução ótima encontrada");
            break;
        }
        else {
            const direcao = (0, simplex_1.calcularDirecaoSimplex)(problema.A, resultadoCustos.invB, resultadoCustos.indiceQueEntra, problema.vnb);
            const xB = problema.vb
                .map((j) => solucaoBasica.x[j])
                .map((val) => [val]);
            const { indiceQueSai, epsilon } = (0, simplex_1.determinarVariavelQueSai)(direcao, xB);
            if (indiceQueSai === null) {
                return "ilimitado";
            }
            console.log(`Variável que sai da base: X${problema.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`);
            (0, simplex_1.atualizarBase)(problema, indiceQueSai, resultadoCustos.indiceQueEntra);
            it++;
        }
    } while (it < maxIt);
    console.log("Fase 2 concluída.");
    const z = calcularValorObjetivo(solucaoBasica.x, problema.c);
    return { solucaoBasica, z };
}
