
const fs = require('fs');
// const { kgv } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);
/*
0: 4 1 5
1: 2 3 | 3 2
2: 4 4 | 5 5
3: 4 5 | 5 4
4: "a"
5: "b"

ababbb
bababa
abbbab
aaabbb
aaaabbb
 */

console.log(data);

const rules = [];
const messages = [];

for (const line of data) {
  const [num, rule] = line.split(':').map((s) => s.trim());
  if (rule) {
    const m = {
      sub: [],
    };
    if (rule[0] === '"') {
      m.c = rule[1];
    } else {
      m.sub = rule.split('|').map((s) => s.trim()).map((s) => s.split(/\s+/g).map((s) => Number.parseInt(s)));
    }
    rules[Number.parseInt(num)] = m;
  } else {
    messages.push(num);
  }
}

console.log(JSON.stringify(rules, null ,2));
console.log(messages);

function match(r, a, idx) {
  if (idx >= a.length) {
    return idx;
  }
  if (r.c === a[idx]) {
    return idx + 1;
  }
  for (const group of r.sub) {
    let sidx = idx;
    for (let i = 0; i < group.length; i++) {
      const sr = group[i];
      sidx = match(rules[sr], a, sidx);
      if (sidx < 0) {
        break;
      }
      if (sidx === a.length && i < group.length - 1) {
        sidx = -1;
        break;
      }
    }
    if (sidx >= 0) {
      return sidx;
    }
  }
  return -1;
}

function puzzle1() {
  let s = 0;
  for (const line of messages) {
    const r = match(rules[0], line, 0);
    if (r === line.length) {
      console.log('match', line, r);
      s++;
    } else {
      console.log('nomatch', line, r);
    }
  }
  return s;
}

function puzzle2() {
  rules[8] = {
    sub: [
      [42],
      [42,8],
    ]
  };
  rules[11] = {
    sub: [
      [42,31],
      [42,11,31],
    ]
  }
  // 42 ( 42 (42 (42 31) 31) 31)
  rules.forEach((r, idx) => {
    for (const s of r.sub) {
      if (s.find((v) => v === 8 || v === 11)) {
        console.log(idx, r);
      }
    }
  });

  let s = 0;
  for (const line of messages) {
    console.log('------------');
    console.log(line);
    let r = 0;
    let last = 0;
    let n = 0;
    while (r >= 0  && r < line.length) {
      last = r;
      r = match(rules[42], line, r);
      if (r > 0) {
        n++;
      }
      console.log(line.substring(0, r), r)
    }
    console.log('matches rule 42:', r === line.length, last, n);
    if (last === 0 || n < 2) {
      continue;
    }
    if (r === line.length) {
      console.log('needs to match 31 as well...')
      continue;
    }
    r = last;
    let q = 0;
    while (r >= 0  && r < line.length) {
      last = r;
      r = match(rules[31], line, r);
      if (r > 0) {
        q++;
      }
      console.log(line.substring(0, r), r)
    }
    console.log('matches rule 31:', r === line.length, last, q);
    if (r === line.length && n > q) {
      s++;
    }
  }
  return s;
}



console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
