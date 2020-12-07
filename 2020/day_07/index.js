
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[\s,.]+/g));

/*
light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags.
 */

const rules = { };

// parse data and update rules
data.forEach((r) => {
  const bag = `${r[0]} ${r[1]}`;
  const sr = {};
  rules[bag] = sr;
  if (r[4] !== 'no') {
    for (let i = 4; i < r.length - 1; i += 4) {
      const num = Number(r[i]);
      const sb = `${r[i + 1]} ${r[i + 2]}`
      sr[sb] = num;
    }
  }
})

// console.log(rules);

function trail(bag, valid = {}) {
  for (let [name, rule] of Object.entries(rules)) {
    if (rule[bag]) {
      valid[name] = true;
      trail(name, valid);
    }
  }
  return valid;
}

function numbags(bag) {
  let sum = 1;
  for (let [name, rule] of Object.entries(rules[bag])) {
    if (rule) {
      sum += rule * numbags(name);
    }
  }
  return sum;
}

function puzzle2() {
  return numbags('shiny gold') - 1;
}

function puzzle1() {
  return Object.values(trail('shiny gold')).length;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
