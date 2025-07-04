import lerProblema from "./lerProblema";

import fase1 from "./fase1";
import fase2 from "./fase2";
import { SolucaoBasica } from "./simplex";

export default function main() {
    const problema = lerProblema();

    if (problema === null) throw new Error("Não foi possível ler o problema");

    let { c, b, isMax, A, ops } = problema;

    function inverterRestricao(i: number) {
        if (ops[i].includes(">")) ops[i] = ops[i].replace(">", "<");
        else if (ops[i].includes("<")) ops[i] = ops[i].replace("<", ">");

        A[i] = A[i].map((x) => (x !== 0 ? x * -1 : 0));

        b[i] *= -1;
    }

    // Fase 1
    if (isMax) problema.c = c.map((x) => x * -1);

    for (let i = 0; i < b.length; i++) {
        if (b[i] < 0) {
            inverterRestricao(i);
        }
    }

    console.log(problema.A, problema.b, problema.c, problema.ops);

    const colunasIdentidade = A[0]
        .map((_, col) => A.map((row) => row[col]))
        .filter(
            (col) =>
                col.filter((v) => v === 1).length === 1 &&
                col.filter((v) => v === 0).length === A.length - 1
        );

    let usarFase1 = false;
    if (
        ops.some((x) => x === ">" || x === ">=" || x === "=") ||
        b.some((x) => x < 0)
    ) {
        usarFase1 = true;
        console.log("Caso1");
    } else if (colunasIdentidade.length < A.length) {
        usarFase1 = true;
        console.log("Caso2");
    }

    let resultado:
        | { solucaoBasica: SolucaoBasica; z: number }
        | "infactível"
        | "ilimitado";

    if (usarFase1) {
        resultado = fase1(problema);
    } else {
        const A = problema.A;
        const indices: number[] = [];

        // Tenta encontrar colunas que formam identidade (candidatas a base viável)
        for (let i = 0; i < A[0].length; i++) {
            const col = A.map((l) => l[i]);
            const uns = col.filter((v) => v === 1).length;
            const zeros = col.filter((v) => v === 0).length;

            if (uns === 1 && zeros === A.length - 1) {
                indices.push(i);
            }

            if (indices.length === A.length) break; // já temos base suficiente
        }

        if (indices.length !== A.length) {
            // Não encontrou base viável diretamente, executa fase 1
            console.error(
                "Não foi possível encontrar a base diretamente, executando fase 1"
            );
            resultado = fase1(problema);
        } else {
            // Define base e não base diretamente
            problema.vb = indices;
            problema.vnb = [];

            for (let i = 0; i < A[0].length; i++) {
                if (!indices.includes(i)) {
                    problema.vnb.push(i);
                }
            }

            // Executa a fase 2 diretamente
            resultado = fase2(problema);
        }
    }

    if (typeof resultado !== "string") {
        resultado.z = isMax ? resultado.z * -1 : resultado.z;
        console.log(`Z = ${resultado.z}`);

        problema.vb.sort((a, b) => a - b);
        problema.vnb.sort((a, b) => a - b);

        let vbs = "";
        problema.vb.forEach((x) => {
            vbs += `X${x + 1}=${resultado.solucaoBasica.x[x]}   `;
        });
        console.log("Valores das variáveis básicas: " + vbs);

        let vnbs = "";
        problema.vnb.forEach((x) => {
            vnbs += `X${x + 1}=${resultado.solucaoBasica.x[x]}   `;
        });
        console.log("Valores das variáveis não básicas: " + vnbs);
    } else {
        console.log(resultado);
    }

    return resultado;
}

main();
