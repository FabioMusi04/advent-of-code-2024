const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const reports = data.split('\r\n').filter(line => line.trim() !== '');
    let safeCounter = 0;

    reports.forEach(report => {
        const levels = report.split(' ').map(Number);
        
        if (isSafeLevel(levels)) {
            safeCounter++;
        } 
        else if (isSafeWithRemoval(levels)) {
            safeCounter++;
        }
    });

    console.log('Safe reports count: ' + safeCounter);
});

function isSafeLevel(levels) {
    let isIncreasing = null;
    
    for (let i = 0; i < levels.length - 1; i++) {
        const change = levels[i + 1] - levels[i];
        
        if (Math.abs(change) < 1 || Math.abs(change) > 3) {
            return false;
        }
        
        const currentDirection = change > 0 ? 'increasing' : 'decreasing';
        
        if (isIncreasing === null) {
            isIncreasing = currentDirection;
        } else if (isIncreasing !== currentDirection) {
            return false;
        }
    }
    
    return true;
}

function isSafeWithRemoval(levels) {
    for (let i = 0; i < levels.length; i++) {
        const newLevels = levels.slice(0, i).concat(levels.slice(i + 1));
        
        if (isSafeLevel(newLevels)) {
            return true;
        }
    }
    
    return false;
}
