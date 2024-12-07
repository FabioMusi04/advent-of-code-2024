const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const reports = data.match(/mul\(\d+,\d+\)/g);
    const values = [];
    if (reports) {
        reports.forEach(report => {
            const firstValue = report.split('(')[1].split(',')[0];
            const secondValue = report.split(',')[1].split(')')[0];
            const firstNumber = parseInt(firstValue);
            const secondNumber = parseInt(secondValue);
            if (!isNaN(firstNumber) && !isNaN(secondNumber)) {
                const result = firstNumber * secondNumber;
                values.push(result);
            }
        });
    }

    const result = values.reduce((acc, value) => acc + value, 0);
    console.log('result', result);
});