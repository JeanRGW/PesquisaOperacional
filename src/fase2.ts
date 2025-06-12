import { ProblemaArtificial } from "./adicionarArtificiais";
import encontraBeNB from "./encontrarBeNB";
import { Problema } from "./lerProblema";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";

function produtoEscalar(v1: number[], v2: number[]): number {
    return v1.reduce((soma, v, i) => soma + v * v2[i], 0);
}

type SolucaoBasica = {
    x: number[];
    xB: number[];
    xN: number[];
};

function calcularSolucaoBasica(problema: ProblemaArtificial): SolucaoBasica {
    const { A, b, variaveisBasicas, variaveisNaoBasicas } = problema;
    const n = A[0].length;

    // Matriz B com colunas da base
    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));

    const invB = inversa(B);
    if (!invB) {
        console.table(B);
        throw new Error("A matriz B não é invertível.");
    }

    // Resolve xB = invB * b
    const xB = multiplicarMatriz(
        invB,
        b.map((v) => [v])
    ).map((x) => x[0]);

    // xN são zeros
    const xN = Array(variaveisNaoBasicas.length).fill(0);

    // Monta o vetor x completo (xN = 0)
    const x: number[] = Array(n).fill(0);
    variaveisBasicas.forEach((indice, i) => {
        x[indice] = xB[i];
    });

    return { x, xB, xN };
}

type ResultadoCustos = {
    lambda: number[];
    custosReduzidos: number[];
    indiceQueEntra: number | null;
};

function calcularCustosReduzidos(
    problemaArtificial: ProblemaArtificial
): ResultadoCustos {
    // 2.1) Calcular λ^T = cB^T * inv(B)
    const { A, b, variaveisBasicas, variaveisNaoBasicas } = problemaArtificial;
    const c = problemaArtificial.objetivo;

    const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
    const invB = inversa(B);

    if (!invB) {
        console.table(B);
        throw new Error("A matriz B não é invertível.");
    }

    const cB = variaveisBasicas.map((j) => c[j]);
    const lambdaT = multiplicarMatriz([cB], invB)[0];

    // 2.2) Custos reduzidos: ĉ_Nj = c_Nj - λ^T * a_Nj
    const custosReduzidos = variaveisNaoBasicas.map((j) => {
        const aNj = A.map((linha) => linha[j]);
        const lambdaTAj = produtoEscalar(lambdaT, aNj);
        return c[j] - lambdaTAj;
    });

    // 2.3) Determinar a variável que entra na base (mínimo custo reduzido)
    let indiceQueEntra: number | null = null;
    let menorCusto = 0;
    for (let i = 0; i < custosReduzidos.length; i++) {
        if (custosReduzidos[i] < menorCusto) {
            menorCusto = custosReduzidos[i];
            indiceQueEntra = i;
        }
    }

    return {
        lambda: lambdaT,
        custosReduzidos,
        indiceQueEntra,
    };
}

// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(
    A: number[][],
    invB: number[][],
    variavelEntrante: number
): number[][] {
    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = multiplicarMatriz(invB, aNkColuna);
    console.log("Direção simplex (y):", direcao);
    return direcao;
}

function calcularValorObjetivo(c: number[], x: number[]): number {
    return c.reduce((soma, coef, i) => soma + coef * x[i], 0);
}

export default function fase2(problema: ProblemaArtificial) {
    const solucaoBasica = calcularSolucaoBasica(problema);
    const resultadoCustos = calcularCustosReduzidos(problema);

    if (resultadoCustos.indiceQueEntra === null) {
        console.log("Solução ótima encontrada:");
        console.log(solucaoBasica.x);
        console.log(problema.objetivo);
        const z = calcularValorObjetivo(solucaoBasica.x, problema.objetivo);
        console.log("Valor da função objetivo:", z);
    }
}
