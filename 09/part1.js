const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf8").split("");

const format = [];
let counter = 0;
for(let x = 0; x < input.length; x++) {
    const num = parseInt(input[x]);
    if(x % 2 !== 0) {
        for(let j = 0; j < num; j++) {
            format.push(".");
        }
    } else {
        for(let j = 0; j < num; j++) {
            format.push(counter);
        }
        counter++;
    }
}

while (format.includes(".")) {
    const last = format.pop();
    for (let j = 0; j < format.length; j++) {
        if (format[j] === ".") {
            format[j] = last;
            break;
        }
    }
}

let sum = 0;
for(let i = 0; i < format.length; i++) {
    sum += format[i]*i;
}

console.log(sum)