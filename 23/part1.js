const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'input.txt');

const data = fs.readFileSync(inputFilePath, 'utf8');
const lines = data.trim().split('\r\n');
const connections = new Map();

lines.forEach(line => {
  const [pc1, pc2] = line.split('-');
  if (!connections.has(pc1)) connections.set(pc1, new Set());
  if (!connections.has(pc2)) connections.set(pc2, new Set());
  connections.get(pc1).add(pc2);
  connections.get(pc2).add(pc1);
});

const result = new Set();

connections.forEach((connectedToPc1, pc1) => {
  connectedToPc1.forEach(pc2 => {
    connections.get(pc2).forEach(pc3 => {
      if (pc1 !== pc3 && connections.get(pc3).has(pc1)) {
        const trio = [pc1, pc2, pc3].sort().join(',');
        result.add(trio);
      }
    });
  });
});

const filteredResult = Array.from(result).filter(trio => trio.split(',').some(pc => pc.startsWith('t')));

console.log(`Total sets: ${filteredResult.length}`);
