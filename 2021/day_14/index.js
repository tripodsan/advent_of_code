const { Grid } = require('../../utils.js');
const fs = require('fs');

function init() {
  const data = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s);

  const template = data.shift().split('');
  const chain = new Map();
  const count = new Map();
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2).join('');
    chain.set(pair, (chain.get(pair) ?? 0) + 1);
  }
  template.forEach((p) => {
    count.set(p, (count.get(p) ?? 0) + 1);
  });

  const rules = new Map();
  // CH -> B
  data.forEach((line) => {
    const segs = line.split('');
    const elem = segs.pop();
    const pair = [segs[0], segs[1]].join('');
    const polys = [
      [segs[0], elem].join(''),
      [elem, segs[1]].join(''),
      elem,
    ];
    rules.set(pair, polys);
  })
  // console.log(count, rules, chain);
  return {
    count,
    rules,
    chain,
  }
}

function puzzle1(iter) {
  let {
    count,
    rules,
    chain,
  } = init();

  for (let i = 0; i < iter; i++) {
    const newChain = new Map();
    for (const [key, num] of chain) {
      if (rules.has(key)) {
        const [p0, p1, elem] = rules.get(key);
        newChain.set(p0, (newChain.get(p0) ?? 0) + num);
        newChain.set(p1, (newChain.get(p1) ?? 0) + num);
        count.set(elem, (count.get(elem) ?? 0) + num);
      } else {
        newChain.set(key, num);
      }
    }
    chain = newChain;
    // console.log('-----------------');
    // console.log(chain);
    // console.log(count);
  }
  // console.log(chain);
  // console.log(count);
  count = Array.from(count.values());
  // console.log(count, );
  console.log(count.sum());
  return count.max().max - count.min().min;
}



console.log('puzzle 1:', puzzle1(10)); // 3576
console.log('puzzle 2:', puzzle1(40)); // 84271
