const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');

fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.trim().split('\n');
    const parsedData = lines.map(line => {
        const [p, v] = line.split(' ');
        const [px, py] = p.slice(2).split(',').map(Number);
        const [vx, vy] = v.slice(2).split(',').map(Number);
        return { position: { x: px, y: py }, velocity: { x: vx, y: vy } };
    });

    const width = 101;
    const height = 103;
    const seconds = 100;

    const wrapCoordinate = (value, max) => ((value % max) + max) % max;

    const positions = parsedData.map(({ position, velocity }) => ({
        x: wrapCoordinate(position.x + velocity.x * seconds, width),
        y: wrapCoordinate(position.y + velocity.y * seconds, height)
    }));

    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

    for (const { x, y } of positions) {
        grid[y][x]++; 
    }

    for (const row of grid) {
        console.log(row.map(cell => (cell === 0 ? '.' : cell)).join(''));
    }

    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);

    const quadrants = [0, 0, 0, 0];

    for (const { x, y } of positions) {
        if (x === midX || y === midY) continue; // Ignore robots on the middle lines

        if (x < midX && y < midY) quadrants[0]++; // Top-left
        else if (x >= midX && y < midY) quadrants[1]++; // Top-right
        else if (x < midX && y >= midY) quadrants[2]++; // Bottom-left
        else if (x >= midX && y >= midY) quadrants[3]++; // Bottom-right
    }

    const safetyFactor = quadrants.reduce((prod, count) => prod * count, 1);
    console.log('Safety factor:', safetyFactor);
});
