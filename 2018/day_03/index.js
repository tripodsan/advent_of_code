const { Grid } = require('../../utils.js');

const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9]+/)
    .filter((d) => !!d)
    .map((d) => parseInt(d)))
  ;


// console.log(data);

function run() {
  const grid = new Grid();
  const claims = [];
  data.forEach(([id, x, y, w, h]) => {
    const claim = {
      id,
      size: w*h,
      cover: 0,
    }
    claims.push(claim);
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        grid.getOrSet([x + i, y + j],
          () => ({ c: [claim] }),
          (d) => {
            d.c.forEach((cl) => {
              cl.cover++;
              claim.cover++;
            });
            d.c.push(claim);
            return d;
          },
        )
        claim.cover++;
      }
    }
  });

  console.log(claims);
  let sum = 0;
  for (const { c } of grid.values()) {
    if (c.length > 1) {
      sum++;
    }
  }

  const best = claims.find((c) => c.cover === c.size).id;

  console.log('puzzle 1: ', sum);
  console.log('puzzle 2: ', best);
}

run();
