import fs from 'fs';

const alpha = 'abcdefghijklmnopqrstuvwxyz';

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
    // lines.forEach((row) => console.log(row.join('')));
    // console.log('')
    const rows = lines.map((row) => row.reduce((acc, c, x) => acc + (c === '#' ? 2**x : 0), 0));
    return {
      rows,
      cols,
    }
  });

function overlaps(s, pos) {
  // 012345
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

function find_mirror(lines, old = 0) {
  for (let x = 1; x < lines.length; x++) {
    if (x !== old && overlaps(lines, x)) {
      return x;
    }
  }
  return 0;
}

function puzzle1() {
  let sum = 0;
  for (const { rows, cols} of data) {
    const x = find_mirror(cols);
    const y = find_mirror(rows);
    sum += x + y * 100;
  }
  return sum;
}
function puzzle2() {
  let sum = 0;
  l: for (const { rows, cols} of data) {
    const mx = find_mirror(cols);
    const my = find_mirror(rows);
    for (let sy = 0; sy < rows.length; sy++) {
      for (let sx = 0; sx < cols.length; sx++) {
        cols[sx] ^= 2**sy;
        rows[sy] ^= 2**sx;
        const x = find_mirror(cols, mx);
        const y = find_mirror(rows, my);
        cols[sx] ^= 2**sy;
        rows[sy] ^= 2**sx;
        const m = x + y * 100;
        if (m) {
          sum += m;
          continue l;
        }
      }
    }
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1()); // 37718
console.log('puzzle 2: ', puzzle2());
