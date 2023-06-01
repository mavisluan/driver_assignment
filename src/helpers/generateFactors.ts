import fs from 'fs';
import path from 'path';

function calculateFactors() {
  type FactorsMap = Map<number, number[]>;
  const factorsMap: FactorsMap = new Map();

  for (let num = 2; num <= 100; num++) {
    const factors = [];
    for (let i = 2; i <= num; i++) {
      if (num % i === 0) {
        factors.push(i);
      }
    }
    factorsMap.set(num, factors);
  }

  const data = JSON.stringify([...factorsMap]);
  fs.writeFile(path.join(__dirname, '../data/factors.json'), data, (err) => {
    if (err) throw err;
    console.log('Factors saved to factors.json');
  });
}

calculateFactors();
