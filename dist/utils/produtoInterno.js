"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = produtoInterno;
function produtoInterno(v1, v2) {
    return v1.reduce((soma, val, i) => soma + val * v2[i], 0);
}
