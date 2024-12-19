import assert from 'assert';
import fs from 'fs';

function parse() {
  let [towels, designs] = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n');
  towels = towels.split(',')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .map((c) => c.split(''));
  designs = designs.split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .map((c) => c.split(''));

  const root = {
  };
  for (const t of towels) {
    let n = root;
    for (const c of t) {
      let next = n[c] ?? {};
      n[c] = next;
      n = next;
    }
    n.end = true;
  }
  return {
    root,
    towels,
    designs,
  }
}

function solve(d, dict, idx, node) {
  if (idx === d.length) {
    // if we reached the end of the design return if the towel also ends
    return node.end || node === dict;
  }
  const color = d[idx++];
  const next = node[color];
  if (next) {
    const ret = solve(d, dict, idx, next);
    if (ret) {
      return true;
    }
  }

  // no pattern found for the next, and this towel ended, also try starting from the beginning
  if (node.end && dict[color]) {
    return solve(d, dict, idx, dict[color]);
  }
  return false;
}

function puzzle1() {
  const { root, towels, designs } = parse();
  console.log(towels.length, designs.length);
  // console.log(JSON.stringify(root, null, 2 ));
  // sort out the designs that where the patterns never occur
  let n = 0;
  for (const d of designs) {
    const combs = solve(d, root, 0, root);
    console.log(d.join(''), combs);
    n += combs ? 1 : 0;
  }
  return n;
}


function puzzle2() {
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
