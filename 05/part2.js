const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'input.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const input = data.split('\r\n');

    const arrayDivisionChar = "";
    const divider = input.indexOf(arrayDivisionChar);

    const rules = input.slice(0, divider);
    const ordered = input.slice(divider + 1);
    

    const ruleMap = new Map(); 
    rules.forEach(rule => {
        const [key, value] = rule.split('|');
        ruleMap.set(parseInt(key), [parseInt(value), ...ruleMap.get(parseInt(key)) || []]);
    });

    const orderedMap = new Map();
    ordered.forEach((order, index) => {
        const row = order.split(',').map(Number);
        orderedMap.set(index, row);
    });


    let sum = 0;
    for(const value of orderedMap.values()) {
        let beforeRule = [];
        for(const number of value) {
            const rules = ruleMap.get(number);
            if(rules && beforeRule.includes(number) === false) {
                const hasToBeAddedBefore = checkRule(beforeRule, rules, number);
                if (hasToBeAddedBefore.length > 0) {
                    for(const rule of hasToBeAddedBefore) {
                        const indexOf = beforeRule.indexOf(rule);
                        beforeRule.splice(indexOf, 0, number);
                    }

                    const uniqueArr = beforeRule.filter((value, index, self) => {
                        return self.indexOf(value) === index;  // Keep only the first occurrence of each element
                    });

                    beforeRule = uniqueArr;


                }
                else {
                    beforeRule.push(number);
                }
            }
            else if (!rules && beforeRule.includes(number) === false) {
                beforeRule.push(number);
            }
        }
                    
        if(beforeRule.length === value.length && beforeRule.every((v, i) => v === value[i])) {
           /*  console.log('OK');
            const middleIndex = Math.floor(beforeRule.length / 2);
            const middleValue = beforeRule[middleIndex];
            sum += middleValue; */
        }
        else {
            console.log('NOK');
            console.log(beforeRule)
            const middleIndex = Math.floor(beforeRule.length / 2);
            const middleValue = beforeRule[middleIndex];
            sum += middleValue;
        }
    }

    console.log(sum);
});

function checkRule(beforeRule, rules, value) {
    let found = [];
    for(const rule of rules) {
        const indexOf = beforeRule.indexOf(rule);
        if(indexOf === -1) {
            continue;
        }
        found.push(rule);
    }  
    
    return found;
}