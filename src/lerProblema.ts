import { readFileSync } from "fs";
import Problema from "./types";

const objectiveRegex = /(Min|Max).*=\s*/i;
const termsRegex = /([+-]?\d*\.?\d*)x(\d+)/g;
const constraintRegex = /.*\d+\s*([<>=]+)\s*([-+]?\s?\d+\.?\d*)/;

function prepareInput(): string[] {
    const rFile = readFileSync("test.txt", "utf-8");

    return rFile
        .split(/\r?\n/) // Quebrar linhas
        .filter((x) => x.trim() !== "") // Remover linhas vazias
        .map((x) => x.replace(/\s/g, "").replace(",", ".")); // Remover espaços
}

function parseObjective(input: string[]): {
    nVars: number;
    isMax: boolean;
    c: number[];
} {
    const objectiveInput = input.shift()!;

    const objectiveMatch = objectiveInput.match(objectiveRegex)!;
    console.log(objectiveMatch);
    const isMax = objectiveMatch[1].toLowerCase() === "max";

    const remainingObjective = objectiveInput.slice(objectiveMatch[0].length);
    const objectiveTerms: {
        value: number;
        index: number;
    }[] = [...remainingObjective.matchAll(termsRegex)].map((match) =>
        Object({
            value:
                match[1] === "" || match[1] === "+"
                    ? 1
                    : match[1] === "-"
                    ? -1
                    : parseFloat(match[1]),
            index: match[2],
        })
    );

    const nVars = Math.max(...objectiveTerms.map((x) => x.index));
    if (objectiveTerms.length !== nVars)
        throw new Error("A função objetivo pulou ou faltou alguma variável");

    const c = objectiveTerms
        .sort((a, b) => a.index - b.index)
        .map((x) => x.value);

    return {
        nVars,
        isMax,
        c,
    };
}

function parseConstraints(input: string[], nVars: number) {
    const A: number[][] = [];
    const b: number[] = [];
    const ops: string[] = [];

    input.forEach((line) => {
        const [, operator, value] = line.match(constraintRegex)!;
        const terms = [...line.matchAll(termsRegex)]
            .map((match) =>
                Object({
                    value:
                        match[1] === "" || match[1] === "+"
                            ? 1
                            : match[1] === "-"
                            ? -1
                            : parseFloat(match[1]),
                    index: match[2],
                })
            )
            .sort((a, b) => a.index - b.index);

        const ALine = Array(nVars).fill(0);
        terms.forEach((x) => {
            ALine[x.index - 1] = x.value;
        });

        A.push(ALine);
        b.push(parseFloat(value));
        ops.push(operator);
    });

    return {
        A,
        b,
        ops,
    };
}

function handleOperators(A: number[][], c: number[], ops: string[]){
    ops.forEach((op, i) => {
        const value = op.match("<")? 1 : op.match(">")? -1 : null

        if(value !== null){
            A.forEach((l, j) => {
                l.push(j === i? value : 0)
            })

            c.push(0)
        }
    })
};

export default function lerProblema(): Problema | null {
    try {
        const input = prepareInput();

        const { isMax, c, nVars } = parseObjective(input);

        const { A, b, ops } = parseConstraints(input, nVars);

        handleOperators(A, c, ops);

        return {
            isMax, A, b, c, n: c.length, ops, vb: [], vnb: []
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}