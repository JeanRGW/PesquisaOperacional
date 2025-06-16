import {
    atualizarBase,
    calcularCustosRelativos,
    calcularSolucaoBasica,
    SolucaoBasica,
    determinarVariavelQueSai,
    calcularDirecaoSimplex,
} from "./simplex";
import Problema from "./types/types";

function calcularValorObjetivo(c: number[], x: number[]): number {
    return c.reduce((soma, coef, i) => soma + coef * x[i], 0);
}

export default function fase2(problema: Problema) {
    console.log("Indices:", problema.vb, problema.vnb);
    const B = problema.A.map((linha) => problema.vb.map((j) => linha[j]));

    const { n } = problema;
    const maxIt = 1000;
    let it = 1;

    let solucaoBasica: SolucaoBasica | null = null;

    do {
        console.log(`\nIteração ${it} da fase 2:`);

        solucaoBasica = calcularSolucaoBasica(problema);
        const resultadoCustos = calcularCustosRelativos(problema);

        if (resultadoCustos.indiceQueEntra === null) {
            console.log("Solução ótima encontrada");
            break;
        } else {
            const direcao = calcularDirecaoSimplex(
                problema.A,
                resultadoCustos.invB,
                resultadoCustos.indiceQueEntra,
                problema.vnb
            );

            const xB = problema.vb
                .map((j) => solucaoBasica!.x[j])
                .map((val) => [val]);

            const { indiceQueSai, epsilon } = determinarVariavelQueSai(
                direcao,
                xB
            );

            if (indiceQueSai === null) {
                return "ilimitado";
            }
            console.log(
                `Variável que sai da base: X${problema.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`
            );

            atualizarBase(
                problema,
                indiceQueSai,
                resultadoCustos.indiceQueEntra
            );

            it++;
        }
    } while (it < maxIt);

    console.log("Fase 2 concluída.");

    const z = calcularValorObjetivo(solucaoBasica.x, problema.c);
    return { solucaoBasica, z };
}
