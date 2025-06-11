"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lerProblema_1 = __importDefault(require("./lerProblema"));
const problema = (0, lerProblema_1.default)();
let { funcF, ind, isMax, mat, ops } = problema;
const fase1_1 = __importDefault(require("./fase1"));
// Fase 1
if (isMax)
    funcF = funcF.map(x => x * -1);
for (let i = 0; i < ind.length; i++) {
    if (ind[i] < 0) {
        inverterRestricao(i);
    }
}
function inverterRestricao(i) {
    if (ops[i].includes(">"))
        ops[i].replace(">", "<");
    else if (ops[i].includes("<"))
        ops[i].replace("<", ">");
    mat[i] = mat[i].map(x => x * -1);
    ind[i] *= -1;
}
const colunasIdentidade = mat[0].map((_, col) => mat.map(row => row[col])).filter(col => col.filter(v => v === 1).length === 1 && col.filter(v => v === 0).length === mat.length - 1);
let usarFase1 = false;
if (ops.some(x => x.match(/>|=/)) || ind.some(x => x < 0) || colunasIdentidade.length < mat.length)
    usarFase1 = true;
if (usarFase1) {
    (0, fase1_1.default)({ mat, ind, isMax, funcF, ops });
}
else {
    console.log("Fase2");
}
