function calculateTrailheadScores(mapInput) {
    const map = mapInput.trim().split("\r\n").map(line => line.split("").map(Number));
    const rows = map.length;
    const cols = map[0].length;

    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0] // right, down, left, up
    ];

    function isValid(x, y) {
        return x >= 0 && x < rows && y >= 0 && y < cols;
    }

    function bfs(startX, startY) {
        const queue = [[startX, startY, 0]]; // [x, y, height]
        const visited = new Set();
        const reachableNines = new Set();

        while (queue.length > 0) {
            const [x, y, height] = queue.shift();
            const key = `${x},${y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            if (map[x][y] === 9) {
                reachableNines.add(key);
                continue;
            }

            for (const [dx, dy] of directions) {
                const nx = x + dx, ny = y + dy;
                if (isValid(nx, ny) && !visited.has(`${nx},${ny}`) && map[nx][ny] === height + 1) {
                    queue.push([nx, ny, map[nx][ny]]);
                }
            }
        }

        return reachableNines.size;
    }

    let totalScore = 0;

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (map[x][y] === 0) {
                totalScore += bfs(x, y);
            }
        }
    }

    return totalScore;
}

const fs = require("fs");
const path = require("path");
const exampleMap = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");


console.log(calculateTrailheadScores(exampleMap));