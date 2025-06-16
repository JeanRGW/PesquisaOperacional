import fase2 from "./fase2";
import { formarProblemaArtificial, calcularCustosRelativos, calcularSolucaoBasica, calcularDirecaoSimplex } from "./simplex";
import multiplicarMatriz from "./utils/multiplicarMatriz";
import Problema from "./types/types";

// Passo 2.3: Determinar qual variável entra na base
function escolherVariavelQueEntra(
    custosRelativos: number[],
    variaveisNaoBasicas: number[]
) {
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
function testeOtimalidadeFase1(
    custoMinimo: number,
    variaveisBasicas: number[],
    numVariaveisOriginais: number
): "inviavel" | "continua" | "fase2" {
    if (custoMinimo >= 0) {
        const artificiaisNaBase = variaveisBasicas.some(
            (j) => j >= numVariaveisOriginais
        );
        if (artificiaisNaBase) {
            console.log(
                "Problema inviável: ainda há variáveis artificiais na base."
            );
            return "inviavel";
        } else {
            console.log(
                "Fase I concluída com sucesso. Prosseguir para Fase II."
            );
            return "fase2";
        }
    }
    return "continua"; // Caso contrário, segue com o algoritmo (ainda não ótimo)
}

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

function removerVariaveisArtificiais(problema: Problema) {
    const { n } = problema; // número de variáveis originais

    const indicesArtificiais = [];
    for (let j = n; j < problema.A[0].length; j++) {
        indicesArtificiais.push(j);
    }

    // Remove colunas de A
    problema.A = problema.A.map((linha) => linha.filter((_, j) => j < n));

    // Remove variáveis artificiais das listas
    problema.vb = problema.vb.filter((j) => j < n);
    problema.vnb = problema.vnb.filter((j) => j < n);
}

export default function fase1(
    problema: Problema
): number | "infactível" | "ilimitado" {
    const n = problema.c.length;
    const cOrigianis = [...problema.c];
    const problemaArtificial = formarProblemaArtificial(problema);
    const maxIt = 1000;
    let it = 1;
    let artificiaisNaBase = true;

    do {
        console.log(`Iteração ${it} da fase 1:`);
        const {x} = calcularSolucaoBasica(problemaArtificial);

        console.log("Solução Básica Inicial:", x);

        const { custosRelativos, lambdaT, invB, indiceQueEntra, custo } =
            calcularCustosRelativos(problemaArtificial);

        console.log("Custos Reduzidos:", custosRelativos);

        const status = testeOtimalidadeFase1(
            custo,
            problemaArtificial.vb,
            problema.A[0].length
        );

        console.log(status);

        if (status === "continua" && indiceQueEntra !== null) {
            const y = calcularDirecaoSimplex(
                problemaArtificial.A,
                invB,
                indiceQueEntra,
                problemaArtificial.vnb
            );

            if (y.every((val) => val[0] <= 0))
                throw new Error(
                    "Problema não tem solução ótima finita, problema original infactível"
                );

            const xB = problemaArtificial.vb
                .map((j) => x[j])
                .map((val) => [val]);

            console.log("xB: " + xB);

            const { indiceQueSai, epsilon } = determinarVariavelQueSai(y, xB);

            if (indiceQueSai === null) {
                console.log(
                    "Não foi possível determinar a variável que sai da base."
                );

                return "ilimitado";
            }
            console.log(
                `Variável que sai da base: x_${problemaArtificial.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`
            );

            atualizarBase(problemaArtificial, indiceQueSai, indiceQueEntra);
            if (!problemaArtificial.vb.some((j) => j >= n))
                artificiaisNaBase = false;

            it++;
        } else {
            if (status === "fase2") {
                console.log("Iniciando Fase II com a base atual.");
            } else if (status === "inviavel") {
                console.log(
                    "Problema inviável: não é possível encontrar uma solução."
                );

                return "infactível";
            } else {
                throw new Error("Isso não devia chegar aqui.");
            }
        }
    } while (artificiaisNaBase && it < maxIt);

    console.log(problemaArtificial.vb);
    console.log(problemaArtificial.vnb);

    console.log(
        "Base inicial encontrada para Fase 2: " + problemaArtificial.vb
    );

    removerVariaveisArtificiais(problemaArtificial);
    problemaArtificial.c = cOrigianis;
    return fase2(problemaArtificial);
}
