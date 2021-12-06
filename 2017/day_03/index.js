/*
17  16  15  14  13
18   5   4   3  12
19   6   1   2  11
20   7   8   9  10
21  22  23---> ...
 */
const dir = [
  [1, 0],
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
]

function puzzle2(pos) {
  const W = 12;
  const O = W / 2;
  const grid = new Array(W * W).fill(0);
  grid[O + O * W] = 1;
  let x = 0;
  let y = 0;
  let d = 0;
  let s = 0.5;
  let p = 1;
  while (p < pos) {
    for (let w = 0; w < s && p < pos; w++, p++) {
      x += dir[d][0];
      y += dir[d][1];
      const n = dir.reduce((sum, [dx, dy]) => {
        return sum + grid[x + dx + O + (y + dy + O) * W];
      }, 0)
      grid[x + O + (y + O) * W] = n;
      if (n > pos) {
        return n;
      }
    }
    d = (d + 1) % 4;
    s += 0.5;
  }
  return Math.abs(x) + Math.abs(y);
}

function puzzle1(pos) {
  let x = 0;
  let y = 0;
  let d = 0;
  let s = 0.5;
  let p = 1;
  while (p < pos) {
    for (let w = 0; w < s && p < pos; w++, p++) {
      x += dir[d][0];
      y += dir[d][1];
    }
    d = (d + 1) % 4;
    s += 0.5;
  }
  return Math.abs(x) + Math.abs(y);
}

console.log('puzzle 1: ', puzzle1(325489));
console.log('puzzle 2: ', puzzle2(325489));
