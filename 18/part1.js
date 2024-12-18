const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');

const matrixSize = 6;
const bytes = null;

fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  const lines = data.trim().split('\n');
  const coordinates = lines.map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  });

  const grid = Array(matrixSize + 1).fill().map(() => Array(matrixSize + 1).fill('.'));
  for (let i = 0; i < (bytes ? bytes : coordinates.length); i++) {
    const { x, y } = coordinates[i];
    grid[y][x] = '#';
  }

  let result = dijkstra(grid, [0, 0], [matrixSize, matrixSize]);
  console.log(result);
});

function dijkstra(grid, start, end) {
  const rows = grid.length;
  const cols = grid[0].length;

  const directions = [
    [0, 1], [1, 0], [0, -1], [-1, 0] // Right, Down, Left, Up
  ];

  const isValid = (x, y) => {
    return x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y] !== '#';
  };

  const costs = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  costs[start[0]][start[1]] = 0;

  const pq = new PriorityQueue()
  pq.enqueue(0, start);

  while (!pq.isEmpty()) {
    const [x, y] = pq.dequeue();

    if (x === end[0] && y === end[1]) {
      return costs[x][y];
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (isValid(nx, ny)) {
        const newCost = costs[x][y] + 1;
        if (newCost < costs[nx][ny]) {
          costs[nx][ny] = newCost;
          pq.enqueue(newCost, [nx, ny]);
        }
      }
    }
  }

  return -1;
}

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(priority, value) {
    this.elements.push({ priority, value });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift().value;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}
