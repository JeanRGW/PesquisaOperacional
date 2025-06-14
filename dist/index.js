"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
const lerProblema_1 = __importDefault(require("./lerProblema"));
const fase1_1 = __importDefault(require("./fase1"));
const fase2_1 = __importDefault(require("./fase2"));
function main() {
    const problema = (0, lerProblema_1.default)();
    let { c, b, isMax, A, ops } = problema;
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
        problema.c = c.map((x) => x * -1);
    for (let i = 0; i < b.length; i++) {
        if (b[i] < 0) {
            inverterRestricao(i);
        }
    }
    console.log(problema.A, problema.b, problema.c, problema.ops);
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
    let resultado = -6969;
    if (usarFase1) {
        resultado = (0, fase1_1.default)(problema);
    }
    else {
        const A = problema.A;
        const indices = [];
        // Tenta encontrar colunas que formam identidade (candidatas a base viável)
        for (let i = 0; i < A[0].length; i++) {
            const col = A.map((l) => l[i]);
            const uns = col.filter((v) => v === 1).length;
            const zeros = col.filter((v) => v === 0).length;
            if (uns === 1 && zeros === A.length - 1) {
                indices.push(i);
            }
            if (indices.length === A.length)
                break; // já temos base suficiente
        }
        if (indices.length !== A.length) {
            // Não encontrou base viável diretamente, executa fase 1
            resultado = (0, fase1_1.default)(problema);
        }
        else {
            // Define base e não base diretamente
            problema.vb = indices;
            problema.vnb = [];
            for (let i = 0; i < A[0].length; i++) {
                if (!indices.includes(i)) {
                    problema.vnb.push(i);
                }
            }
            // Executa a fase 2 diretamente
            resultado = (0, fase2_1.default)(problema);
        }
    }
    resultado =
        isMax && typeof resultado === "number" ? resultado * -1 : resultado;
    console.log(resultado);
    return resultado;
}
main();
