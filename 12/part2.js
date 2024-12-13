const fs = require('fs');
let input = fs.readFileSync('./input.txt', 'utf-8');

input = input.split('\r\n');

if (input[input.length - 1] === '') {
  input.pop();
}

let total = 0;
const visited = new Set();

for (let i = 0; i < input.length; i++) {
  for (let j = 0; j < input[0].length; j++) {
    if (!visited.has(`${i},${j}`)) {
      bfs([i, j]);
    }
  }
}

function bfs(p) {
  let plotArea = 0;

  let edges = new Set();
  let edgeCount = 0;

  const val = input[p[0]][p[1]];

  const queue = [p];

  while (queue.length > 0) {
    const current = queue.shift();
    const key = current.join(',');

    if (visited.has(key)) {
      continue;
    } else {
      visited.add(key);
    }

    plotArea += 1;

    let neighbors = getNeighbors(current);
    for (let polarity = 0; polarity < neighbors.length; polarity++) {
      let neighbor = neighbors[polarity];
      if (!inBounds(neighbor) || input[neighbor[0]][neighbor[1]] !== val) {
        edgeCount += 1;

        edges.add(`${polarity},${neighbor[0]},${neighbor[1]}`);

        for (const n2 of getNeighbors(neighbor)) {
          if (edges.has(`${polarity},${n2[0]},${n2[1]}`)) {
            edgeCount -= 1;
          }
        }
      } else {
        queue.push(neighbor);
      }
    }
  }

  const price = plotArea * edgeCount;
  console.log('area', plotArea);
  console.log('edges', edgeCount);

  total += price;
}

console.log('total', total);

function getNeighbors(point) {
  const [x, y] = point;
  const ns = [];
  for (const vect of [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ]) {
    let x1 = x + vect[0];
    let y1 = y + vect[1];
    ns.push([x1, y1]);
  }
  return ns;
}

function inBounds(p) {
  const [x, y] = p;
  if (x < 0 || y < 0 || x >= input.length || y >= input[0].length) {
    return false;
  }
  return true;
}