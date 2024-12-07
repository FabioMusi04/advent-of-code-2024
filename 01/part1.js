const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const lines = data.split('\r\n');
    const leftColumn = [];
    const rightColumn = [];

    lines.forEach(line => {
        const [left, right] = line.split('   ');
        leftColumn.push(Number(left));
        rightColumn.push(Number(right));
    });
    const difference = [];

    while (leftColumn.length > 0 && rightColumn.length > 0) {
        const leftMin = Math.min(...leftColumn);
        const rightMin = Math.min(...rightColumn);

        leftColumn.splice(leftColumn.indexOf(leftMin), 1);
        rightColumn.splice(rightColumn.indexOf(rightMin), 1);

        difference.push(Math.abs(leftMin - rightMin));
    }

    const sum = difference.reduce((acc, curr) => acc + curr, 0);

    console.log(`Sum of differences: ${sum}`);
});