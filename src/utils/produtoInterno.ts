export default function produtoInterno(v1: number[], v2: number[]): number {
    return v1.reduce((soma, val, i) => soma + val * v2[i], 0);
}