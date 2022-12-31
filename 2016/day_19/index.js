import '../../utils.js';

function puzzle1() {
  const n = 3012210;
  return (n - 2**Math.floor(Math.log2(n))) * 2 + 1;
}

function simulate(n) {
  if (n === 1 || n === 2) {
    return 1;
  }
  const a = Array.init(n, (i) => i + 1);
  // console.log('--------------------', n);
  // console.log(0, a);
  let idx = 0;
  while (a.length > 1) {
    const o = (idx + Math.floor(a.length/2)) % a.length;
    a.splice(o, 1);
    if (o > idx) {
      idx++;
    }
    idx = idx % a.length;
    // console.log(idx, a);
  }
  return a[0];
}

function solve(n) {
  const p = 3**Math.floor(Math.log(n)/ Math.log(3));
  const l = n - p;
  if (l === 0) {
    return n;
  } else if (l < p) {
    return l;
  } else {
    return 2*l - p;
  }
}

function puzzle2() {
  // for (let n = 1; n < 729; n++) {
  //   const r = simulate(n);
  //   console.log(n, r, solve(n));
  // }
  return solve(3012210);
}

console.log('puzzle 1: ', puzzle1()); // 1830117
console.log('puzzle 2: ', puzzle2()); // 1417887
