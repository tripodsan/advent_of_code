
const fs = require('fs');
// const { kgv } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s);

/*
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12
 */
// console.log(data);

let rules = [];
let tickets;

data.forEach((line) => {
  if (tickets) {
    if (line !== 'nearby tickets:') {
      tickets.push(line.split(',').map((s) => Number.parseInt(s)));
    }
  } else {
    if (line === 'your ticket:') {
      tickets = [];
    } else {
      const [name, rs] = line.split(':').map((s) => s.trim());
      const [l0, l1, , l2, l3] = rs.split(/[ -]+/g);
      rules.push({
        name,
        l0: Number.parseInt(l0),
        l1: Number.parseInt(l1),
        l2: Number.parseInt(l2),
        l3: Number.parseInt(l3),
      })
    }
  }
})
console.log(rules);
// console.log(tickets);

function getValidRule(n) {
  for (let r of rules) {
    if ((n >= r.l0 && n <= r.l1) || (n>= r.l2 && n <= r.l3)) {
      return r;
    }
  }
  return null;
}

function getInValidRules(n) {
  const rs = [];
  for (let r of rules) {
    if ((n >= r.l0 && n <= r.l1) || (n>= r.l2 && n <= r.l3)) {
    } else {
      rs.push(r.name);
    }
  }
  return rs;
}

function puzzle2() {
  // fill the position information will all rules that are invalid
  const NP = tickets[0].length;
  const invalid = Array.from({length: NP}, () => ({}));
  for (let ticket of tickets) {
    for (let i = 0; i < ticket.length; i++) {
      const n = ticket[i];
      getInValidRules(n).forEach((r) => {
        invalid[i][r] = true;
      })
    }
  }

  // create a solution object with all the rule names that are not invalid
  const all = [];
  for (let i = 0; i < NP; i++) {
    const names = {};
    rules.forEach((r) => {
      const { name } = r;
      if (!invalid[i][name]) {
        names[name] = true;
      }
    });
    all.push(names);
  }
  console.log(all);

  const known = {};
  while (Object.keys(known).length < NP) {
    // if a position only has 1 rule left, it must be correct
    for (let i = 0; i < NP; i++) {
      if (Object.keys(all[i]).length === 1) {
        known[Object.keys(all[i])[0]] = i;
      }
    }
    // remove known
    for (let i = 0; i < NP; i++) {
      Object.keys(known).forEach((k) => {
        delete all[i][k];
      })
    }
    console.log(all);
    console.log(known);
  }

  let s = 1;
  Object.entries(known).forEach(([n, p]) => {
    if (n.startsWith('departure')) {
      s *= tickets[0][p];
    }
  });

  return s;
}

function puzzle1() {
  let s = 0;
  let ts = [tickets[0]];
  for (let i = 1; i < tickets.length; i++) {
    let valid = true;
    for (let n of tickets[i]) {
      if (!getValidRule(n)) {
        valid = false;
        s += n;
      }
    }
    if (valid) {
      ts.push(tickets[i]);
    }
  }
  tickets = ts;
  return s;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
