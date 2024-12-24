const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');

const data = fs.readFileSync(inputFilePath, 'utf8');
const lines = data.trim().split('\r\n');

const variables = new Map();
const operations = [];

lines.forEach(line => {
  if (line.includes(':')) {
    const [key, value] = line.split(': ');
    variables.set(key, parseInt(value, 10));
  } else {
    operations.push(line);
  }
});

const evaluate = (expr) => {
  const [left, op, right] = expr.split(' ');
  const leftValue = variables.get(left);
  const rightValue = variables.get(right);
  if (leftValue === undefined || rightValue === undefined || op === undefined) {
    return undefined;
  }

  switch (op) {
    case 'AND':
      return leftValue & rightValue;
    case 'OR':
      return leftValue | rightValue;
    case 'XOR':
      return leftValue ^ rightValue;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
};

let changesMade;
do {
  changesMade = false;
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i];
    const [expr, result] = operation.split(' -> ');
    if (!variables.has(result)) {
      const value = evaluate(expr);
      if (value !== undefined) {
        variables.set(result, value);
        changesMade = true;
      }
    }
  }
} while (changesMade);

const zVariables = Array.from(variables.keys())
  .filter(key => key.startsWith('z'))
  .sort((a, b) => b.localeCompare(a));

let result = '';
for (const key of zVariables) {
  result += `${variables.get(key)}`;
}

console.log(result);

const num = parseInt(result, 2);
console.log(num);
