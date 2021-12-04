const fs = require('fs');
// fist score:  10680
// last score:  31892

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);

const numbers = data.shift().split(',').map((s) => parseInt(s, 10));

const boards = [];
const n2b = [];
while (data.length) {
  const board = {
    nums: [],
    marked: new Array(25).fill(false),
    rows: new Array(5).fill(0),
    cols: new Array(5).fill(0),
    remain: [],
  };
  const lines = data.splice(0, 5);
  lines.forEach((line, y) => {
    line
      .split(/\s+/)
      .map((s) => parseInt(s, 10))
      .forEach((n, x) => {
        board.nums.push(n);
        board.remain.push(n);
        if (!n2b[n]) {
          n2b[n] = [];
        }
        n2b[n].push({ board, x, y });
      })
  })
  boards.push(board);
}

// console.log(numbers);
// console.log(boards);

function play(n) {
  // console.log('playing', n);
  let score = -1;
  for (const { board, x, y } of n2b[n]) {
    if (board.score) {
      continue;
    }
    board.marked[x + y * 5] = true;
    board.rows[y]++;
    board.cols[x]++;
    board.remain.splice(board.remain.indexOf(n), 1);
    if (board.rows[y] === 5 || board.cols[x] === 5) {
      score = board.score = board.remain.reduce((s, p) => s + p, 0) * n;
      // console.log('score', board.score);
    }
  }
  return score;
}

function run() {
  let lastScore = 0;
  for (const n of numbers) {
    const score = play(n);
    if (score >= 0) {
      if (lastScore === 0) {
        console.log('fist score: ', score);
      }
      lastScore = score;
    }
  }
  console.log('last score: ', lastScore);
}

run();
