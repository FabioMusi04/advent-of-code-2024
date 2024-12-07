const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const input = data.split('\r\n').map(row => row.split(''));
    const movement = guardCheck(input)
    console.log(movement.size);
});

function guardCheck(input) {
    const movementUnique = new Set();
    const guardPosition = findCharPosition(input, '^');
    if (!guardPosition) {
        console.log('Guard not found');
        return;
    }

    const directions = [
        { row: 0, col: 1 },  // right
        { row: 1, col: 0 },  // down
        { row: 0, col: -1 }, // left
        { row: -1, col: 0 }  // up
    ];
    let currentDirectionIndex = 3;
    movementUnique.add(`${guardPosition.row},${guardPosition.col}`);

    while (true) {
        let direction = directions[currentDirectionIndex];
        let row = guardPosition.row + direction.row;
        let col = guardPosition.col + direction.col;

        if (row < 0 || row >= input.length || col < 0 || col >= input[0].length) {
            input[guardPosition.row][guardPosition.col] = '.';
            break;
        }

        if (!input[row] || !input[row][col] || input[row][col] === '#') {
            currentDirectionIndex = (currentDirectionIndex + 1) % directions.length;
        } else if (input[row][col] === '.') {
            input[guardPosition.row][guardPosition.col] = '.';
            guardPosition.row = row;
            guardPosition.col = col;
            movementUnique.add(`${guardPosition.row},${guardPosition.col}`);
        } else {
            break;
        }
    }

    return movementUnique;
}

function findCharPosition(arr, targetChar) {
    for (let row = 0; row < arr.length; row++) {
        for (let col = 0; col < arr[row].length; col++) {
            if (arr[row][col] === targetChar) {
                return { row, col };
            }
        }
    }
    return null;
}