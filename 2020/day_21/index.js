
const fs = require('fs');
const { kgv } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[ ,()]+/).filter((s) => !!s));

/*
mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)

 */

const ing = {}
let algs = {};
const rules = [];

for (const rule of data) {
  const idx = rule.indexOf('contains');
  const alg = rule.slice(idx + 1);
  const ng = rule.slice(0, idx);
  const r = {
    ing: new Set(),
    alg: new Set(),
  };
  rules.push(r);
  ng.forEach((rn) => {
    r.ing.add(rn);
    let g = ing[rn];
    if (!g) {
      g = {
        alg: new Set(),
      }
      ing[rn] = g;
    }
  });
  alg.forEach((a) => {
    let aa = algs[a];
    if (!aa) {
      aa = {
        rules: [],
      }
      algs[a] = aa;
    }
    aa.rules.push(r);
    r.alg.add(a);
  });
}

console.log('ingedients');
console.log(ing);
console.log('\nrules');
console.log(rules);
console.log('\nalgs');
console.log(algs);

function puzzle1() {
  const oldRules = rules.map((rule) => ({
    ing: new Set(rule.ing),
    alg: new Set(rule.alg),
  }));

  // find a rule with only 1 allergen
  const list = [];
  while (rules.length) {
    // sort rules my number of allergenes
    rules.sort((r0, r1) => r0.alg.size - r1.alg.size);

    const cands = {};
    for (const rule of rules) {
      if (rule.alg.size > 1) {
        console.log(cands);
        throw Error('not solvable');
      }
      const algName = rule.alg.first();
      if (cands[algName]) {
        continue;
      }
      // find ingredient that appears in every list of this rule's allergene
      console.log('searching', algName);
      let same;
      // hack for wompking
      // if (algName === 'nuts') {
      //   same = { 'mbdksj': true };
      // }
      // else
        {
        for (const algRule of algs[algName].rules) {
          if (!same) {
            same = algRule.ing;
          } else {
            same = same.intersect(algRule.ing);
          }
        }
      }
      // if only 1 ingredient, mark and remove
      console.log(same);
      cands[algName] = same;
      if (same.size === 1) {
        const ing = same.first();
        console.log('found', algName, ing);
        list.push({
          ing,
          alg: algName,
        });
        // remove ingredient and alg
        for (let i = 0; i < rules.length; i++) {
          const r = rules[i];
          delete r.ing.delete(ing);
          delete r.alg.delete(algName);
          if (r.alg.size === 0) {
            // delete rule
            rules.splice(i, 1);
            i--;
          }
        }
        // console.log('updated rules', rules);
        break;
      }
    }
  }
  // find ingredients with no allegenes
  let all = new Set(Object.keys(ing));
  list.forEach(({ ing }) => {
    all.delete(ing);
  });
  // console.log(all);
  // count the occurrences
  let occ = 0;
  oldRules.forEach((rule) => {
    rule.ing.forEach((r) => {
      if (all.has(r)) {
        occ++;
      }
    });
  });
  console.log('puzzle 1: ', occ); // 2826
  list.sort((l0, l1) => l0.alg.localeCompare(l1.alg));
  console.log('puzzle 2: ', list.map((l) => l.ing).join(','));

  return occ;
}

puzzle1();
