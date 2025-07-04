import Problema from "./types/types";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";
import produtoInterno from "./utils/produtoInterno";

export function determinarVariavelQueSai(
    y: number[][], // vetor coluna (m x 1)
    xB: number[][] // vetor coluna (m x 1)
): { indiceQueSai: number | null; epsilon: number } {
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
        console.warn(
            "Problema ilimitado: nenhuma direção positiva encontrada."
        );
        return { indiceQueSai: null, epsilon: Infinity };
    }

    return { indiceQueSai: indiceMinimo, epsilon: minRazao };
}

export function atualizarBase(
    problema: Problema,
    posSai: number, // índice da variável que sai da base
    posEntra: number // índice da variável que entra na base
): void {
    const entra = problema.vnb[posEntra];
    const sai = problema.vb[posSai];

    // Troca os índices nas listas de variáveis
    problema.vb[posSai] = entra;
    problema.vnb[posEntra] = sai;
}

export function formarProblemaArtificial(p: Problema): Problema {
    const { A, b } = p;

    const m = b.length; // número de restrições
    const n = A[0].length;

    // Função objetivo artificial: 0 para as n variáveis originais, 1 para as m artificiais
    const c: number[] = [...Array(n).fill(0), ...Array(m).fill(1)];

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

export function calcularCustosRelativos(problema: Problema) {
    const { A, b, c, vb, vnb } = problema;

    const B = A.map((linha) => vb.map((j) => linha[j]));

    const invB = inversa(B);
    if (!invB)
        throw new Error("A matriz B não é inversível: \n" + JSON.stringify(B));

    const cB = vb.map((j) => c[j]);

    const lambdaT = multiplicarMatriz([cB], invB)[0];

    const custosRelativos: number[] = vnb.map((j) => {
        const aNj = A.map((linha) => linha[j]); // coluna j
        return c[j] - produtoInterno(lambdaT, aNj);
    });

    let indiceQueEntra: number | null = null;
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

export type SolucaoBasica = {
    x: number[];
    xB: number[];
    xN: number[];
};

export function calcularSolucaoBasica(problema: Problema): SolucaoBasica {
    const { A, b, vb, vnb } = problema;
    const n = A[0].length;

    // Matriz B com colunas da base
    const B = A.map((linha) => vb.map((j) => linha[j]));

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

    for (let i = 0; i < xB.length; i++) {
        if (xB[i] < -1e-8) {
            throw new Error(
                `Solução inviável: valor negativo em xB[${i}] = ${xB[i]}`
            );
        }
    }

    // xN são zeros
    const xN = Array(vnb.length).fill(0);

    // Monta o vetor x completo (xN = 0)
    const x: number[] = Array(n).fill(0);
    vb.forEach((indice, i) => {
        x[indice] = xB[i];
    });

    return { x, xB, xN };
}

export function calcularDirecaoSimplex(
    A: number[][],
    invB: number[][],
    indiceQueEntra: number,
    variaveisNaoBasicas: number[]
): number[][] {
    const variavelEntrante = variaveisNaoBasicas[indiceQueEntra];
    const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
    const aNkColuna = aNk.map((x) => [x]);
    const direcao = multiplicarMatriz(invB, aNkColuna);
    return direcao;
}
