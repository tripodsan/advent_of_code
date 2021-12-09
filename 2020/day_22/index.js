
const fs = require('fs');
const { kgv } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => Number.parseInt(s))
  .filter((s) => !Number.isNaN((s)))

const deck0 = data.slice(0, data.length / 2);
const deck1 = data.slice(data.length / 2);

console.log(deck0);
console.log(deck1);

function run(d0, d1) {
  while (d0.length && d1.length) {
    const c0 = d0.shift();
    const c1 = d1.shift();
    if (c0 > c1) {
      d0.push(c0);
      d0.push(c1);
    } else {
      d1.push(c1);
      d1.push(c0);
    }
  }
  const winner = d0.length ? d0 : d1;
  return winner.reverse().reduce((p, v, idx) => p + (v * (idx + 1)), 0);
}

function game(d0, d1, d = 1) {
  // console.log(`=== Game ${d} ===`);
  const played = new Set();
  let round = 1;
  while (d0.length && d1.length) {
    // console.log(`-- Round ${round} (Game ${d}) --`);
    // console.log(`Player 1's deck: ${d0.join()}`);
    // console.log(`Player 2's deck: ${d1.join()}`);
    const hash = d0.join(':') + '-' + d1.join(':');
    if (played.has(hash)) {
      return 1;
    }
    played.add(hash);
    const c0 = d0.shift();
    const c1 = d1.shift();
    // console.log(`Player 1 plays: ${c0}`);
    // console.log(`Player 2 plays: ${c1}`);
    let winner;
    if (c0 <= d0.length && c1 <= d1.length) {
      winner = game(d0.slice(0, c0), d1.slice(0, c1), d + 1);
    } else {
      winner = c0 - c1;
    }
    if (winner > 0) {
      // console.log(`Player 1 wins round ${round} of game ${d}!`);
      d0.push(c0);
      d0.push(c1);
    } else {
      // console.log(`Player 2 wins round ${round} of game ${d}!`);
      d1.push(c1);
      d1.push(c0);
    }
    round++;
  }
  const winner = d0.length ? 1 : -1;
  if (d > 1) {
    return winner;
  }
  const wdeck = winner > 0 ? d0 : d1;
  return winner * wdeck.reverse().reduce((p, v, idx) => p + (v * (idx + 1)), 0);
}

function puzzle2() {

  return game([...deck0], [...deck1]);
}

function puzzle1() {
  return run([...deck0], [...deck1]);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
