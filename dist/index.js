"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lerProblema_1 = __importDefault(require("./lerProblema"));
const problema = (0, lerProblema_1.default)();
let { c, b, isMax, A, ops } = problema;
const fase1_1 = __importDefault(require("./fase1"));
function inverterRestricao(i) {
    if (ops[i].includes(">"))
        ops[i] = ops[i].replace(">", "<");
    else if (ops[i].includes("<"))
        ops[i] = ops[i].replace("<", ">");
    A[i] = A[i].map((x) => (x !== 0 ? x * -1 : 0));
    b[i] *= -1;
}
// Fase 1
if (isMax)
    c = c.map((x) => x * -1);
for (let i = 0; i < b.length; i++) {
    if (b[i] < 0) {
        inverterRestricao(i);
    }
}
console.log(A, b, ops);
const colunasIdentidade = A[0]
    .map((_, col) => A.map((row) => row[col]))
    .filter((col) => col.filter((v) => v === 1).length === 1 &&
    col.filter((v) => v === 0).length === A.length - 1);
let usarFase1 = false;
if (ops.some((x) => x === ">" || x === ">=" || x === "=") ||
    b.some((x) => x < 0)) {
    usarFase1 = true;
    console.log("Caso1");
}
if (colunasIdentidade.length < A.length) {
    usarFase1 = true;
    console.log("Caso2");
}
if (usarFase1) {
    const z = (0, fase1_1.default)({ A, b, isMax, c, ops });
    const res = isMax ? z * -1 : z;
    console.log(res);
}
else {
    console.log("Fase2 direto");
}
