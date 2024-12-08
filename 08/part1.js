const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8");
const map = input.replace(/\r/g, "").split("\n").filter(x => x != "").map(x => x.split(""));

const locations = {};
map.forEach((row, y) => {
  row.forEach((cell, x) => {
    if (cell === ".") return;
    if (!locations[cell]) locations[cell] = [];
    locations[cell].push([x, y]); //Antenna A con tutte posizioni
  });
});

const antinodes = []; //unico
const width = map[0].length;
const height = map.length;
for (const locs of Object.values(locations)) { //locs = [[x1, y1], [x2, y2], ...]
    if (locs.length <= 1) continue;

    locs.forEach((loci, i) => {
      locs.forEach((locj, j) => {
        if (i === j) return; //non confrontare con se stesso

        [loci, locj].forEach(([x1, y1], idx) => {
          const [x2, y2] = idx === 0 ? locj : loci;
          const antinode = [x1 * 2 - x2, y1 * 2 - y2]; //calcolo antinodo
          if (!antinodes.some(([ax, ay]) => ax === antinode[0] && ay === antinode[1]) &&
            antinode[0] >= 0 && antinode[1] >= 0 && antinode[0] < width && antinode[1] < height) { //se non è già presente e se è dentro la mappa
            antinodes.push(antinode);
          }
        });
      });
    });
}

console.log(antinodes.length);