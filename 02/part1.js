const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const reports = data.split('\r\n');
    const maxChange = 3;
    const minChange = 1;
    let counter = 0;

    reports.forEach(row => {
        const levels = row.split(' ').map(Number);
        if (isLevelSafe(levels, minChange, maxChange)) {
            console.log(levels + ' is safe');
            counter++;
        }
    });

    console.log('Safe levels: ' + counter);
});

function isLevelSafe(levels, minChange, maxChange) {
    let direction = null;

    for (let i = 0; i < levels.length - 1; i++) {
        const change = levels[i + 1] - levels[i];
        if (Math.abs(change) <= maxChange && Math.abs(change) >= minChange) {
            const currentDirection = change > 0 ? 1 : -1;
            if (direction === null) {
                direction = currentDirection;
            } else if (direction !== currentDirection) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
}
