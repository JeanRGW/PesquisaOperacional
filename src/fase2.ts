import { atualizarBase, determinarVariavelQueSai } from "./fase1";
import { calcularCustosRelativos } from "./simplex";
import Problema from "./types";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";

type SolucaoBasica = {
    x: number[];
    xB: number[];
    xN: number[];
};

function calcularSolucaoBasica(problema: Problema): SolucaoBasica {
    const { A, b, vb, vnb } = problema;
    const n = A[0].length;

    // Matriz B com colunas da base
    const B = A.map((linha) => vb.map((j) => linha[j]));
    console.table(B);
    console.log(vb);

    const invB = inversa(B);

    console.table(invB);

    if (!invB) {
        console.table(B);
        throw new Error("A matriz B não é invertível.");
    }

    // Resolve xB = invB * b
    const xB = multiplicarMatriz(
        invB,
        b.map((v) => [v])
    ).map((x) => x[0]);

    for (let i = 0; i < xB.length; i++) {
        if (xB[i] < -1e-8) {
            throw new Error(
                `Solução inviável: valor negativo em xB[${i}] = ${xB[i]}`
            );
        }
    }

    console.log(xB);

    // xN são zeros
    const xN = Array(vnb.length).fill(0);

    // Monta o vetor x completo (xN = 0)
    const x: number[] = Array(n).fill(0);
    vb.forEach((indice, i) => {
        x[indice] = xB[i];
    });

    return { x, xB, xN };
}

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

    console.table(B);

    const { n } = problema;
    const maxIt = 1000;
    let it = 1;

    let solucaoBasica: SolucaoBasica | null = null;

    do {
        console.log(`Iteração ${it} da fase 2`);

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
