const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const grid = data.replaceAll('\r', '').split('\n').map(row => row.split(''));
    const charAt = (i, j) => (grid[i] && grid[i][j]) ? grid[i][j] : '';

    const word = 'MAS';
    let count = 0;

    const directions = [
        { dx1: 1, dy1: 1, dx2: 1, dy2: -1 }
    ];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (!(grid[i] && grid[i][j])) {
                continue;
            }

            if (grid[i][j] !== 'A'){
                continue;
            }

            const xMasAxis1 = charAt(i + 1, j + 1) + charAt(i, j) + charAt(i - 1, j - 1);
            const xMasAxis2 = charAt(i + 1, j - 1) + charAt(i, j) + charAt(i - 1, j + 1);

            if ((xMasAxis1 === 'MAS' || xMasAxis1 === 'SAM') &&
            (xMasAxis2 === 'MAS' || xMasAxis2 === 'SAM')) {
                count++;
            }
        }
    }

    console.log(`The word "${word}" forms an X shape ${count} times in the grid.`);
});
