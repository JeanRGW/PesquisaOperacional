import { readFileSync } from "fs";
import Problema from "../types";

function preparaEntrada(): string[][] {
    const rFile = readFileSync("test.txt", "utf-8");

    return rFile
        .split(/\r?\n/) // Divide em linhas
        .filter((x) => x.trim() !== "") // Remove linhas vazias
        .map((line) => line.split(" ")); // Quebra em elementos da linha
}

function extraiProblema(entrada: string[][]): Problema {
    const primeiraLinha = entrada.shift();
    if (!primeiraLinha) throw new Error("Erro na entrada.");

    const [maxMinStr, , , ...resto] = primeiraLinha;
    const isMax = maxMinStr.toLowerCase() === "max";

    let c = extraiFuncF(resto);
    let nVars = c.length;
    let ops: string[] = [];

    const A = montarMatriz(entrada, nVars);

    interpretaSinais(entrada, c, A, ops);

    const b: number[] = entrada.map((x) => parseFloat(x[0]));

    return {
        isMax,
        A,
        b,
        c,
        ops,
        n: A[0].length, // Numero de variáveis reais
        vb: [],
        vnb: [],
    };
}

function extraiFuncF(entrada: string[]): number[] {
    const funcF: number[] = [];

    let sinal = "+";
    for (const c of entrada) {
        if (c === "+" || c === "-") {
            sinal = c;
        } else {
            const split = c.split("x");
            const valor =
                split[0] === ""
                    ? 1
                    : split[0] === "-"
                    ? -1
                    : parseFloat(split[0]);
            funcF.push(sinal === "+" ? valor : valor * -1);
            sinal = "+";
        }
    }

    return funcF;
}

function montarMatriz(entrada: string[][], nVars: number): number[][] {
    const mat: number[][] = [];

    for (let i = 0; i < entrada.length; i++) {
        mat.push([]);

        for (let j = 0; j < nVars; j++) {
            mat[i].push(0);
        }
    }

    let linhaAtual = 0;
    for (const linha of entrada) {
        let sinal = "+";
        while (linha.length > 0 && !linha[0].match(/<|>|=/g)) {
            const c = linha.shift() as string;

            if (c === "+" || c === "-") {
                sinal = c;
            } else {
                const split = c.split("x");
                const valor =
                    split[0] === ""
                        ? 1
                        : split[0] === "-"
                        ? -1
                        : parseFloat(split[0]);
                const iVar = (parseInt(split[1]) - 1) as number;

                mat[linhaAtual][iVar] = sinal === "+" ? valor : valor * -1;
                sinal = "+";
            }
        }

        linhaAtual++;
    }

    return mat;
}

function interpretaSinais(
    entrada: string[][],
    vetorF: number[],
    mat: number[][],
    ops: string[]
): void {
    for (let i = 0; i < entrada.length; i++) {
        const c = entrada[i].shift() as string;
        ops.push(c);

        if (c !== "=") {
            const valor = c.match("<") ? 1 : -1;

            vetorF.push(0);

            for (let j = 0; j < entrada.length; j++) {
                if (j === i) {
                    mat[j].push(valor);
                } else {
                    mat[j].push(0);
                }
            }
        }
    }
}

export default function lerProblema(): Problema {
    const entrada = preparaEntrada();

    return extraiProblema(entrada);
}
