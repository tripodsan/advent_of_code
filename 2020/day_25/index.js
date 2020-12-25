
// test
// const p0 = 5764801;
// const p1 = 17807724;

// input
const p0 = 5099500;
const p1 = 7648211;
const div = 20201227;

function enc(subject, div, loop) {
  let v = 1;
  while (loop--) {
    v = (v * subject) % div;
  }
  return v;
}

function findLoop(subject, key, div) {
  let l = 0;
  let v = 1;
  do {
    l++;
    v = (v * subject) % div;
  } while (v !== key);
  return l;
}

function puzzle2() {
  return 'Marry X-Mas!';
}

function puzzle1() {
  const l0 = findLoop(7, p0, div);
  // console.log('loop 0:', l0);
  const l1 = findLoop(7, p1, div);
  // console.log('loop 1:', l1);

  const e0 = enc(p0, div, l1);
  // console.log('enc 0', e0);

  const e1 = enc(p1, div, l0);
  // console.log('enc 1', e1);
  if (e0 !== e1) {
    throw Error('decryption error');
  }
  return e0;
}



console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
