function parseMap(input) {
    const map = input.trim().split("\n").map(row => row.split(''));
    let guard = { x: 0, y: 0, dir: 'up' };
    const directions = { '^': 'up', '>': 'right', 'v': 'down', '<': 'left' };

    // Find the guard's position and direction
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if ('^>v<'.includes(cell)) {
                guard = { x, y, dir: directions[cell] };
                map[y][x] = '.'; // Replace guard symbol with empty space
            }
        });
    });

    return { map, guard };
}

function findLoopObstacles(map, guard) {
    const directions = ['up', 'right', 'down', 'left'];
    const deltas = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
    
    const canCauseLoop = (testMap, startGuard) => {
        const visited = new Set();
        let steps = 0;

        const guard = { ...startGuard };

        while (true) {
            const positionKey = `${guard.x},${guard.y},${guard.dir}`;
            if (visited.has(positionKey)) return true;
            if (steps > map.length * map[0].length * 10) return false;
            visited.add(positionKey);

            const [dx, dy] = deltas[guard.dir];
            const nx = guard.x + dx, ny = guard.y + dy;

            if (ny < 0 || ny >= testMap.length || nx < 0 || nx >= testMap[0].length) return false;

            if (testMap[ny][nx] === '#') {
                const dirIndex = (directions.indexOf(guard.dir) + 1) % 4;
                guard.dir = directions[dirIndex];
            } else {
                guard.x = nx;
                guard.y = ny;
            }
            steps++;
        }
    };

    const possibleObstacles = new Set();

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] !== '.' || (x === guard.x && y === guard.y)) continue;

            const testMap = map.map(row => [...row]);
            testMap[y][x] = '#';

            if (canCauseLoop(testMap, guard)) {
                possibleObstacles.add(`${x},${y}`);
            }
        }
    }

    return possibleObstacles.size;
}

// Run Part 2
const fs = require("fs");
const input = fs.readFileSync("input.txt", "utf8");

const { map, guard } = parseMap(input);
const part2Answer = findLoopObstacles(map, guard);
console.log("Part 2 Answer:", part2Answer);
