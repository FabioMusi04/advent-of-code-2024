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

const isClique = (set) => {
  for (let pc1 of set) {
    for (let pc2 of set) {
      if (pc1 !== pc2 && !connections.get(pc1).has(pc2)) {
        return false;
      }
    }
  }
  return true;
};

const findLargestClique = (nodes, currentClique = []) => {
  if (nodes.length === 0) return currentClique;

  let maxClique = currentClique;

  for (let i = 0; i < nodes.length; i++) {
    const newClique = [...currentClique, nodes[i]];
    if (isClique(newClique)) {
      const remainingNodes = nodes.slice(i + 1);
      const clique = findLargestClique(remainingNodes, newClique);
      if (clique.length > maxClique.length) {
        maxClique = clique;
      }
    }
  }

  return maxClique;
};

const allNodes = Array.from(connections.keys());
const largestClique = findLargestClique(allNodes);

console.log(`Largest LAN party set: ${largestClique.sort().join(',')}`);