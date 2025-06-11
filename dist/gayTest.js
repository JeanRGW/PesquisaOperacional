"use strict";
const input = "-x1 + 3x2 <= 4";
// Extract all variable terms (e.g., -x1, +3x2)
const termRegex = /([-+]?\s*\d*\.?\d*)x(\d+)/g;
// Extract the operator and constant
const fullRegex = /(.+?)\s*(<=|>=|=|<|>)\s*(-?\d*\.?\d+)/;
const terms = [];
let match;
// Match variable terms
while ((match = termRegex.exec(input)) !== null) {
    let coeffStr = match[1].replace(/\s+/g, '');
    const coefficient = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
    const index = parseInt(match[2], 10);
    terms.push({ index, coefficient });
}
// Match operator and RHS constant
const constraintMatch = input.match(fullRegex);
let operator = null;
let constant = null;
if (constraintMatch) {
    operator = constraintMatch[2];
    constant = parseFloat(constraintMatch[3]);
}
// Output the parsed result
console.log("Terms:", terms); // Example: [ { index: 1, coefficient: -1 }, { index: 2, coefficient: 3 } ]
console.log("Operator:", operator); // Example: "<="
console.log("Constant:", constant); // Example: 4
