const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);

const sls = [];

let sl;
for (const line of data) {
  if (line.startsWith('SL')) {
    sl = {
      rules: [],
    }
    sls.push(sl);
  } else {
    let [,p0, p1] = line.match(/\((.+)\):\[(.+)]/);
    p0 = p0.split(',').map((t) => t === 'True');
    p1 = p1.split(',').map((t) => t === 'True' ? true : ( t === 'None' ? null : false));
    sl.rules.push({
      islands: p0,
      stable: p1,
    })
  }
}

sls.forEach((sl, idx) => {
  const { rules } = sl;
  const len = rules[0].islands.length;
  sl.output = new Array(len);
  // for all stable islands, check the conditions
  for (let i = 0; i < len; i++) {
    // console.log('stable cases ', i);
    const stableCases = rules.filter((r) => r.stable[i] === true).map((s) => [...s.islands]);

    // // quick way out: if all combinations are covered -> always stable
    if (stableCases.length === 2**(len-1)) {
      // console.log('all stable');
      sl.output[i] = true;
      continue;
    }
    stableCases.forEach((s) => s[i] = 'x');

    // collapse cases
    // console.log(stableCases);
    // find 2 cases that only differ by true/false
    for (let x = 0; x < stableCases.length; x++) {
      for (let y = x + 1; y < stableCases.length; y++) {
        let differ = -1;
        let numDiffer = 0;
        for (let j = 0; j < len; j++) {
          if (stableCases[x][j] !== stableCases[y][j]) {
            differ = j;
            numDiffer++;
          }
        }
        if (numDiffer === 1) {
          stableCases[x][differ] = 'x';
          // remove case 'y'
          stableCases.splice(y, 1);
          y--;
        }
      }
    }
    // console.log('after reduce');
    // console.log(stableCases);
    const or = [];
    for (const c of stableCases) {
      let and = [];
      for (let j = 0; j < len; j++) {
        if (c[j] === true) {
          and.push(j + 1)
        }
      }
      if (and.length > 1) {
        or.push(`(${and.join(' & ')})`);
      } else if (and.length === 1) {
        or.push(and.join(' & '));
      }
    }
    sl.output[i] = or.join(' | ');
  }
  console.log(`SL #${idx}:`);
  sl.output.forEach((out, i) => {
    console.log(`  ${i + 1}: ${out}`);
  })
});
