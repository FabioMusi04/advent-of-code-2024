const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lines = data.trim().split('\r\n');
  const array = [];
  lines.forEach(line => {
    const [testValue, equation] = line.split(':');
    const numbers = equation.trim().split(' ').map(Number);
    const found = canAchieveTarget(numbers, Number(testValue));
    if (found) {
      array.push(Number(testValue));
    }
  });

  const sum = array.reduce((acc, cur) => acc + cur, 0);

  console.log('Sum:', sum);
});

function canAchieveTarget(numbers, target) {
  function helper(index, currentValue) {
      if (index === numbers.length) {
          return currentValue === target;
      }
      
      if (helper(index + 1, currentValue + numbers[index])) {
          return true;
      }
      
      if (helper(index + 1, currentValue * numbers[index])) {
          return true;
      }
      
      return false;
  }
  
  return helper(1, numbers[0])
}
