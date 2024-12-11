const fs = require('fs');

const path = './input.txt';
const input = fs.readFileSync(path, 'utf8').trim().split(' ').map(Number);

let occurrences = new Map();
input.forEach(num => occurrences.set(num, (occurrences.get(num) || 0) + 1));

for (let i = 1; i <= 75; i++) {
    const newOccurrences = new Map();
    for (const [num, count] of occurrences) {
        if (num === 0) {
            newOccurrences.set(1, (newOccurrences.get(1) || 0) + count);
        } else {
            const str = String(num);
            const len = str.length;
            if (len % 2 === 0) {
                const part1 = Number(str.slice(0, len / 2));
                const part2 = Number(str.slice(len / 2));
                newOccurrences.set(part1, (newOccurrences.get(part1) || 0) + count);
                newOccurrences.set(part2, (newOccurrences.get(part2) || 0) + count);
            } else {
                const multiplied = num * 2024;
                newOccurrences.set(multiplied, (newOccurrences.get(multiplied) || 0) + count);
            }
        }
    }
    occurrences = newOccurrences;
}

const answer = Array.from(occurrences.values()).reduce((sum, count) => sum + count, 0);
console.log(`answer part 2: ${answer}`);