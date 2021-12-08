const fs = require('fs');

const patterns2 = new Map();
const patterns3 = new Map();

const ROT = [
  [],
  [1],
  [
    2, 0, // 0 1
    3, 1  // 2 3
  ],
  [
    6, 3, 0, // 0 1 2
    7, 4, 1, // 3 4 5
    8, 5, 2, // 6 7 8
  ],
];

const FLIP_H = [
  [],
  [1],
  [
    1, 0,
    3, 2,
  ],
  [
    2, 1, 0,
    5, 4, 3,
    8, 7, 6,
  ],
];

const FLIP_V = [
  [],
  [1],
  [
    2, 3,
    0, 1,
  ],
  [
    6, 7, 8,
    3, 4, 5,
    0, 1, 2,
  ],
]

function map(pat, mapping) {
  return mapping.map((i) => pat[i]);
}

function flat(pats) {
  return pats.reduce((p, c) => p.concat(c), []);
}

function generate(set, pat, result) {
  result = result.map((p) => p.split(''));

  const update = (p, code) => {
    const key = p.join('');
    const existing = set.get(key);
    if (!existing) {
      console.log(key, code);
    }
    if (existing && existing !== result) {
      console.error('pattern:', code)
      dump(p);
      console.error('exists as:', existing);
      console.error('but wants to set', result);
      throw Error('pattern error');
    }
    set.set(key, result);
  }

  const w = pat.length;
  pat = pat.map((p) => p.split(''));
  pat = flat(pat);
  update(pat, 'id');
  pat = map(pat, ROT[w]);
  update(pat, '90');
  pat = map(pat, ROT[w]);
  update(pat, '180');
  pat = map(pat, ROT[w]);
  update(pat, '270');
  pat = map(pat, ROT[w]);
  update(map(pat, FLIP_H[w]), 'H');
  update(map(pat, FLIP_V[w]), 'V');
  pat = map(pat, ROT[w]);
  update(map(pat, FLIP_H[w]), 'Hp');
  update(map(pat, FLIP_V[w]), 'Vp');
}

fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^.#]+/)
    .map((d) => d.trim())
    .filter((d) => !!d),
  )
  .forEach((data) => {
    if (data.length === 5) {
      generate(patterns2, data.splice(0, 2), data);
    } else {
      generate(patterns3, data.splice(0, 3), data);
    }
  })

function dump(img) {
  const s = Math.sqrt(img.length);
  for (let i = 0; i < img.length; i += s) {
    console.log(img.slice(i, i + s).join(''));
  }
}

function step(img) {
  const s = Math.sqrt(img.length);
  console.log('processing size', s);
  if (s % 2 === 0) {
    const ret = [];
    for (let y = 0; y < s; y+=2) {
      const dy = y * s;
      const r0 = [];
      const r1 = [];
      const r2 = [];
      ret.push(r0, r1, r2);
      for (let x = 0; x < s; x+=2) {
        const pat = [
          img[x + dy], img[x + 1 + dy],
          img[x + s + dy], img[x + 1 + s + dy],
        ];
        const rs = patterns2.get(pat.join(''));
        // console.log(`----`, x, y);
        // dump(pat);
        // console.log(`---->`);
        // dump(flat(rs));
        // console.log(`<----`);
        r0.push(...rs[0]);
        r1.push(...rs[1]);
        r2.push(...rs[2]);
      }
    }
    return flat(ret);
  }
  if (s % 3 === 0) {
    const s2 = 2 * s;
    const ret = [];
    for (let y = 0; y < s; y+=3) {
      const dy = y * s;
      const r0 = [];
      const r1 = [];
      const r2 = [];
      const r3 = [];
      ret.push(r0, r1, r2, r3);
      for (let x = 0; x < s; x+=3) {
        const pat = [
          img[x + dy], img[x + 1 + dy], img[x + 2 + dy],
          img[x + s + dy], img[x + 1 + s + dy], img[x + 2 + s + dy],
          img[x + s2 + dy], img[x + 1 + s2 + dy], img[x + 2 + s2 + dy],
        ];
        const rs = patterns3.get(pat.join(''));
        // console.log(`----`, x, y);
        // dump(pat);
        // console.log(`---->`);
        // dump(flat(rs));
        // console.log(`<----`);
        r0.push(...rs[0]);
        r1.push(...rs[1]);
        r2.push(...rs[2]);
        r3.push(...rs[3]);
      }
    }
    return flat(ret);
  }
  throw Error('no pattern');
}

function puzzle1(iter) {
  let img = '.#...####'.split('');
  dump(img);
  for (let i = 0; i < iter; i++) {
    console.log('------------------------', i + 1);
    img = step(img);
    // dump(img);
  }
  return img.reduce((s, p) => s + (p === '#' ? 1 : 0), 0);
}

console.log('puzzle 1:', puzzle1(5));
console.log('puzzle 2:', puzzle1(18));
