import { counter } from '../../utils.js';
import { inspect } from 'unist-util-inspect';
import fs from 'fs';

// function rotp(pos, a0) {
//   const a1 = (a0 + 1) % 3;
//   const a2 = (a0 + 2) % 3;
//   const cpy = [...pos];
//   pos[a0] =  cpy[a0];
//   pos[a1] =  cpy[a2];
//   pos[a2] = -cpy[a1];
//   return pos;
// }
//
// function rot24(a) {
//   const ret = new Map();
//   for (const rots of counter([0, 1, 2, 3], 3)) {
//     const b = [...a];
//     for (let a = 0; a < 3; a++) {
//       while (rots[a]--) {
//         rotp(b, a);
//       }
//     }
//     ret.set(b.join(), b)
//   }
//   const res = Array.from(ret.values()).sort((p0, p1)=> {
//     let d = p0[0] - p1[0];
//     if (d) {
//       return d;
//     }
//     d = p0[1] - p1[1];
//     if (d) {
//       return d;
//     }
//     return p0[2] - p1[2];
//   })
//   res.forEach((p) => console.log(p));
//   console.log(res.length);
// }

const ROT = [
  [-3, -2, -1],
    [-3, -1, 2],
    [-3, 1, -2],
    [-3, 2, 1],
    [-2, -3, 1],
    [-2, -1, -3],
    [-2, 1, 3],
    [-2, 3, -1],
    [-1, -3, -2],
    [-1, -2, 3],
    [-1, 2, -3],
    [-1, 3, 2],
    [1, -3, 2],
    [1, -2, -3],
    [1, 3, -2],
    [2, -3, -1],
    [2, -1, 3],
    [2, 1, -3],
    [2, 3, 1],
    [3, -2, 1],
    [3, -1, -2],
    [3, 1, 2],
    [3, 2, -1],
    // [1, 2, 3],
];



function rot(p, r) {
  const a0 = Math.abs(r[0]) - 1;
  const a1 = Math.abs(r[1]) - 1;
  const a2 = Math.abs(r[2]) - 1;
  return [
    p[a0] * Math.sign(r[0]),
    p[a1] * Math.sign(r[1]),
    p[a2] * Math.sign(r[2]),
  ];
}

function b2idx(p) {
  return (p[0] + 5000) + (p[1] + 5000) * 10000 + (p[2] + 5000) * 10000 * 10000;
}

function init() {
  const scanners = [];
  let scanner = {

  };
  /*
  --- scanner 27 ---
  406,-785,636
  -566,-637,545
  -530,-710,-444
   */
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .forEach((line) => {
      if (line.startsWith('---')) {
        const segs = line.split(' ');
        scanner = {
          id: parseInt(segs[2], 10),
          scans: [{
            beacons: [],
            diffs: [],
          }],
          orientation: -1,
          position: null,
        }
        scanners.push(scanner);
      } else {
        scanner.scans[0].beacons.push(line.split(',').map((d) => parseInt(d, 10)));
      }
    });

  scanners[0].position = [0, 0, 0];
  scanners[0].orientation = 0;
  scanners.forEach((scanner) => {
    const scan = scanner.scans[0].beacons;
    ROT.forEach((r) => {
      scanner.scans.push({
        beacons: scan.map((p) => rot(p, r)),
        diffs: [],
      });
    });
    // compute diff sets.
    scanner.scans.forEach(({ beacons, diffs }) => {
      // for each beacon, select as origin and calculate the distances to all others
      for (let b = 0; b < beacons.length; b++) {
        const o = beacons[b];
        diffs.push(beacons.map((p) => b2idx([
          p[0] - o[0],
          p[1] - o[1],
          p[2] - o[2],
        ])));
      }
    });
  });
  return scanners;
}

function dump(scanner) {
  console.log(`--- scanner ${scanner.id} ---`);
  console.log('   position', scanner.position);
  console.log('orientation', scanner.orientation);
  // console.log('     scanns', scanner.scans);
}

function intersect(scan0, scan1) {
  const diffs0 = scan0.diffs;
  const diffs1 = scan1.diffs;
  // for each group of beacons, select one as origin and calculate the distances to all others
  for (let b0 = 0; b0 < diffs0.length; b0++) {
    const d0 = diffs0[b0];
    for (let b1 = 0; b1 < diffs1.length; b1++) {
      const d1 = diffs1[b1];
      const common = [];
      d1.forEach((d, idx1) => {
        const idx0 = d0.indexOf(d);
        if (idx0 >= 0) {
          common.push([idx0, idx1]);
        }
      });
      if (common.length >= 12) {
        // console.log(common);
        return common;
      }
    }
  }
  return [];
}

function match(s0, s1) {
  // console.log(`testing ${s0.id} with ${s1.id}`);
  for (let o = 0; o < 24; o++) {
    const scan0 = s0.scans[s0.orientation]; // beacon list of s0
    const scan1 = s1.scans[o];              // beacon list of s1
    const common = intersect(scan0, scan1);   // common beacon index pairs
    if (common.length >= 12) {
      const [i0, i1] = common[0];
      const bc0 = scan0.beacons[i0]; // beacon of s0
      const bc1 = scan1.beacons[i1]; // beacon of s1
      s1.orientation = o;
      s1.position = [
        bc0[0] + s0.position[0] - bc1[0],
        bc0[1] + s0.position[1] - bc1[1],
        bc0[2] + s0.position[2] - bc1[2],
      ]
      console.log(`   position of ${String(s1.id).padStart(2)}: ${s1.position}`);
      // console.log(`orientation of ${s1.id}: ${s1.orientation}`);
      return true;
      // // calculate positions of all beacons
      // return common.map(([i0]) => {
      //   return [
      //     scan0.beacons[i0][0] + s0.position[0],
      //     scan0.beacons[i0][1] + s0.position[1],
      //     scan0.beacons[i0][2] + s0.position[2],
      //   ];
      // });
    }
  }
  return false;
}

function puzzle1() {
  const scanners = init();
  // scanners.forEach(dump);
  const found = [scanners.shift()];
  while (scanners.length) {
    for (let i = 0; i < found.length; i++) {
      for (let j = 0; j < scanners.length; j++) {
        if (match(found[i], scanners[j])) {
          found.push(...scanners.splice(j, 1));
          j--;
        }
      }
    }
  }

  const beacons = new Map();
  found.forEach((scanner) => {
    scanner.scans[scanner.orientation].beacons.forEach((p) => {
      const b = [
        p[0] + scanner.position[0],
        p[1] + scanner.position[1],
        p[2] + scanner.position[2],
      ];
      beacons.set(b.join(), b);
    });
  });

  console.log('total beacons:', beacons.size)

  // calculate the distance between the scanners
  let max = 0;
  for (let i = 0; i < found.length - 1; i++) {
    for (let j = i + 1; j < found.length; j++) {
      const p0 = found[i].position;
      const p1 = found[j].position;
      const d = [0, 1, 2].reduce((s, p) => s + Math.abs(p0[p] - p1[p]), 0);
      max = Math.max(max, d);
    }
  }
  console.log(' max distance:', max);
}

puzzle1();
