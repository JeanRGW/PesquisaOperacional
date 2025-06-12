import lerProblema from "./lerProblema";
const problema = lerProblema();
let { funcF, ind, isMax, mat, ops } = problema;
import fase1 from "./fase1";
import fase2 from "./fase2";

function inverterRestricao(i: number) {
    if (ops[i].includes(">")) ops[i] = ops[i].replace(">", "<");
    else if (ops[i].includes("<")) ops[i] = ops[i].replace("<", ">");

    mat[i] = mat[i].map((x) => (x !== 0 ? x * -1 : 0));

    ind[i] *= -1;
}

// Fase 1
if (isMax) funcF = funcF.map((x) => x * -1);

for (let i = 0; i < ind.length; i++) {
    if (ind[i] < 0) {
        inverterRestricao(i);
    }
}

console.log(mat, ind, ops);

const colunasIdentidade = mat[0]
    .map((_, col) => mat.map((row) => row[col]))
    .filter(
        (col) =>
            col.filter((v) => v === 1).length === 1 &&
            col.filter((v) => v === 0).length === mat.length - 1
    );

let usarFase1 = false;
if (
    ops.some((x) => x === ">" || x === ">=" || x === "=") ||
    ind.some((x) => x < 0)
) {
    usarFase1 = true;
    console.log("Caso1");
}

if (colunasIdentidade.length < mat.length) {
    usarFase1 = true;
    console.log("Caso2");
}

if (usarFase1) {
    fase1({ mat, ind, isMax, funcF, ops });
} else {
    console.log("Fase2 direto");
}
