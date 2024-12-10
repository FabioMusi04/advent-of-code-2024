function parseMap(input) {
    return input.trim().split("\r\n").map(line => line.split("").map(Number));
}

function isValidMove(x, y, prevHeight, map) {
    return (
        x >= 0 &&
        y >= 0 &&
        x < map.length &&
        y < map[0].length &&
        map[x][y] === prevHeight + 1
    );
}

function findTrails(map, startX, startY) {
    const directions = [
        [0, 1],  
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    const trails = new Set();

    function dfs(x, y, trail) {
        if (map[x][y] === 9) {
            trails.add(trail.join("->")); // Add the trail as a unique path
            return;
        }

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (isValidMove(nx, ny, map[x][y], map)) {
                dfs(nx, ny, trail.concat([`${nx},${ny}`]));
            }
        }
    }

    dfs(startX, startY, [`${startX},${startY}`]);

    return trails.size;
}

function calculateTrailheadRatings(input) {
    const map = parseMap(input);
    let totalRating = 0;

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            if (map[x][y] === 0) { 
                totalRating += findTrails(map, x, y);
            }
        }
    }

    return totalRating;
}

const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");

console.log(calculateTrailheadRatings(input));
