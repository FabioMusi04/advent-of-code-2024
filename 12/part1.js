const fs = require('fs');

function readFileAsMatrix(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\r\n');
    const matrix = lines.map(line => line.split(''));
    return matrix;
}

const filePath = './input.txt';
const matrix = readFileAsMatrix(filePath);

function findRegions(matrix) {
    const visited = Array.from({ length: matrix.length }, () => Array(matrix[0].length).fill(false));
    const regions = new Map();
    let regionId = 0;

    function dfs(x, y, letter) {
        if (x < 0 || y < 0 || x >= matrix.length || y >= matrix[0].length || visited[x][y] || matrix[x][y] !== letter) {
            return 0;
        }
        visited[x][y] = true;
        let perimeter = 0;

        const directions = [
            [1, 0], [-1, 0], [0, 1], [0, -1]
        ];

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= matrix.length || ny >= matrix[0].length || matrix[nx][ny] !== letter) {
                perimeter++;
            } else {
                perimeter += dfs(nx, ny, letter);
            }
        }

        regions.set(regionId, (regions.get(regionId) || { letter, area: 0, perimeter: 0 }));
        regions.get(regionId).area++;
        regions.get(regionId).perimeter += perimeter;

        return 0;
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (!visited[i][j]) {
                const letter = matrix[i][j];
                if (letter) {
                    dfs(i, j, letter);
                    regionId++;
                }
            }
        }
    }

    for (let [key, value] of regions) {
        value.price = value.area * value.perimeter;
    }

    return regions;
}

const regions = findRegions(matrix);

const sum = Array.from(regions.values()).reduce((acc, { price }) => acc + price, 0);
console.log(sum);