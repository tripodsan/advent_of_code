const { Grid } = require('../../utils.js');
const { Heap } = require('heap-js');
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('').map((d) => Number.parseInt(d, 10)));



function djikstra(grid) {
  const W = grid[0].length;
  const H = grid.length;
  const visited = Array.init(W*H, false);
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.add({ d: 0, x:0, y: 0 });

  while (true) {
    const { d, x, y } = q.pop();
    if (x === W - 1 && y === H - 1) {
      return d;
    }
    if (!visited[x + y * W]) {
      visited[x + y * W] = true;
      if (y < H - 1) { q.add({d: d + grid[y+1][x], x: x  , y: y+1 }); }
      if (y > 0)     { q.add({d: d + grid[y-1][x], x: x  , y: y-1 }); }
      if (x < W - 1) { q.add({d: d + grid[y][x+1], x: x+1, y: y   }); }
      if (x > 0)     { q.add({d: d + grid[y][x-1], x: x-1, y: y   }); }
    }
  }
}

function puzzle1() {
  return djikstra(data);
}

function puzzle2() {
  const w = data[0].length;
  const h = data.length;
  let rows = Array.init(5 * h, () => ([]));
  for (let x = 0; x < 5; x++) {
    let i = x;
    for (let y = 0; y < 5; y++) {
      for (let yy = 0; yy < h; yy++) {
        for (let xx = 0; xx < w; xx++) {
          rows[y * h + yy].push(((data[yy][xx] - 1 + i) % 9) + 1);
        }
      }
      i++;
    }
  }
  return djikstra(rows);
}

console.log('puzzle 1:', puzzle1()); // 589
console.log('puzzle 2:', puzzle2()); // 2885
