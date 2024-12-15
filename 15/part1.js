const fs = require('fs');

fs.readFile('input.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lines = data.split('\r\n');

  const matrix = [];
  const charSequence = [];
  let readingMatrix = true;

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (readingMatrix) {
        matrix.push(line.trim().split(''));
      }
    } else if (line.trim()) {
      readingMatrix = false;
      charSequence.push(...line.trim().split(''));
    }
  }

  for (const char of charSequence) {
    const robot = robotPosition(matrix);
    if (robot === null) {
      console.log('Robot not found');
      return;
    }
    const x = robot.x;
    const y = robot.y;
    switch (char) {
      case '>':
        if (y + 1 < matrix[0].length && (matrix[x][y + 1] === '.')) {
          matrix[x][y] = '.';
          matrix[x][y + 1] = '@';
        } else if (y + 2 < matrix[0].length && matrix[x][y + 1] === 'O') {
          const thereIsWall = isThereEnoughSpot(matrix, x, y, '>');
          if (!thereIsWall.isValid) {
            break;
          }
          if (thereIsWall.countChars === 1) {
            matrix[x][y + 2] = 'O';
          } else {
            matrix[thereIsWall.dotPosition.x][thereIsWall.dotPosition.y] = 'O';
          }
          matrix[x][y] = '.';
          matrix[x][y + 1] = '@';
        }
        break;
      case '<':
        if (y - 1 >= 0 && (matrix[x][y - 1] === '.')) {
          matrix[x][y] = '.';
          matrix[x][y - 1] = '@';
        } else if (y - 2 >= 0 && matrix[x][y - 1] === 'O') {
          const thereIsWall = isThereEnoughSpot(matrix, x, y, '<');

          if (!thereIsWall.isValid) {
            break;
          }
          if (thereIsWall.countChars === 1) {
            matrix[x][y - 2] = 'O';
          } else {
            matrix[thereIsWall.dotPosition.x][thereIsWall.dotPosition.y] = 'O';
          }
          matrix[x][y] = '.';
          matrix[x][y - 1] = '@';
        }
        break;
      case '^':
        if (x - 1 >= 0 && (matrix[x - 1][y] === '.')) {
          matrix[x][y] = '.';
          matrix[x - 1][y] = '@';
        } else if (x - 2 >= 0 && matrix[x - 1][y] === 'O') {
          const thereIsWall = isThereEnoughSpot(matrix, x, y, '^');

          if (!thereIsWall.isValid) {
            break;
          }
          if (thereIsWall.countChars === 1) {
            matrix[x - 2][y] = 'O';
          } else {
            matrix[thereIsWall.dotPosition.x][thereIsWall.dotPosition.y] = 'O';
          }
          matrix[x][y] = '.';
          matrix[x - 1][y] = '@';
        }
        break;
      case 'v':
        if (x + 1 < matrix.length && (matrix[x + 1][y] === '.')) {
          matrix[x][y] = '.';
          matrix[x + 1][y] = '@';
        } else if (x + 2 < matrix.length && matrix[x + 1][y] === 'O') {
          const thereIsWall = isThereEnoughSpot(matrix, x, y, 'v');

          if (!thereIsWall.isValid) {
            break;
          }
          if (thereIsWall.countChars === 1) {
            matrix[x + 2][y] = 'O';
          } else {
            matrix[thereIsWall.dotPosition.x][thereIsWall.dotPosition.y] = 'O';
          }
          matrix[x][y] = '.';
          matrix[x + 1][y] = '@';
        }
        break;
      default:
        console.log('Invalid character');
        return;
    }
  }
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'O') {
        sum += i * 100 + j;
      }
    }
  }
  console.log(sum);
});

function robotPosition(matrix) {
  let x = 0;
  let y = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === '@') {
        x = i;
        y = j;
        return { x, y };
      }
    }
  }
  return null;
}

function isThereEnoughSpot(matrix, x, y, direction) {
  let countChars = 0;
  let dotPosition = null;
  let i = x;
  let j = y;

  switch (direction) {
    case '>':
      j++;
      break;
    case '<':
      j--;
      break;
    case '^':
      i--;
      break;
    case 'v':
      i++;
      break;
    default:
      return { isValid: false, countChars: 0 };
  }

  while (i >= 0 && i < matrix.length && j >= 0 && j < matrix[i].length) {
    if (matrix[i][j] === 'O') {
      countChars++;
    } else if (matrix[i][j] === '.') {
      dotPosition = { x: i, y: j };
      break;
    } else {
      break;
    }
    switch (direction) {
      case '>':
        j++;
        break;
      case '<':
        j--;
        break;
      case '^':
        i--;
        break;
      case 'v':
        i++;
        break;
    }
  }
  return { isValid: dotPosition ? true : false, dotPosition, countChars };
}
