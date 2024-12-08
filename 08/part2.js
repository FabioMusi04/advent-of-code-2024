const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const map = input.replace(/\r/g, "").split("\n").filter(line => line !== "").map(line => line.split(""));

const locations = {};

for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        if (cell !== ".") { 
            if (!locations[cell]) locations[cell] = [];
            locations[cell].push([x, y]);
        }
    }
}

const antinodes = [];

const width = map[0].length;
const height = map.length;

const isValidPosition = (x, y) => x >= 0 && y >= 0 && x < width && y < height;

const addAntinodeIfNew = (x, y) => {
    if (isValidPosition(x, y) && !antinodes.some(([ax, ay]) => ax === x && ay === y)) {
        antinodes.push([x, y]);
    }
};

for (const locs of Object.values(locations)) {
    if (locs.length <= 1) continue; 

    for (let i = 0; i < locs.length; i++) {
        for (let j = 0; j < locs.length; j++) {
            if (i === j) continue;

            const [x1, y1] = locs[i];
            const [x2, y2] = locs[j];

            let antinode1 = [x1, y1];
            while (isValidPosition(antinode1[0], antinode1[1])) {
                antinode1[0] += (x1 - x2);
                antinode1[1] += (y1 - y2);
                addAntinodeIfNew(antinode1[0], antinode1[1]);
            }

            let antinode2 = [x2, y2];
            while (isValidPosition(antinode2[0], antinode2[1])) {
                antinode2[0] += (x2 - x1);
                antinode2[1] += (y2 - y1);
                addAntinodeIfNew(antinode2[0], antinode2[1]);
            }

            addAntinodeIfNew(x1, y1);
            addAntinodeIfNew(x2, y2);
        }
    }
}

console.log(antinodes.length);
