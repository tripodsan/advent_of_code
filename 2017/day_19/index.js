const fs = require('fs');
/*
     |
     |  +--+
     A  |  C
 F---|----E|--+
     |  |  |  D
     +B-+  +--+

 */

const DIRS = [
  /* down  */ [0, 1],
  /* right */ [1, 0],
  /* up    */ [0, -1],
  /* left  */ [-1, 0],
]


let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n');

const max = data.reduce((p, line) => Math.max(p, line.length), 0) + 2;

data = data.map((line) => ` ${line}`.padEnd(max, ' ').split(''));
data.push(new Array(max).fill(' '));

function dump() {
  data.forEach((line) => console.log(line.join('')));
}

// dump();

function trace() {
  let x = data[0].indexOf('|');
  let y = 0;
  let dir = 0;
  let seq = [];

  let steps = 0;
  while (true) {
    const c = data[y][x];
    if (c === ' ') {
      break;
    }
    data[y][x] = '*';
    // dump();
    data[y][x] = c;
    if (c === '+') {
      let newDir = -1;
      for (let d = 0; d < 4; d++) {
        const [dx, dy] = DIRS[d];
        if (d !== (dir + 2)%4 && data[y + dy][x + dx] !== ' ') {
          newDir = d;
          break;
        }
      }
      if (newDir < 0) {
        console.log('dead end');
        break;
      }
      dir = newDir;

    } else if (c !== '|' && c !== '-') {
      seq.push(c);
    }
    x += DIRS[dir][0];
    y += DIRS[dir][1];
    steps++;
  }

  return [seq.join(''), steps];
}


console.log('puzzle 1: ', trace()[0]);
console.log('puzzle 2: ', trace()[1]);
