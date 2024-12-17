const fs = require('fs');

const path = './input.txt';

fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.trim().split('\n');
    const registers = { A: 0, B: 0, C: 0 };
    const program = [];

    lines.forEach(line => {
        if (line.startsWith('Register')) {
            const [register, value] = line.split(': ');
            registers[register.split(' ')[1]] = parseInt(value, 10);
        } else if (line.startsWith('Program')) {
            program.push(...line.split(': ')[1].split(',').map(Number));
        }
    });

    const result = [];
    let i = 0;

    const getComboOperandValue = (operand) => {
        if (operand <= 3) return operand;
        if (operand === 4) return registers['A'];
        if (operand === 5) return registers['B'];
        if (operand === 6) return registers['C'];
        return null;
    };

    while (i < program.length) {
        const instruction = program[i];
        const operand = program[i + 1];
        let operation = null;
        switch (instruction) {
            case 0:
                registers['A'] = Math.floor(registers['A'] / Math.pow(2, getComboOperandValue(operand)));
                break;
            case 1:
                registers['B'] ^= operand;
                break;
            case 2:
                registers['B'] = getComboOperandValue(operand) % 8;
                break;
            case 3:
                if (registers['A'] !== 0) {
                    i = operand - 2;
                }
                break;
            case 4:
                registers['B'] ^= registers['C'];
                break;
            case 5:
                operation = getComboOperandValue(operand) % 8;
                break;
            case 6:
                registers['B'] = Math.floor(registers['A'] / Math.pow(2, getComboOperandValue(operand)));
                break;
            case 7:
                registers['C'] = Math.floor(registers['A'] / Math.pow(2, getComboOperandValue(operand)));
                break;
        }

        if (operation !== null) {
            result.push(operation);
        }

        i += 2;
    }

    console.log(result.join(','));
});