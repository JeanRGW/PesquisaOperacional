import { ProblemaArtificial } from "./adicionarArtificiais";
import { atualizarBase, determinarVariavelQueSai } from "./fase1";
import { calcularCustosRelativos } from "./simplex";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";
import produtoInterno from "./utils/produtoInterno";

type SolucaoBasica = {
	x: number[];
	xB: number[];
	xN: number[];
};

function calcularSolucaoBasica(problema: ProblemaArtificial): SolucaoBasica {
	const { A, b, variaveisBasicas, variaveisNaoBasicas } = problema;
	const n = A[0].length;

	// Matriz B com colunas da base
	const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));

	const invB = inversa(B);
	if (!invB) {
		console.table(B);
		throw new Error("A matriz B não é invertível.");
	}

	// Resolve xB = invB * b
	const xB = multiplicarMatriz(
		invB,
		b.map((v) => [v])
	).map((x) => x[0]);

	// xN são zeros
	const xN = Array(variaveisNaoBasicas.length).fill(0);

	// Monta o vetor x completo (xN = 0)
	const x: number[] = Array(n).fill(0);
	variaveisBasicas.forEach((indice, i) => {
		x[indice] = xB[i];
	});

	return { x, xB, xN };
}

type ResultadoCustos = {
	lambda: number[];
	custosReduzidos: number[];
	indiceQueEntra: number | null;
};

// function calcularCustosReduzidos(
//     problemaArtificial: ProblemaArtificial
// ): ResultadoCustos {
//     // 2.1) Calcular λ^T = cB^T * inv(B)
//     const { A, b, objetivo, variaveisBasicas, variaveisNaoBasicas } = problemaArtificial;
//     const c = problemaArtificial.objetivo;

//     const B = A.map((linha) => variaveisBasicas.map((j) => linha[j]));
//     const invB = inversa(B);

//     if (!invB) {
//         console.table(B);
//         throw new Error("A matriz B não é invertível.");
//     }

//     const cB = variaveisBasicas.map((j) => c[j]);
//     const lambdaT = multiplicarMatriz([cB], invB)[0];

//     // 2.2) Custos reduzidos: ĉ_Nj = c_Nj - λ^T * a_Nj
//     const custosReduzidos = variaveisNaoBasicas.map((j) => {
//         const aNj = A.map((linha) => linha[j]);
//         const lambdaTAj = objetivo[j] - produtoInterno(lambdaT, aNj);
//         return c[j] - lambdaTAj;
//     });

//     // 2.3) Determinar a variável que entra na base (mínimo custo reduzido)
//     let indiceQueEntra: number | null = null;
//     let menorCusto = 0;
//     for (let i = 0; i < custosReduzidos.length; i++) {
//         if (custosReduzidos[i] < menorCusto) {
//             menorCusto = custosReduzidos[i];
//             indiceQueEntra = i;
//         }
//     }

//     return {
//         lambda: lambdaT,
//         custosReduzidos,
//         indiceQueEntra,
//     };
// }

// Passo 4: Calcular direção simplex (y = B⁻¹ a_Nk)
function calcularDirecaoSimplex(
	A: number[][],
	invB: number[][],
	variavelEntrante: number
): number[][] {
	const aNk = A.map((linha) => linha[variavelEntrante]); // coluna da variável entrante
	const aNkColuna = aNk.map((x) => [x]);
	const direcao = multiplicarMatriz(invB, aNkColuna);
	console.log("Direção simplex (y):", direcao);
	return direcao;
}

function calcularValorObjetivo(c: number[], x: number[]): number {
	return c.reduce((soma, coef, i) => soma + coef * x[i], 0);
}

export default function fase2(problema: ProblemaArtificial) {
	const n = problema.objetivo.length;
	const maxIt = 1000;
	let it = 1;

	let solucaoBasica: SolucaoBasica | null = null;

	do {
		console.log(`Iteração ${it} da fase 2`);

		solucaoBasica = calcularSolucaoBasica(problema);
		const resultadoCustos = calcularCustosRelativos(problema);

		if (resultadoCustos.indiceQueEntra === null) {
			console.log("Solução ótima encontrada:");
			console.log(solucaoBasica.x);
			console.log(problema.objetivo);
			const z = calcularValorObjetivo(solucaoBasica.x, problema.objetivo);
			console.log("Valor da função objetivo:", z);
			break;
		} else {
			const direcao = calcularDirecaoSimplex(
				problema.A,
				resultadoCustos.invB,
				problema.variaveisNaoBasicas[resultadoCustos.indiceQueEntra!]
			);

			const xB = problema.variaveisBasicas.map((j) => solucaoBasica!.x[j]).map((val) => [val]);

			const { sai, epsilon } = determinarVariavelQueSai(direcao, xB, problema.variaveisBasicas);

			console.log("Epsilon: " + epsilon);
            console.log("Logs ultra sérios")
			console.log(sai, resultadoCustos.indiceQueEntra);
            console.log(problema.variaveisBasicas[sai!], problema.variaveisNaoBasicas[resultadoCustos.indiceQueEntra])

			if (sai === null) {
				throw new Error("Não foi possível determinar a variável que sai da base.");
			}
			console.log(`Variável que sai da base: x_${sai}, razão mínima ε = ${epsilon}`);

			atualizarBase(problema, sai, problema.variaveisNaoBasicas[resultadoCustos.indiceQueEntra!]);

			it++;
		}
	} while (it < maxIt);

	console.log("Fase 2 concluída. Fé");
	console.log(solucaoBasica);

    return calcularValorObjetivo(solucaoBasica.x, problema.objetivo);
}
