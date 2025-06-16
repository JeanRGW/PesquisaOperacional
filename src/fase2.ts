import { atualizarBase, determinarVariavelQueSai } from "./fase1";
import { calcularCustosRelativos, calcularSolucaoBasica, SolucaoBasica } from "./simplex";
import Problema from "./types/types";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";


// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(
    A: number[][],
    invB: number[][],
    indiceQueEntra: number,
    variaveisNaoBasicas: number[]
): number[][] {
    const variavelEntrante = variaveisNaoBasicas[indiceQueEntra];
    console.log(variavelEntrante);

    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = multiplicarMatriz(invB, aNkColuna);
    console.log("Direção simplex (y):", direcao);
    return direcao;
}

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
        console.log(`Iteração ${it} da fase 2:`);

        solucaoBasica = calcularSolucaoBasica(problema);
        const resultadoCustos = calcularCustosRelativos(problema);

        if (resultadoCustos.indiceQueEntra === null) {
            console.log("Solução ótima encontrada:");
            console.log(solucaoBasica.x);
            console.log(problema.c);
            const z = calcularValorObjetivo(solucaoBasica.x, problema.c);
            console.log("Valor da função objetivo:", z);
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

            console.log("Epsilon: " + epsilon);
            console.log("Logs ultra sérios");
            console.log(
                problema.vb[indiceQueSai!],
                problema.vnb[resultadoCustos.indiceQueEntra]
            );

            if (indiceQueSai === null) {
                return "ilimitado";
            }
            console.log(
                `Variável que sai da base: x_${problema.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`
            );

            atualizarBase(
                problema,
                indiceQueSai,
                resultadoCustos.indiceQueEntra
            );

            it++;
        }
    } while (it < maxIt);

    console.log("Fase 2 concluída. Fé");
    console.log(solucaoBasica);

    return calcularValorObjetivo(solucaoBasica.x, problema.c);
}
