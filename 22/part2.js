const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

function findBestSequence(lines) {
  let total = 0;

  let maxBananas = 0;

  const bananaSales = new Map();

  for (let number of lines) {
    let current = number;
    let diffs = [];

    for (let i = 0; i < 2000; i++) {
      let previous = current;
      current = mixAndPrune(current * 64, current);
      current = mixAndPrune(Math.floor(current / 32), current);
      current = mixAndPrune(current * 2048, current);

      let previousPrice = previous % 10;
      let newPrice = current % 10;
      diffs.push(newPrice - previousPrice);

      if (diffs.length > 4) diffs.shift();  // Keep only the last 4 differences

      if (diffs.length === 4) {
        let key = JSON.stringify(diffs);
        
        if (bananaSales.has(key)) {
          let previousSales = bananaSales.get(key);
          
          if (!previousSales.has(number)) {
            let newTotal = previousSales.get('total') + newPrice;
            previousSales.set('total', newTotal);
            previousSales.set(number, newPrice);
            bananaSales.set(key, previousSales);

            maxBananas = Math.max(maxBananas, newTotal);
          }
        } else {
          bananaSales.set(key, new Map([[number, newPrice], ['total', newPrice]]));
        }
      }
    }

    total += current;
  }

  return maxBananas
}


const mixAndPrune = (newNumber, secretNumber) => {
  return secretNumber ^ newNumber % 16777216;
}

const data = fs.readFileSync(filePath, 'utf-8');
const lines = data.trim().split('\n').map(Number);

const largestSale = findBestSequence(lines);

console.log(largestSale);
