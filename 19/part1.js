const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  const inputData = data.split('\r\n').filter(x => x !== '');
  const towels = inputData[0].split(', ')
  const towelsResult = inputData.slice(1);

  const result = countPossibleDesigns(towels, towelsResult);
  console.log(result);
});

function countPossibleDesigns(towelPatterns, designs) {
  const canConstruct = (design, memo = {}) => {
    if (design in memo) return memo[design];
    if (design === "") return true;

    for (let pattern of towelPatterns) {
      if (design.startsWith(pattern)) {
        const remaining = design.slice(pattern.length);
        if (canConstruct(remaining, memo)) {
          memo[design] = true;
          return true;
        }
      }
    }

    memo[design] = false;
    return false;
  };

  let count = 0;
  for (let design of designs) {
    if (canConstruct(design)) {
      count++;
    }
  }
  return count;
}

