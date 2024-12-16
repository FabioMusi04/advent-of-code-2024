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

function getKey(coord, direction) {
  return `${coord[0]},${coord[1]},${direction}`;
}

const dirs = [
  [-1, 0],  // North
  [0, 1],   // East
  [1, 0],   // South
  [0, -1]   // West
];

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

function getPaths(matrix, start, end, lowestScore) {
  const queue = [[start[0], start[1], 1, 0, [start]]]; 
  const visited = new Map();
  const paths = [];

  while (queue.length) {
    const [x, y, dir, score, path] = queue.shift();
    const state = getKey([x, y], dir);

    if (score > lowestScore) continue;
    if (visited.has(state) && visited.get(state) < score) continue;
    visited.set(state, score);

    if (x === end[0] && y === end[1] && score === lowestScore) {
      paths.push(path);
      continue;
    }

    const nx = x + dirs[dir][0];
    const ny = y + dirs[dir][1];
    if (matrix[nx]?.[ny] !== '#') {
      queue.push([nx, ny, dir, score + 1, [...path, [nx, ny]]]);
    }

    queue.push([x, y, (dir + 1) % 4, score + 1000, [...path]]);

    queue.push([x, y, (dir + 3) % 4, score + 1000, [...path]]);
  }

  return paths;
}

function markBestPath(matrix, paths) {
  const uniquePositions = new Set();

  paths.forEach(path => {
    path.forEach(pos => {
      uniquePositions.add(getKey(pos, 0));
    });
  });

  console.log(`Unique positions: ${uniquePositions.size}`);
  
  paths[0].forEach(([x, y]) => {
    matrix[x][y] = 'O';
  });
}

const filePath = './input.txt';
const matrix = readMatrixFromFile(filePath);
const positions = findPositions(matrix);
const bestScore = calculatePath(matrix, positions.startPos, positions.endPos);
const paths = getPaths(matrix, positions.startPos, positions.endPos, bestScore);

markBestPath(matrix, paths);
