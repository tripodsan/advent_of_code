import fs from 'fs';

function init(max = Number.MAX_SAFE_INTEGER) {
  // on x=-20..26,y=-36..17,z=-47..7
  return fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .map((s) => {
      const [state, ...rs] = s.split(/[^0-9-nf]/).filter((c) => !!c);
      const r = rs.map((r) => Number.parseInt(r, 10));
      return {
        s: state === 'n',
        r: [
          [r[0], r[1] + 1],
          [r[2], r[3] + 1],
          [r[4], r[5] + 1],
        ]
      }
    })
    .filter(({r}) => Math.abs(r[0][0]) <= max);
}

function contains(f0, f1) {
  for (let i = 0; i < f0.length; i++) {
    const [ a0, a1] = f0[i];
    const [ b0, b1] = f1[i];
    if (a0 < b0 || a1 > b1) {
      return false;
    }
  }
  return true;
}

function create(frag, i, span) {
  const cpy = [...frag];
  cpy[i] = span;
  return cpy;
}

function fracture(r0, r1) {
  let frags = [r0];
  for (let i = 0; i < r0.length; i++) { // for each dimension
    let newFrags = [];
    const [x0, x1] = r1[i]; // span of fragment to subtract
    for (const frag of frags) {
      let [f0, f1] = frag[i]; // span of fragment to subtract from
      if (x1 <= f0 || x0 >= f1) {
        // does not overlap
        return [r0];
      }
      if (f0 < x0) {
        // create new frag from f0...x0
        newFrags.push(create(frag, i, [f0, x0]))
        f0 = x0;
      }
      if (x1 < f1) {
        // create new frag from x1...f1
        newFrags.push(create(frag, i, [x1, f1]));
        f1 = x1;
      }
      if (f0 < f1) {
        newFrags.push(create(frag, i, [f0, f1]));
      }
    }
    frags = newFrags;
  }
  return frags.filter((frag) => !contains(frag, r1));
}

function volume(r) {
  return r.reduce((v, [x0, x1]) => v * (x1 -x0), 1);
}

function puzzle1(max) {
  const seqs = init(max);
  let ranges = [];
  for (const seq of seqs) {
    // console.log(seq.r, ranges.length);
    let newList = [];
    for (const r of ranges) {
      newList.push(...fracture(r, seq.r));
    }
    if (seq.s) {
      newList.push(seq.r);
    }
    ranges = newList;
  }
  return ranges.reduce((s, r) => s + volume(r), 0);
}

console.log('puzzle 1:', puzzle1(50));
console.log('puzzle 2:', puzzle1());

// console.log(fracture([[-4, 4]], [[-2, 2]]))
// console.log(fracture([[-4, 4]], [[2, 6]]))
// console.log(fracture([[-4, 4]], [[-6, -2]]))
// console.log(fracture([[-4, 4]], [[-6, 6]]))
// console.log(fracture([[-4, 4]], [[-6, -5]]))
// console.log(fracture([[-4, 4]], [[5, 6]]))
//
// console.log(contains([[-2, 2]], [[-2, 2]]))
