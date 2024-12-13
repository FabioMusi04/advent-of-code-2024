//it costs 3 tokens to push the A button and 1 token to push the B button.
//A button move to the right, const fs = require('fs');

//it costs 3 tokens to push the A button and 1 token to push the B button.
//A button move to X right, and y foward MAX 100 times
//B button move to X right, and y foward MAX 100 times
//prize is at (x,y)
//find the minimum number of tokens to reach the prize, if it is possible to reach the prize.

const fs = require('fs');

function parseInput(file) {
    const data = fs.readFileSync(file, 'utf8');
    const lines = data.trim().split('\r\n').filter(line => line !== "");
    const cases = [];
    for (let i = 0; i < lines.length; i += 3) {
        if(lines[i] === "") continue;
        const buttonA = lines[i].match(/X\+(\d+), Y\+(\d+)/).slice(1).map(Number);
        const buttonB = lines[i + 1].match(/X\+(\d+), Y\+(\d+)/).slice(1).map(Number);
        const prize = lines[i + 2].match(/X=(\d+), Y=(\d+)/).slice(1).map(Number);
        cases.push({ buttonA, buttonB, prize });
    }
    return cases;
}

const cases = parseInput('./input.txt');
const result = [];
cases.forEach(({ buttonA, buttonB, prize }) => {
    const x = prize[0], y = prize[1];
    let minTokens = 0;
    for (let i = 0; i <= 100; i++) {
        for (let j = 0; j <= 100; j++) {
            if (x === buttonA[0] * i + buttonB[0] * j && y === buttonA[1] * i + buttonB[1] * j) {
                minTokens = i * 3 + j;
                break;
            }
        }
    }
    result.push(minTokens);
});

const sum = result.reduce((acc, cur) => acc + cur, 0);
console.log(sum);