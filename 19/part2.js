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

  const result = countDesignArrangements(towels, towelsResult);
  console.log("Total arrangements:", result);
});

function countDesignArrangements(patterns, designs) {
  const memo = new Map();//memo is my cache

  // Recursive
  function countWays(design) {
    if (memo.has(design)) return memo.get(design);

    if (design === "") return 1;

    let ways = 0;

    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        const remainingDesign = design.slice(pattern.length);
        ways += countWays(remainingDesign);
      }
    }

    memo.set(design, ways);

    return ways;
  }

  let totalWays = 0;
  for (const design of designs) {
    totalWays += countWays(design);
  }

  return totalWays;
}


