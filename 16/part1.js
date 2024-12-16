const fs = require('fs');

function readMatrixFromFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const matrix = data.trim().split('\n').map(line => line.split(''));
  return matrix;
}

function findPositions(matrix) {
  let startPos = null;
  let endPos = null;

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'S') {
        startPos = [i, j];
      } else if (matrix[i][j] === 'E') {
        endPos = [i, j];
      }
    }
  }

  return { startPos, endPos };
}

function calculatePath(maze, start, end) {
  const dx = [-1, 0, 1, 0]; // North, East, South, West
  const dy = [0, 1, 0, -1];
  const [startX, startY] = start;
  const [endX, endY] = end;

  const pq = [[0, startX, startY, 1]];
  const visited = new Set();

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, x, y, direction] = pq.shift();

    const state = `${x},${y},${direction}`;
    if (visited.has(state)) continue;
    visited.add(state);

    if (x === endX && y === endY) return cost;

    const nx = x + dx[direction];
    const ny = y + dy[direction];
    if (maze[nx][ny] !== '#') {
      pq.push([cost + 1, nx, ny, direction]);
    }

    // Rotate clockwise
    const clockwiseDir = (direction + 1) % 4;
    pq.push([cost + 1000, x, y, clockwiseDir]);

    // Rotate counterclockwise
    const counterclockwiseDir = (direction + 3) % 4; // Equivalent to (direction - 1 + 4) % 4
    pq.push([cost + 1000, x, y, counterclockwiseDir]);
  }

  return -1;
}


const filePath = './input.txt';
const matrix = readMatrixFromFile(filePath);
const positions = findPositions(matrix);
const pathCost = calculatePath(matrix, positions.startPos, positions.endPos);

console.log(`The cost of the path is: ${pathCost}`);
