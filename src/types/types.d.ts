export default interface Problema {
    isMax: boolean;

    /** Numero de variáveis reais */
    n: number;

    /** Matriz das restrições, incluindo folga */
    A: number[][];

    /** Vetor da direita das restrições */
    b: number[];

    /** Coeficientes da função objetivo */
    c: number[];

    /** Operadores das restrições */
    ops: string[];

    /** Variáveis básicas (Indices das colunas) */
    vb: number[];

    /** Variáveis não basicas (Indices das colunas) */
    vnb: number[];
}
