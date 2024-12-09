const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").trim().split("");

const parseDiskBlocks = (input) => {
    const format = [];
    let counter = 0;
    for (let x = 0; x < input.length; x++) {
        const num = parseInt(input[x]);
        if (x % 2 !== 0) {
            for (let j = 0; j < num; j++) {
                format.push(".");
            }
        } else {
            for (let j = 0; j < num; j++) {
                format.push(counter);
            }
            counter++;
        }
    }
    return format;
};

const computeChecksum = (diskBlocks) =>
    diskBlocks.reduce((checksum, block, index) => checksum + (block !== "." ? index * block : 0), 0);

const compactDisk = (diskBlocks) => {
    const files = [];
    const freeSpans = [];

    diskBlocks.forEach((block, i) => {
        if (block !== ".") {
            files[block] ??= { id: block, size: 0, positions: [] };
            files[block].positions.push(i);
            files[block].size++;
        } else if (!freeSpans.length || freeSpans.at(-1).end + 1 !== i) {
            freeSpans.push({ start: i, end: i, size: 1 });
        } else {
            freeSpans.at(-1).end++;
            freeSpans.at(-1).size++;
        }
    });

    files.reverse().forEach((file) => {
        if (!file) return;

        const { size, positions } = file;
        const fileStartPos = positions[0];
        const targetSpan = freeSpans.find((span) => span.size >= size && span.end < fileStartPos);

        if (targetSpan) {
            positions.forEach((pos) => (diskBlocks[pos] = "."));
            for (let i = 0; i < size; i++) {
                diskBlocks[targetSpan.start + i] = file.id;
            }

            if (targetSpan.size === size) {
                freeSpans.splice(freeSpans.indexOf(targetSpan), 1);
            } else {
                targetSpan.start += size;
                targetSpan.size -= size;
            }

            freeSpans.push({
                start: fileStartPos,
                end: fileStartPos + size - 1,
                size
            });
        }
    });

    return diskBlocks;
};

const main = () => {
    const diskBlocks = parseDiskBlocks(input);
    const compactedBlocks = compactDisk(diskBlocks);
    const checksum = computeChecksum(compactedBlocks);
    console.log("Checksum:", checksum);
};

main();
