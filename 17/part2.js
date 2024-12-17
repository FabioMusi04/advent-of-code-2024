const fs = require('fs');

const path = './input.txt';

fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.trim().split('\n');
    const registers = { A: 0, B: 0, C: 0 }; // Use numbers instead of BigInt
    const program = [];

    lines.forEach(line => {
        if (line.startsWith('Register')) {
            const [register, value] = line.split(': ');
            registers[register.split(' ')[1]] = Number(value); // Parse value as Number
        } else if (line.startsWith('Program')) {
            program.push(...line.split(': ')[1].split(',').map(x => Number(x))); // Map program values to Numbers
        }
    });

    // Run function
    const runProgram = (A, B, C, program) => {
        let ptr = 0;
        const out = [];
        while (program[ptr] !== undefined) {
            const code = program[ptr];
            const operand = program[ptr + 1];
            let combo;
            if ([0, 1, 2, 3].includes(operand)) combo = operand;
            if (operand === 4) combo = A;
            if (operand === 5) combo = B;
            if (operand === 6) combo = C;

            if (code === 0) A = Math.floor(A / Math.pow(2, combo)); // Use Math for division
            if (code === 1) B = (B ^ operand) >>> 0; // Use unsigned xor
            if (code === 2) B = ((combo % 8) + 8) % 8; // Modulus to ensure correct output

            let jumped = false;
            if (code === 3 && A !== 0) {
                ptr = operand;
                jumped = true;
            }
            if (code === 4) B = (B ^ C) >>> 0;
            if (code === 5) out.push((combo % 8 + 8) % 8); // Store output value, with modulus
            if (code === 6) B = Math.floor(A / Math.pow(2, combo));
            if (code === 7) C = Math.floor(A / Math.pow(2, combo));

            if (!jumped) ptr += 2;
        }
        return out.join(','); // Join output as a string
    };

    console.log('Initial run result:', runProgram(registers.A, registers.B, registers.C, program));

    const Q = [];
    Q.push({ result: '', len: 0 });
    while (Q.length) {
        const q = Q.shift();
        if (q.len === program.length) {
            console.log('Best result found:', parseInt(q.result, 2));
            break;
        }

        const from = parseInt(q.result + '000', 2);
        const to = parseInt(q.result + '111', 2);
        const expect = program.slice((q.len + 1) * -1).join(',');

        for (let a = from; a <= to; a++) {
            const r = runProgram(a, registers.B, registers.C, program);
            if (r === expect) {
                Q.push({ result: a.toString(2), len: q.len + 1 });
            }
        }
    }

    /* 
    For part 2, knowing that every time 3 bits of A is used, we can work from the last program output to determine the leading bits, and then search via leading bits + [000 - 111] iteratively until the program length is matched.
    https://www.reddit.com/r/adventofcode/comments/1hg38ah/comment/m2hdaoc/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    */
});
