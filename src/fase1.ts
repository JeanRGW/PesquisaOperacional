import fase2 from "./fase2";
import {
    formarProblemaArtificial,
    calcularCustosRelativos,
    calcularSolucaoBasica,
    calcularDirecaoSimplex,
    determinarVariavelQueSai,
    atualizarBase,
    SolucaoBasica,
} from "./simplex";
import Problema from "./types/types";

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
            return "inviavel";
        } else {
            console.log(
                "Fase I concluída com sucesso. Prosseguir para Fase II."
            );
            return "fase2";
        }
    }
    return "continua";
}

function removerVariaveisArtificiais(problema: Problema) {
    const { n } = problema; // número de variáveis originais

    const indicesArtificiais = [];
    for (let j = n; j < problema.A[0].length; j++) {
        indicesArtificiais.push(j);
    }

    // Remove colunas de A
    problema.A = problema.A.map((linha) => linha.filter((_, j) => j < n));

    // Remove variáveis artificiais das listas de índices
    problema.vb = problema.vb.filter((j) => j < n);
    problema.vnb = problema.vnb.filter((j) => j < n);
}

export default function fase1(
    problema: Problema
): { solucaoBasica: SolucaoBasica; z: number } | "infactível" | "ilimitado" {
    const n = problema.c.length;
    const problemaArtificial = formarProblemaArtificial(problema);
    const maxIt = 1000;
    let it = 1;

    do {
        console.log(`\nIteração ${it} da fase 1:`);
        const { x } = calcularSolucaoBasica(problemaArtificial);

        const { custosRelativos, lambdaT, invB, indiceQueEntra, custo } =
            calcularCustosRelativos(problemaArtificial);

        const status = testeOtimalidadeFase1(
            custo,
            problemaArtificial.vb,
            problema.A[0].length
        );

        if (status === "inviavel") {
            return "infactível";
        }

        if (status === "fase2") {
            console.log(
                "Base inicial encontrada para Fase 2: " + problemaArtificial.vb
            );

            removerVariaveisArtificiais(problemaArtificial);

            problema.vb = problemaArtificial.vb;
            problema.vnb = problemaArtificial.vnb;

            return fase2(problema);
        }

        const y = calcularDirecaoSimplex(
            problemaArtificial.A,
            invB,
            indiceQueEntra!,
            problemaArtificial.vnb
        );

        if (y.every((val) => val[0] <= 0))
            throw new Error(
                "Problema não tem solução ótima finita, problema original infactível"
            );

        const xB = problemaArtificial.vb.map((j) => x[j]).map((val) => [val]);

        const { indiceQueSai, epsilon } = determinarVariavelQueSai(y, xB);

        if (indiceQueSai === null) {
            console.log(
                "Não foi possível determinar a variável que sai da base."
            );

            return "ilimitado";
        }

        console.log(
            `Variável que sai da base: X${problemaArtificial.vb[indiceQueSai]}, razão mínima ε = ${epsilon}`
        );

        atualizarBase(problemaArtificial, indiceQueSai, indiceQueEntra!);

        it++;
    } while (it < maxIt);

    throw new Error("Iteração máxima excedida na fase 1");
}
