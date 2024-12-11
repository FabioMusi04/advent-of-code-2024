const fs = require('fs');

const path = './input.txt';

fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    let numbers = data.trim().split(' ').map(Number);
    const times = 25;

    for (let j = 1; j <= times; j++) {
        const newNumbers = [];
        numbers.forEach(value => {
            if (value === 0) {
                newNumbers.push(1);
            } else if (value.toString().length % 2 === 0) {
                const str = value.toString();
                const half = Math.floor(str.length / 2);
                newNumbers.push(Number(str.slice(0, half)), Number(str.slice(half)));
            } else {
                newNumbers.push(value * 2024);
            }
        });
        numbers = newNumbers;
    }

    console.log(numbers.length);

});