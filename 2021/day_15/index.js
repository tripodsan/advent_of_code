const { Grid } = require('../../utils.js');
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('').map((d) => Number.parseInt(d, 10)));


function reconstruct_path(grid, cameFrom, current) {
  let dist = 0;
  const path = [];
  do {
    path.unshift(grid[current])
    dist += grid[current];
    current = cameFrom.get(current);
  } while (current);

  // console.log(path.join(','));
  return dist;
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(grid, dirs, start, goal, h) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  // openSet := {start}
  const openSet = new Set();
  openSet.add(start);

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  // cameFrom := an empty map
  const cameFrom = new Map();

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map(); //:= map with default value of Infinity
  gScore.set(start, 0);

  // For node n, fScore[n] := gScore[n] + h(n).
  const fScore = new Map(); //:= map with default value of Infinity
  fScore.set(start, h(start));

  while (openSet.size) { // openSet is not empty
    // current := the node in openSet having the lowest fScore[] value
    let current = undefined;
    let low = Number.MAX_SAFE_INTEGER;
    for (const k of openSet.values()) {
      const score = fScore.get(k) ?? Number.MAX_SAFE_INTEGER;
      if (score < low) {
        low = score;
        current = k;
      }
    }
    if (!current) {
      return [];
    }

    if (current === goal) {
      return reconstruct_path(grid, cameFrom, current);
    }

    delete openSet.delete(current); /// openSet.Remove(current)

    /// for each neighbor of current
    // console.log('current', current);
    dirs.forEach((dir) => {
      const neighbor = current + dir;
      const c = grid[neighbor];
      if (c < 0) {
        return;
      }
      const dist = c;
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      // tentative_gScore := gScore[current] + d(current, neighbor)
      let tentative_gScore = Number.MAX_SAFE_INTEGER;
      const score = gScore.get(current);
      if (score !== undefined) {
        tentative_gScore = score + dist;
      }
      const scoreNeighbor = gScore.get(neighbor) ?? Number.MAX_SAFE_INTEGER;
      if (tentative_gScore < scoreNeighbor) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom.set(neighbor, current);
        gScore.set(neighbor, tentative_gScore);
        fScore.set(neighbor, tentative_gScore + h(neighbor));
        openSet.add(neighbor);
      }
    });
  }
  // Open set is empty but goal was never reached
  return [];
}

// console.log(grid);

function init(dat) {
  const W = dat[0].length + 2;
  const H = dat.length + 2;
  const grid = [];
  grid.push(Array.init(W, -1));
  dat.forEach((row) => {
    grid.push([-1, ...row, -1]);
  })
  grid.push(Array.init(W, -1));
  return {
    grid: grid.flat(),
    W,
    H,
  };
}

function solve(dat) {
  const { grid, W, H } = init(dat);
  const dirs = [-W, 1, W, -1];
  const goalX = W - 2;
  const goalY = H - 2;
  const startIdx = 1 + W;
  const goalIdx = goalX + goalY * W;
  grid[startIdx] = 0;
  return A_Star(grid, dirs, startIdx, goalIdx, (idx) => {
    return 1;
    // const dx = goalX - idx%W;
    // const dy = goalY - Math.floor(idx/W);
    // return (Math.abs(dx) + Math.abs(dy)) * 100;
  });
}


function puzzle1() {
  return solve(data);
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
  return solve(rows);
}

console.log('puzzle 1:', puzzle1()); // 589
console.log('puzzle 2:', puzzle2()); // 2885
