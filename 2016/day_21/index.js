import fs from 'fs';
const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim()
  .split('\n');


// swap position X with position Y
function swap(p, x, y) {
  const e = p[x];
  p[x] = p[y];
  p[y] = e;
}

// swap letter X with letter Y
function swapL(p, x, y) {
  const idx0 = p.indexOf(x);
  const idx1 = p.indexOf(y);
  p[idx0] = y;
  p[idx1] = x;
}

// rotate left/right X
function rotateLeft(p, x, r) {
  if (r) {
    return rotateRight(p, x, false);
  }
  // lazy...
  while (x--) {
    p.push(p.shift());
  }
}


// rotate left/right X
function rotateRight(p, x, r) {
  if (r) {
    return rotateLeft(p, x, false);
  }
  // lazy...
  while (x--) {
    p.unshift(p.pop());
  }
}

// rotate based on position of letter X
function rotateL(p, x, r) {
  if (r) {
    /*
    0 Abcdefgh -> hAbcdefg
    1 aBcdefgh -> ghaBcdef
    2 abCdefgh -> fghabCde
    3 abcDefgh -> efghabcD
    4 abcdEfgh -> cdEfghab  2 -> -6   /2+5
    5 abcdeFgh -> bcdeFgha  4 -> -7
    6 abcdefGh -> abcdefGh  6 -> -8
    7 abcdefgH -> Habcdefg  0 -> +1
     */
    const idx = p.indexOf(x);
    if (idx % 2 === 1) {
      rotateLeft(p, Math.ceil(idx / 2));
    } else if (idx === 0) {
      rotateLeft(p, 1);
    } else {
      rotateLeft(p, idx / 2 + 5);
    }

  } else {
    // rotate the string to the right one time,
    // plus a number of times equal to that index,
    // plus one additional time if the index was at least 4.
    const idx = p.indexOf(x);
    rotateRight(p, idx + 1 + (idx >= 4 ? 1 : 0));
  }
}

// reverse positions X through Y
function reverse(p, x, y) {
  while (x < y) {
    const e = p[x];
    p[x] = p[y];
    p[y] = e;
    x++;
    y--;
  }
}

// move position X to position Y
function move(p, x, y, r) {
  if (r) {
    const [e] = p.splice(y, 1);
    p.splice(x, 0, e)
  } else {
    const [e] = p.splice(x, 1);
    p.splice(y, 0, e)
  }
}

const commands = [{
    re: /swap position (\d+) with position (\d+)/,
    args: [1, 2],
    fn: swap,
  }, {
    re: /swap letter (\w+) with letter (\w+)/,
    args: [1, 2],
    fn: swapL,
  }, {
    re: /rotate left (\d+)/,
    args: [1],
    fn: rotateLeft,
  }, {
    re: /rotate right (\d+)/,
    args: [1],
    fn: rotateRight,
  }, {
    re: /rotate based on position of letter (\w+)/,
    args: [1],
    fn: rotateL,
  }, {
    re: /reverse positions (\d+) through (\d+)/,
    args: [1, 2],
    fn: reverse,
  }, {
    re: /move position (\d+) to position (\d+)/,
    args: [1, 2],
    fn: move,
  }]

function parse() {
  const prog = [];
  for (const line of data) {
    const len = prog.length;
    for (const cmd of commands) {
      const m = line.match(cmd.re);
      if (m) {
        const args = cmd.args.map(((i) => {
          const a = parseInt(m[i], 10);
          return Number.isNaN(a) ? m[i] : a;
        }));
        prog.push({
          fn: cmd.fn,
          args,
        });
        break;
      }
    }
    if (prog.length !== len + 1) {
      throw Error();
    }
  }
  return prog;
}


function puzzle1(pwd) {
  const prog = parse();
  // console.log(prog);
  const p = pwd.split('');
  for (const cmd of prog) {
    cmd.fn(p, ...cmd.args);
  }
  return p.join('');
}

function puzzle2(pwd) {
  const prog = parse();
  prog.reverse();
  const p = pwd.split('');
  for (const cmd of prog) {
    cmd.fn(p, ...cmd.args, true);
  }
  return p.join('');
}

console.log('puzzle 1: ', puzzle1('abcdefgh')); // aefgbcdh
// console.log('puzzle 2: ', puzzle2('aefgbcdh'));
console.log('puzzle 2: ', puzzle2('fbgdceah'));
