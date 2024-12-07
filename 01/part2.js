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

    const similarityScore = [];

    for(let i = 0; i < leftColumn.length; i++) {
        const left = leftColumn[i];

        const result = rightColumn.reduce((acc, curr) => {
            if (left === curr) {
                acc += 1;
            }

            return acc;
        }, 0);

        similarityScore.push(result * left);
    }

    const sum = similarityScore.reduce((acc, curr) => acc + curr, 0);

    console.log(`Sum of differences: ${sum}`);
});