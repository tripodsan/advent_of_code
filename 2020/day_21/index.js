
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
    ing: {},
    alg: {},
  };
  rules.push(r);
  ng.forEach((rn) => {
    r.ing[rn] = true;
    let g = ing[rn];
    if (!g) {
      g = {
        alg: {},
      }
      ing[rn] = g;
    }
    alg.forEach((a) => {
      g.alg[a] = (g.alg[a] || 0) + 1;
    });
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
    r.alg[a] = true;
  });
}

console.log('ingedients');
console.log(ing);
console.log('\nrules');
console.log(rules);
console.log('\nalgs');
console.log(JSON.stringify(algs, null, 2));

function intersect(a, b) {
  const ret = {};
  Object.keys(a).forEach((k) => {
    if (b[k]) {
      ret[k] = a[k];
    }
  });
  return ret;
}

function diff(a, b) {
  const ret = {};
  Object.keys(a).forEach((k) => {
    if (!b[k]) {
      ret[k] = a[k];
    }
  });
  Object.keys(b).forEach((k) => {
    if (!a[k]) {
      ret[k] = b[k];
    }
  });
  return ret;
}

function puzzle1() {
  const oldRules = rules.map((rule) => ({
    ing: { ...rule.ing},
    alg: { ...rule.alg},
  }));

  // find a rule with only 1 allergen
  const list = [];
  while (rules.length) {
    // sort rules my number of allergenes
    rules.sort((r0, r1) => Object.keys(r0.alg).length - Object.keys(r1.alg).length);

    const cands = {};
    for (const rule of rules) {
      const numAlgs = Object.keys(rule.alg).length;
      if (numAlgs > 1) {
        console.log(cands);
        throw Error('not solvable');
      }
      const algName = Object.keys(rule.alg)[0];
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
            same = intersect(same, algRule.ing);
          }
        }
      }
      // if only 1 ingredient, mark and remove
      console.log(same);
      cands[algName] = same;
      if (Object.keys(same).length === 1) {
        const ing = Object.keys(same)[0];
        console.log('found', algName, ing);
        list.push({
          ing,
          alg: algName,
        });
        // remove ingredient and alg
        for (let i = 0; i < rules.length; i++) {
          const r = rules[i];
          delete r.ing[ing];
          delete r.alg[algName];
          if (Object.keys(r.alg).length === 0) {
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
    Object.keys(rule.ing).forEach((r) => {
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
