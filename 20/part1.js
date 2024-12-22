const fs = require('fs');

function readLines(inputFilePath) {
  const input = fs.readFileSync(inputFilePath, 'utf-8');
  return input.replace(/\r\n/g, '\n').split('\n');
}

function solve(inputLines) {
  const { grid, start, end } = parseInput(inputLines);

  const path = findPath(grid, start, end);

  return solvePart(path, 2)
}

function parseInput(inputLines) {
  const grid = inputLines.map((l) => l.split(''));

  let start = null;
  let end = null;

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] === 'S') {
        start = { y, x };
      }

      if (row[x] === 'E') {
        end = { y, x };
      }
    }
  }

  if (!start) throw new Error('No start point');
  if (!end) throw new Error('No end point');

  return { grid, start, end };
}

function findPath(grid, start, end) {
  const endPosId = posId(end);
  const path = new Map();

  let steps = 0;
  path.set(posId(start), { ...start, steps });

  const queue = [start];

  while (queue.length) {
    const currentPos = queue.shift();

    if (posId(currentPos) === endPosId) {
      return path;
    }

    getNeighbors({
      grid,
      currentPos,
      isNeighborAllowed: (value, pos) => value !== '#' && !path.has(posId(pos)),
    }).forEach((pos) => {
      steps++;
      path.set(posId(pos), { ...pos, steps });
      queue.push(pos);
    });
  }

  return path;
}

function solvePart(path, maxCheatTime) {
  const cheats = findCheats(path, maxCheatTime);
  const numOfCheatsBySavedSteps = cheats.reduce((acc, savedSteps) => {
    if (acc[savedSteps] === undefined) {
      acc[savedSteps] = 0;
    }

    acc[savedSteps]++;

    return acc;
  }, {});

  const countOfCheatsWithOver100StepsSaved = Object.entries(
    numOfCheatsBySavedSteps
  ).reduce((sum, [savedSteps, numberOfCheats]) => {
    if (Number(savedSteps) >= 100) {
      sum += numberOfCheats;
    }
    return sum;
  }, 0);

  return countOfCheatsWithOver100StepsSaved;
}

function findCheats(pathMap, maxCheatTime) {
  const pathArr = [...pathMap.values()];
  const cheats = [];

  for (let i = 0; i < pathArr.length - 1; i++) {
    for (let j = i + 1; j < pathArr.length; j++) {
      const posA = pathArr[i];
      const posB = pathArr[j];
      const stepsSaved = posB.steps - posA.steps;
      const distance = Math.abs(posA.x - posB.x) + Math.abs(posA.y - posB.y);

      if (distance > maxCheatTime) {
        continue;
      }

      const saved = stepsSaved - distance;
      if (saved > 0) {
        cheats.push(saved);
      }
    }
  }

  return cheats;
}

function posId(pos) {
  return `${pos.y},${pos.x}`;
}

function getNeighbors({ grid, currentPos, isNeighborAllowed }) {
  const directions = [
    { y: -1, x: 0 }, // Up
    { y: 1, x: 0 },  // Down
    { y: 0, x: -1 }, // Left
    { y: 0, x: 1 },  // Right
  ];

  return directions
    .map((dir) => ({
      y: currentPos.y + dir.y,
      x: currentPos.x + dir.x,
    }))
    .filter((pos) => {
      const value = grid[pos.y] && grid[pos.y][pos.x];
      return value && isNeighborAllowed(value, pos);
    });
}

const inputLines = readLines('./input.txt');
const result = solve(inputLines);
console.log(result);
