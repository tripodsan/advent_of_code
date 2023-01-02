import '../../utils.js';

const data = '1113122113'
  .split('')
  .map((d) => parseInt(d, 10));

function expand(seq) {
  const ret = [];
  let prev = seq[0];
  let num = 1;
  for (let i = 1; i <= seq.length; i++) {
    const c = seq[i];
    if (c === prev) {
      num++;
    } else {
      ret.push(num);
      ret.push(prev);
      num = 1;
    }
    prev = c;
  }
  return ret;
}

function puzzle1() {
  let seq = data;
  for (let i = 0; i < 40; i++) {
    seq = expand(seq);
  }
  return seq.length;
}

function puzzle2() {
  let seq = data;
  for (let i = 0; i < 50; i++) {
    seq = expand(seq);
  }
  return seq.length;
}

console.log('puzzle 1: ', puzzle1()); // 360154
console.log('puzzle 2: ', puzzle2()); // 5103798
