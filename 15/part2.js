const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const { robot, map, directions } = parseInput(data);

  for (const dir of directions) {
    move(robot, map, dir);
  }

  const result = calculateGPS(map);
  console.log(result);
});

function parseInput(input) {
  const robot = { x: 0, y: 0 };
  const [mapInput, directionsInput] = input.split('\n\r');
  const map = [];
  mapInput.split('\n').forEach((line, y) => {
    const row = [];
    line.split('').forEach((cell, x) => {
      switch (cell) {
        case '#':
          row.push('#');
          row.push('#');
          break;
        case '.':
          row.push('.');
          row.push('.');
          break;
        case 'O':
          row.push('[');
          row.push(']');
          break;
        case '@':
          row.push('.');
          row.push('.');
          robot.x = x * 2;
          robot.y = y;
          break;
      }
    });
    map.push(row);
  });
  const directions = directionsInput.replaceAll("\n", "").split('');
  return { robot, map, directions };
}

function move(robot, map, dir) {
  const { x, y } = getNewPosition(robot, dir);
  const desiredCellValue = map[y][x];

  if (desiredCellValue === '.') {
    robot.x = x;
    robot.y = y;
  } else if (desiredCellValue === '#') {
    return;
  } else if (desiredCellValue === '[' || desiredCellValue === ']') {
    const moveableBoxes = getMoveableBoxes(robot, [], map, dir);
    if (moveableBoxes !== false && moveableBoxes.length > 0) {
      moveBoxes(moveableBoxes, robot, map, dir);
    }
  }
}

function getNewPosition({ x, y }, dir) {
  switch (dir) {
    case '<':
      x--;
      break;
    case '>':
      x++;
      break;
    case '^':
      y--;
      break;
    case 'v':
      y++;
      break;
  }
  return { x, y };
}

function getMoveableBoxes(current, stack, map, dir) {
  let nextPosition = getNewPosition(current, dir);
  let nextCellValue = map[nextPosition.y][nextPosition.x];

  if (dir === '<' || dir === '>') {
    if (nextCellValue === '#') {
      return false;
    } else if (nextCellValue === ']' && dir === '<') {
      return getMoveableBoxes({ x: nextPosition.x - 1, y: nextPosition.y }, [...stack, { x: nextPosition.x - 1, y: nextPosition.y }], map, dir);
    } else if (nextCellValue === '[' && dir === '>') {
      return getMoveableBoxes({ x: nextPosition.x + 1, y: nextPosition.y }, [...stack, { x: nextPosition.x, y: nextPosition.y }], map, dir);
    } else if (nextCellValue === '.') {
      return stack;
    }
  } else if (dir === '^' || dir === 'v') {
    if (nextCellValue === '#') {
      return false;
    } else if (nextCellValue === ']') {
      const leftStack = getMoveableBoxes({ x: nextPosition.x - 1, y: nextPosition.y }, [...stack, { x: nextPosition.x - 1, y: nextPosition.y }], map, dir);
      if (leftStack !== false) {
        return getMoveableBoxes(nextPosition, [...leftStack], map, dir);
      } else {
        return false;
      }
    } else if (nextCellValue === '[') {
      const rightStack = getMoveableBoxes({ x: nextPosition.x + 1, y: nextPosition.y }, [...stack, { x: nextPosition.x, y: nextPosition.y }], map, dir);
      if (rightStack !== false) {
        return getMoveableBoxes(nextPosition, [...rightStack], map, dir);
      } else {
        return false;
      }
    } else if (nextCellValue === '.') {
      return stack;
    }
  }
  return stack;
}

function moveBoxes(moveableBoxes, robot, map, dir) {
  const uniqSet = new Set(moveableBoxes.map(b => JSON.stringify(b)));
  const stack = [...uniqSet].map(b => JSON.parse(b));

  if (stack.length) {
    const newRobotPosition = getNewPosition(robot, dir);
    robot.x = newRobotPosition.x;
    robot.y = newRobotPosition.y;

    stack.sort((a, b) => {
      switch (dir) {
        case '<':
          return b.x - a.x;
        case '>':
          return a.x - b.x;
        case '^':
          return b.y - a.y;
        case 'v':
          return a.y - b.y;
      }
    });
  }

  while (stack.length) {
    const { x, y } = stack.pop();
    switch (dir) {
      case '<':
        map[y][x + 1] = '.';
        map[y][x] = ']';
        map[y][x - 1] = '[';
        break;
      case '>':
        map[y][x] = '.';
        map[y][x + 1] = '[';
        map[y][x + 2] = ']';
        break;
      case '^':
        map[y - 1][x] = '[';
        map[y - 1][x + 1] = ']';
        map[y][x] = '.';
        map[y][x + 1] = '.';
        break;
      case 'v':
        map[y + 1][x] = '[';
        map[y + 1][x + 1] = ']';
        map[y][x] = '.';
        map[y][x + 1] = '.';
        break;
    }
  }
}

function calculateGPS(map) {
  let sum = 0;
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 2; x < map[0].length - 2; x++) {
      if (map[y][x] === '[') {
        sum += (100 * y) + x;
      }
    }
  }
  return sum;
}
