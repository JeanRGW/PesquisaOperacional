"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const index_1 = __importDefault(require("./index")); // your simplex executor
function parseTestCases(content) {
    const blocks = content.trim().split(/^\/\/(.+)$/m);
    const tests = [];
    for (let i = 1; i < blocks.length; i += 2) {
        const rawExpected = blocks[i].trim();
        const expected = isNaN(Number(rawExpected))
            ? rawExpected.toLowerCase()
            : parseFloat(rawExpected);
        const input = blocks[i + 1].trim();
        tests.push({ expected, input });
    }
    return tests;
}
function runTestsFromFile(path = "testCases.txt") {
    const content = (0, fs_1.readFileSync)(path, "utf-8");
    const tests = parseTestCases(content);
    let passed = 0;
    for (const [i, test] of tests.entries()) {
        (0, fs_1.writeFileSync)("test.txt", test.input);
        const result = (0, index_1.default)();
        let testPassed = false;
        if (typeof test.expected !== "string") {
            const resultRounded = Number(parseFloat(result.z).toFixed(1));
            const expectedRounded = Number(test.expected.toFixed(1));
            testPassed = resultRounded === expectedRounded;
        }
        else if (typeof result === "string") {
            testPassed =
                result.trim().toLowerCase() === test.expected.toLowerCase();
        }
        if (testPassed) {
            console.log(`Test ${i + 1} passed ✅`);
            passed++;
        }
        else {
            console.error(`Test ${i + 1} failed ❌`);
            if (typeof result === "string")
                console.error(`Expected: ${test.expected}, Got: ${result}`);
            else
                console.error(`Expected: ${test.expected}, Got: ${result.z}`);
        }
    }
    console.log(`\n${passed} / ${tests.length} tests passed.`);
}
runTestsFromFile();
