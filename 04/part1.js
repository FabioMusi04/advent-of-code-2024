const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const grid = data.replaceAll('\r', '').split('\n').map(row => row.split(''));
    const word = 'XMAS';
    const wordLength = word.length;
    let count = 0;

    const directions = [
        { dx: 0, dy: 1 }, // horizontal (left to right)
        { dx: 0, dy: -1 }, // horizontal (right to left)
        { dx: 1, dy: 0 }, // vertical (top to bottom)
        { dx: -1, dy: 0 }, // vertical (bottom to top)
        { dx: 1, dy: 1 }, // diagonal (top-left to bottom-right)
        { dx: -1, dy: -1 }, // diagonal (bottom-right to top-left)
        { dx: 1, dy: -1 }, // diagonal (top-right to bottom-left)
        { dx: -1, dy: 1 } // diagonal (bottom-left to top-right)
    ];

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (let { dx, dy } of directions) {
                let found = true;

                for (let k = 0; k < wordLength; k++) {
                    const x = i + dx * k;
                    const y = j + dy * k;

                    if (x < 0 || x >= grid.length || y < 0 || y >= grid[i].length) {
                        found = false;
                        break;
                    }

                    if (grid[x][y] !== word[k]) {
                        found = false;
                        break;
                    }
                }

                if (found) {
                    count++;
                }
            }
        }
    }

    console.log(count);
});