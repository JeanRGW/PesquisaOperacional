import { ProblemaArtificial } from "./adicionarArtificiais";
import inversa from "./utils/inversa";
import multiplicarMatriz from "./utils/multiplicarMatriz";
import produtoInterno from "./utils/produtoInterno";

export function calcularCustosRelativos(problema: ProblemaArtificial){
    const {A, b, objetivo, variaveisBasicas, variaveisNaoBasicas} = problema;

    const B = A.map(linha => variaveisBasicas.map(j => linha[j]))
    const invB = inversa(B)
    if(!invB) throw new Error("A matriz B não é inversível: \n" + JSON.stringify(B))
    
    const cB = variaveisBasicas.map(j => objetivo[j])

    const lambdaT = multiplicarMatriz([cB], invB)[0];

    const custosRelativos: number[] = variaveisNaoBasicas.map((j) => {
        const aNj = A.map(linha => linha[j]); // coluna j
        return objetivo[j] - produtoInterno(lambdaT, aNj);
    })

    let indiceQueEntra: number | null = null;
    let menorCusto = 0;
    
    custosRelativos.forEach((custo, i) => {
        if( custo < menorCusto) {
            menorCusto = custo;
            indiceQueEntra = i;
        }
    })

    return {custosRelativos, lambdaT, invB, indiceQueEntra};
}