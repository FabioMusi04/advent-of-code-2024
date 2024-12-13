const fs = require('fs');

function parseInput(file) {
  const data = fs.readFileSync(file, 'utf8');
  const lines = data.trim().split('\r\n').filter(line => line !== "");
  const cases = [];
  const OFFSET = 10000000000000;  
  for (let i = 0; i < lines.length; i += 3) {
    if (lines[i] === "") continue;
    const buttonA = lines[i].match(/X\+(\d+), Y\+(\d+)/).slice(1).map(Number);
    const buttonB = lines[i + 1].match(/X\+(\d+), Y\+(\d+)/).slice(1).map(Number);
    const prize = lines[i + 2].match(/X=(\d+), Y=(\d+)/).slice(1).map(Number);

    const prizeWithOffset = [prize[0] + OFFSET, prize[1] + OFFSET];

    cases.push({ buttonA, buttonB, prize: prizeWithOffset });
  }
  return cases;
}

function cramerRule(buttonA, buttonB, target) {
  const A_x = buttonA[0], A_y = buttonA[1];
  const B_x = buttonB[0], B_y = buttonB[1];
  const X_p = target[0], Y_p = target[1];

  // Calculate determinants
  const detA = A_x * B_y - A_y * B_x; // det(A)
  if (detA === 0) return -1;  // No solution if detA == 0

  const detAi = X_p * B_y - Y_p * B_x; // det(A_i)
  const detAj = A_x * Y_p - A_y * X_p; // det(A_j)

  // Calculate i and j using Cramer's rule
  const i = detAi / detA;
  const j = detAj / detA;

  // i and j must be non-negative integers, otherwise, return -1
  if (!Number.isInteger(i) || !Number.isInteger(j) || i < 0 || j < 0) {
    return -1;
  }

  return i * 3 + j * 1;
}

const cases = parseInput('./input.txt');
const result = [];

cases.forEach(({ buttonA, buttonB, prize }) => {
  const minTokens = cramerRule(buttonA, buttonB, prize);
  result.push(minTokens);
});

const totalTokens = result.filter(tokenCost => tokenCost !== -1).reduce((acc, cur) => acc + cur, 0);
console.log(totalTokens);
