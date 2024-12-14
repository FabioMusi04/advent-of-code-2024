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

  const wrapCoordinate = (value, max) => ((value % max) + max) % max;

  const isChristmasTree = (grid) => {
    const height = grid.length;
    const width = grid[0].length;
  
    let emptyLines = 0;
    let emptyCols = 0;
  
    for (let i = 0; i < height; i++) {
      const robotInLine = grid[i].some(cell => cell > 0);
      if (!robotInLine) {
        emptyLines++;
      }
    }
  
    for (let j = 0; j < width; j++) {
      let robotInColumn = false;
      for (let i = 0; i < height; i++) {
        if (grid[i][j] > 0) {
          robotInColumn = true;
          break;
        }
      }
      if (!robotInColumn) {
        emptyCols++;
      }
    }
  
    return emptyLines > 10 && emptyCols > 10;
  };
  

  let seconds = 0;
  let found = false;

  while (!found) {
    const positions = parsedData.map(({ position, velocity }) => ({
      x: wrapCoordinate(position.x + velocity.x * seconds, width),
      y: wrapCoordinate(position.y + velocity.y * seconds, height)
    }));

    const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0));

    for (const { x, y } of positions) {
      grid[y][x]++;
    }

    if (isChristmasTree(grid)) {
      found = true;
      console.log('Christmas tree found at seconds:', seconds);
    } else {
      seconds++;
    }
  }
});
