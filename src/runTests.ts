import { readFileSync, writeFileSync } from "fs";
import main from "./index"; // your simplex executor

type TestCase = {
    input: string;
    expected: number | string;
};

function parseTestCases(content: string): TestCase[] {
    const blocks = content.trim().split(/^\/\/(.+)$/m);
    const tests: TestCase[] = [];

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
    const content = readFileSync(path, "utf-8");
    const tests = parseTestCases(content);

    let passed = 0;
    for (const [i, test] of tests.entries()) {
        writeFileSync("test.txt", test.input);
        const result = main();

        let testPassed = false;

        if (typeof test.expected === "number") {
            const resultRounded = Number(parseFloat(result as any).toFixed(1));
            const expectedRounded = Number(test.expected.toFixed(1));

            testPassed =
                resultRounded === expectedRounded ||
                resultRounded === -expectedRounded;
        } else if (typeof result === "string") {
            testPassed =
                result.trim().toLowerCase() === test.expected.toLowerCase();
        }

        if (testPassed) {
            console.log(`Test ${i + 1} passed ✅`);
            passed++;
        } else {
            console.error(`Test ${i + 1} failed ❌`);
            console.error(`Expected: ${test.expected}, Got: ${result}`);
        }
    }

    console.log(`\n${passed} / ${tests.length} tests passed.`);
}

runTestsFromFile();
