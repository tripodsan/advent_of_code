const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\W+/))
  .map((op) => {
    const o = op[0].substring(0, 1);
    let p0 = op[0].substring(1);
    let p1 = op[1] ?? '0';
    if (o !== 'p') {
      p0 = parseInt(p0, 10);
      p1 = parseInt(p1, 10);
    }
    return [o, p0, p1];
  });

// console.log(data);

const partner = data.filter(([o]) => o === 'p');
const swizzle = data.filter(([o]) => o !== 'p');

const ops = {
  s(a, n) {
    a.unshift(...a.splice(-n));
    return a
  },

  x(a, p0, p1) {
    const t = a[p0];
    a[p0] = a[p1];
    a[p1] = t;
    return a;
  },

  p(a, p0, p1) {
    return ops.x(a, a.indexOf(p0), a.indexOf(p1))
  }
}

function dance(prog, a) {
  for (const [o, p0, p1] of prog) {
    ops[o](a, p0, p1);
  }
  return a.map((c) => c.charCodeAt(0) - 'a'.charCodeAt(0));
}

function puzzle1() {
  const partnerMap = dance(partner, 'abcdefghijklmnop'.split(''));
  const swizzleMap = dance(swizzle, 'abcdefghijklmnop'.split(''));

  let a = 'abcdefghijklmnop'.split('');
  a = partnerMap.map((p) => a[p])
  a = swizzleMap.map((p) => a[p])
  return a.join('');
}

function puzzle2() {
  const partnerMap = dance(partner, 'abcdefghijklmnop'.split(''));
  const swizzleMap = dance(swizzle, 'abcdefghijklmnop'.split(''));
  let a = 'abcdefghijklmnop'.split('');
  for (let i = 0; i < 1000000000; i++) {
    a = partnerMap.map((p) => a[p])
    if (i % 1000000 === 0) {
      console.log(i / 10000000);
    }
  }
  for (let i = 0; i < 1000000000; i++) {
    a = swizzleMap.map((p) => a[p])
    if (i % 1000000 === 0) {
      console.log(i / 10000000);
    }
  }
  return a.join('');
}


console.log('puzzle 1: ', puzzle1()); // giadhmkpcnbfjelo
console.log('puzzle 2: ', puzzle2()); // njfgilbkcoemhpad
