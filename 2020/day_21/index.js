
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
console.log(algs);

function intersect(a, b) {
  const ret = {};
  Object.keys(a).forEach((k) => {
    if (b[a]) {
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

function run() {
  return 42;
}

function puzzle2() {
  return run();
}

function puzzle1() {
  Object.entries(algs).forEach(([name, alg]) => {
    console.log(name);
    // form all the ingredients, remove the ones that are in distinct rules, so they can't have that allergenes
    // let all = new Set(Object.keys(ing));
    // for (const rule of alg.rules) {
    //   Object.keys(rule.ing).forEach((r) => all.delete(r));
    // }
    // console.log(all);
    // detect the ones that might be in one rule but not in the others
    let all = { };
    if (alg.rules.length > 1) {
      for (const rule of alg.rules) {
        all = diff(all, rule.ing);
      }
    }
    alg.all = all;
    console.log(all);
  });

  const oldRules = rules.map((rule) => ({
    ing: { ...rule.ing},
    alg: { ...rule.alg},
  }));
  Object.entries(algs).forEach(([name, alg]) => {
    // find if we can reduce
    for (const rule of alg.rules) {
      Object.keys(alg.all).forEach((k) => {
        delete rule.ing[k];
      });
    }
  });
  console.log('\nnew rules');
  console.log(rules);
  // find the ones that can't have allgs
  let all = new Set(Object.keys(ing));
  rules.forEach((rule) => {
    Object.keys(rule.ing).forEach((r) => all.delete(r));
  });
  // remove the ones from the sole algs
  Object.entries(algs).forEach(([name, alg]) => {
    if (alg.rules.length === 1) {
      Object.keys(alg.rules[0].ing).forEach((r) => all.delete(r));
    }
  });
  console.log(all);
  // count the occurences
  let occ = 0;
  oldRules.forEach((rule) => {
    Object.keys(rule.ing).forEach((r) => {
      if (all.has(r)) {
        occ++;
      }
    });
  });
  return occ;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
