"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = formularProblemaArtificial;
// export default function formularProblemaArtificial(A: number[][], b: number[], n: number): ProblemaArtificial {
//   const m = b.length; // número de restrições
//   // Função objetivo artificial: 0 para as n variáveis originais, 1 para as m artificiais
//   const objetivo: number[] = [...Array(n).fill(0), ...Array(m).fill(1)];
//   // Matriz A estendida com identidade para variáveis artificiais
//   const novaA = A.map((linha, i) => {
//     const artificiais = Array(m).fill(0);
//     artificiais[i] = 1;
//     return [...linha, ...artificiais];
//   });
//   // Índices básicos: artificiais (n, n+1, ..., n+m-1)
//   const variaveisBasicas = Array.from({ length: m }, (_, j) => n + j);
//   // Índices não-básicos: variáveis originais (0 até n-1)
//   const variaveisNaoBasicas = Array.from({ length: n }, (_, i) => i);
//   return {
//     objetivo,
//     A: novaA,
//     b,
//     variaveisBasicas,
//     variaveisNaoBasicas
//   };
// }
function formularProblemaArtificial(A, b) {
    const m = b.length; // número de restrições
    const n = A[0].length;
    // Função objetivo artificial: 0 para as n variáveis originais, 1 para as m artificiais
    const objetivo = [...Array(n).fill(0), ...Array(m).fill(1)];
    // Matriz A estendida com identidade para variáveis artificiais
    const novaA = A.map((linha, i) => {
        const artificiais = Array(m).fill(0);
        artificiais[i] = 1;
        return [...linha, ...artificiais];
    });
    // Índices básicos: artificiais (n, n+1, ..., n+m-1)
    const variaveisBasicas = Array.from({ length: m }, (_, j) => n + j);
    // Índices não-básicos: variáveis originais (0 até n-1)
    const variaveisNaoBasicas = Array.from({ length: n }, (_, i) => i);
    return {
        objetivo,
        A: novaA,
        b,
        variaveisBasicas,
        variaveisNaoBasicas
    };
}
