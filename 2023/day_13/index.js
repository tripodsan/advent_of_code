import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n\n')
  .map((pat)=> {
    const lines = pat.trim().split('\n').map((line) => line.split(''));
    const cols = [];
    for (let x = 0;  x < lines[0].length; x++) {
      let col = 0;
      for (let y = 0; y < lines.length; y++) {
        if (lines[y][x] === '#') {
          col += 2**y;
        }
      }
      cols.push(col);
    }
    const rows = lines.map((row) => row.reduce((acc, c, x) => acc + (c === '#' ? 2**x : 0), 0));
    return {
      rows,
      cols,
    }
  });

function overlaps(s, pos) {
  // 0123456789
  // abcdeffe
  //     effexywz
  let i = 0;
  while (true) {
    const x0 = pos + i;
    const x1 = pos - i - 1;
    if (x0 >= s.length || x1 < 0) {
      return true;
    }
    if (s[x0] !== s[x1]) {
      return false;
    }
    i += 1;
  }
}

function find_mirror(patterns, old = 0) {
  for (let x = 1; x < patterns.length; x++) {
    if (x !== old && overlaps(patterns, x)) {
      return x;
    }
  }
  return 0;
}

function run() {
  let s0 = 0;
  let s1 = 0;
  for (const { rows, cols} of data) {
    const mx = find_mirror(cols);
    const my = find_mirror(rows);
    s0 += mx + my * 100;
    l: for (let sy = 0; sy < rows.length; sy++) {
      for (let sx = 0; sx < cols.length; sx++) {
        cols[sx] ^= 2**sy;
        rows[sy] ^= 2**sx;
        const x = find_mirror(cols, mx);
        const y = find_mirror(rows, my);
        const m = x + y * 100;
        if (m) {
          s1 += m;
          break l;
        }
        cols[sx] ^= 2**sy;
        rows[sy] ^= 2**sx;
      }
    }
  }
  console.log('puzzle 1: ', s0); // 37718
  console.log('puzzle 2: ', s1); // 40995
}

run();
