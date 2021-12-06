const fs = require('fs');

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(''));

function garbage(s) {
  let c = s.shift();
  let removed = 0;
  while (c) {
    if (c === '>') {
      return removed;
    }
    if (c === '!') {
      c = s.shift();
    } else {
      removed++;
    }
    c = s.shift();
  }
  return removed;
}

function group(s, level = 0) {
  let c = s.shift();
  let score = level;
  let removed = 0;
  while (c) {
    if (c === '{') {
      const [scr, rem] = group(s, level + 1);
      score += scr;
      removed += rem;
    }
    else if (c === '<') {
      removed += garbage(s);
    }
    else if (c === '}') {
      break;
    }
    else if (c === '!') {
      c = s.shift();
    }
    c = s.shift();
  }
  return [score, removed];
}

data.forEach((line) => {
  const ret = group(line);
  console.log('puzzle [1, 2]: ', ret);
})
