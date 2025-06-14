"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularCustosRelativos = calcularCustosRelativos;
const inversa_1 = __importDefault(require("./utils/inversa"));
const multiplicarMatriz_1 = __importDefault(require("./utils/multiplicarMatriz"));
const produtoInterno_1 = __importDefault(require("./utils/produtoInterno"));
function calcularCustosRelativos(problema) {
    const { A, b, objetivo, variaveisBasicas, variaveisNaoBasicas } = problema;
    const B = A.map(linha => variaveisBasicas.map(j => linha[j]));
    const invB = (0, inversa_1.default)(B);
    if (!invB)
        throw new Error("A matriz B não é inversível: \n" + JSON.stringify(B));
    const cB = variaveisBasicas.map(j => objetivo[j]);
    const lambdaT = (0, multiplicarMatriz_1.default)([cB], invB)[0];
    const custosRelativos = variaveisNaoBasicas.map((j) => {
        const aNj = A.map(linha => linha[j]); // coluna j
        return objetivo[j] - (0, produtoInterno_1.default)(lambdaT, aNj);
    });
    let indiceQueEntra = null;
    let menorCusto = 0;
    custosRelativos.forEach((custo, i) => {
        if (custo < menorCusto) {
            menorCusto = custo;
            indiceQueEntra = i;
        }
    });
    console.log("Indice que entra: " + indiceQueEntra);
    return { custosRelativos, lambdaT, invB, indiceQueEntra };
}
