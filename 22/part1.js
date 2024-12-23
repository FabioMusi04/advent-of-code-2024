const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

let secretNumber = 0n;

function prune(number) {
  if (number === 100000000n)
    return 16113920n;

  return number % 16777216n;
}

const data = fs.readFileSync(filePath, 'utf-8');
const lines = data.trim().split('\n');
const results = [];
for (const num of lines) {
  secretNumber = BigInt(num);
  for (let i = 0; i < 2000; i++) {
    // Step 1: Multiply by 64, mix, and prune
    let firstStep = secretNumber * 64n;
    secretNumber ^= firstStep;
    secretNumber = prune(secretNumber);

    // Step 2: Divide by 32, mix, and prune
    let secondStep = secretNumber / 32n;
    secretNumber ^= secondStep;
    secretNumber = prune(secretNumber);

    // Step 3: Multiply by 2048, mix, and prune
    let thirdStep = secretNumber * 2048n;
    secretNumber ^= thirdStep;
    secretNumber = prune(secretNumber);
  }
  results.push(secretNumber);
}

const sum = results.reduce((acc, curr) => acc + curr, 0n);
console.log("Sum: ", sum);