const fs = require('fs');


function hash(str) {
  const lens = str.split('').map((c) => c.charCodeAt(0));
  lens.push(17, 31, 73, 47, 23);

  let a = new Array(256);
  for (let i = 0; i < 256; i++) {
    a[i] = i;
  }
  let pos = 0;
  let skip = 0;

  for (let round = 0; round < 64; round++) {
    lens.forEach((l) => {
      let t = [...a];
      for (let i = 0; i < l; i++) {
        t[(pos + i) % 256] = a[(pos + l - i - 1) % 256];
      }
      a = t;
      pos += (l + skip) % 256;
      skip++;
    });
  }



  let ret = [];
  let x = 0;
  while (a.length) {
    x ^= a.shift();
    if (a.length % 16 === 0) {
      for (let i = 0; i < 8; i++) {
        ret.push(x & 128 ? '#' : '.');
        x <<= 1;
      }
    }
  }
  return ret;
}

function puzzle1(str) {
  let blocks = 0;
  for (let i = 0; i < 128; i++) {
    const h = hash(`${str}-${i}`);
    // console.log(h.join(''));
    h.forEach((b) => blocks += b === '#' ? 1 : 0);
  }
  return blocks;
}

function fill(grid, x, y, r) {
  if (grid[y][x] !== '#') {
    return false;
  }
  grid[y][x] = r;
  fill(grid, x - 1, y, r);
  fill(grid, x + 1, y, r);
  fill(grid, x, y - 1, r);
  fill(grid, x, y + 1, r);
  return true;
}

function puzzle2(str) {
  const grid = [
    new Array(130).fill('.'),
  ];
  for (let i = 0; i < 128; i++) {
    const h = hash(`${str}-${i}`);
    h.push('.');
    h.unshift(('.'));
    grid.push(h);
  }
  grid.push(new Array(130).fill('.'));

  let region = 0;
  for (let y = 1; y < 129; y++) {
    for (let x = 1; x < 129; x++) {
      if (fill(grid, x, y, region)) {
        region++;
      }
    }
  }
  return region;
}

// console.log('puzzle 1: ', puzzle1('flqrgnkx'));
// console.log('puzzle 2: ', puzzle2('flqrgnkx'));
console.log('puzzle 1: ', puzzle1('hxtvlmkl'));
console.log('puzzle 2: ', puzzle2('hxtvlmkl'));
