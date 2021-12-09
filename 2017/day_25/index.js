const fs = require('fs');

/*

Begin in state A.
Perform a diagnostic checksum after 6 steps.

In state A:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state B.
  If the current value is 1:
    - Write the value 0.
    - Move one slot to the left.
    - Continue with state B.

In state B:
  If the current value is 0:
    - Write the value 1.
    - Move one slot to the left.
    - Continue with state A.
  If the current value is 1:
    - Write the value 1.
    - Move one slot to the right.
    - Continue with state A.

 */



const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);



const states_test = {
 A: [
   { v: 1, s: +1, n: 'B' },
   { v: 0, s: -1, n: 'B' }
 ],
 B: [
   { v: 1, s: -1, n: 'A' },
   { v: 1, s: +1, n: 'A' }
 ],
}

const states = {}
let state = null;
let cond = 0;
let initial;
for (const line of data) {
  const words = line
    .split(/[\s.:]+/)
    .filter((w) => {
      if (w === '1' || w === '0') {
        return true;
      }
      if (w === '1:' || w === '0:') {
        return true;
      }
      if (w === 'left' || w === 'right') {
        return true;
      }
      if (w.length && w.length <= 2 && 'ABCDEFGHIJKL'.indexOf(w.charAt(0)) >= 0) {
        return true;
      }
    });
  if (!words.length) {
    continue;
  }
  if (!initial) {
    initial = words[0];
    continue;
  }
  if (words[0] === 'In') {
    state = [{}, {}]
    states[words[1]] = state;
  } else if (words[0] === 'If') {
    cond = parseInt(words[1]);
  } else if (words[0] === 'right') {
    state[cond].s = 1;
  } else if (words[0] === 'left') {
    state[cond].s = -1;
  } else if ('ABCDEFGHIJKL'.indexOf(words[0])>= 0) {
    state[cond].n = words[0];
  } else {
    state[cond].v = parseInt(words[0])
  }
  console.log(words)
}

console.log(states);

function puzzle1(steps, state) {
  let tape = [0];
  let offs = 0;
  let pos = 0;

  while (steps--) {
    const cnf = states[state][tape[pos + offs]];
    tape[pos + offs] = cnf.v;
    pos += cnf.s;
    state = cnf.n;
    if (pos + offs < 0) {
      tape.unshift(0);
      offs += 1;
    }
    if (pos + offs >= tape.length) {
      tape.push(0);
    }
  }
  return tape.reduce((s, p) => s + p, 0);
}

console.log('puzzle 1:', puzzle1(12683008, initial));
