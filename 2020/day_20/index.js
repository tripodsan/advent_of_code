
const fs = require('fs');
const { Grid } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);

/**
 Tile 1471:
 .#...##.##
 #...#.#..#
 ##.......#
 #..#.....#
 #..##....#
 .#.#..#...
 ##.##.#..#
 ...###..#.
 ......##..
 .##..##.#.
 */

function reverse(s) {
  return s.split('').reverse().join('');
}

function rot(image) {
  const W = image[0].length;
  const H = image.length;
  const ret = [];
  for (let y = 0; y < W; y++) {
    let row = '';
    for (let x = 0; x < H; x++) {
      row += image[H-x-1][y];
    }
    ret.push(row);
  }
  return ret;
}

function flipH(image) {
  const H = image.length;
  const ret = [];
  for (let y = H-1; y >=0; y--) {
    ret.push(image[y]);
  }
  return ret;
}

function flipV(image) {
  return image.map(reverse);
}

function setPixel(img, x, y, c) {
  img[y] = `${img[y].substring(0, x)}${c}${img[y].substring(x+1)}`;
}

let tile = 0;
let tileData;
const tiles = {};
data.push('Tile 999:');
for (const line of data) {
  if (line.startsWith('Tile')) {
    if (tileData) {
      tileData.nr = tile;
      tiles[tile] = tileData;
      const { ori, image } = tileData;
      let img = [...image];
      for (let i =0; i < 12; i++) {
        if (i === 4) {
          img = flipH(image);
        }
        ori.push({
          img,
          edge: [
            img[0],
            img.map((l) => l[l.length -1]).join(''),
            img[img.length - 1],
            img.map((l) => l[0]).join(''),
          ],
        });
        img = rot(img);
      }
    }
    tile = Number.parseInt(line.substring(5, line.length - 1));
    tileData = {
      image: [],
      ori: [],
    };
  } else {
    tileData.image.push(line);
  }
}

// console.log(JSON.stringify(tiles, null, 2), Object.keys(tiles).length);
// return;
DIR = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function key(x,y) {
  return [x,y].join(':');
}

function run() {
  return 42;
}

function match(tile, rot, dir, cand) {
  const edge = tile.ori[rot].edge[dir];
  const dirP = (dir + 2) % 4;
  for (let i = 0; i < 12; i++) {
    if (cand.ori[i].edge[dirP] === edge) {
      return i;
    }
  }
  return -1;
}

function puzzle1() {
  const  grid = new Grid(2);
  const ts = { ...tiles};
  const first = Object.keys(tiles)[0];
  grid.put([0, 0], {
    tile: ts[first],
    tileRot: 10,
  });
  delete ts[first];
  let found = true;
  while (Object.keys(ts).length && found) {
    found = false;
    grid.values().forEach((g) => {
      if (!g.sides) {
        g.sides = [null, null, null, null];
        DIR.forEach((d, idx) => {
          const nv = [g.v[0] + d[0], g.v[1] + d[1]];
          // console.log(nk);
          if (!grid.get(nv)) {
            // find matching tile
            for (const nr in ts) {
              const t = ts[nr];
              const r = match(g.tile, g.tileRot, idx, t);
              if (r >= 0) {
                // console.log(`${g.tile.nr} matches ${t.nr} dir ${idx}, rot ${r}`);
                g.sides[idx] = t;
                grid.put(nv, {
                  tile: t,
                  tileRot: r,
                })
                found = true;
                delete ts[nr];
                break;
              }
            }
          }
        })
      }
    })
  }
  if (!found) {
    console.log('no found');
  }
  const image = [];
  const H = Object.values(tiles)[0].image.length - 2;
  const W = Object.values(tiles)[0].image[0].length - 2;
  const [minx, miny] = grid.min;
  const [maxx, maxy] = grid.max;
  for (let y = miny; y <= maxy; y++) {
    for (let yy = 0; yy < H; yy++) {
      image.push([]);
    }
    for (let x = minx; x <= maxx; x++) {
      const g = grid.get([x, y]);
      const iy = (y - miny)*H;
      if (g) {
        for (let yy = 0; yy < H; yy++) {
          image[iy+yy] += g.tile.ori[g.tileRot].img[yy + 1].substring(1, W+1);
        }
        process.stdout.write(`${g.tile.nr} `);
      } else {
        for (let yy = 0; yy < H; yy++) {
          image[iy+yy] += '-'.repeat(W);
        }
        process.stdout.write(`.... `);
      }
    }
    process.stdout.write('\n');
  }
  const c = [
    grid.get([minx, miny]).tile.nr,
    grid.get([maxx, miny]).tile.nr,
    grid.get([maxx, maxy]).tile.nr,
    grid.get([minx, maxy]).tile.nr,
  ];
  // console.log(c);
  console.log('puzzle 1: ', c[0]*c[1]*c[2]*c[3]);
  console.log(image);
  console.log('searching for monsters....')

  const monster = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
  ];
  const MH = monster.length;
  const MW = monster[0].length;
  let img ;
  for (let i =0; i < 8; i++) {
    if (i === 0) {
      img = [...image];
    } else if (i === 4) {
      img = flipH(image);
    }
    const IW = img[0].length;
    const IH = img.length;

    // find monster
    let found = 0;
    let dst = img;
    for (let y = 0; y < IH - MH; y++) {
      for (let x = 0; x < IW - MW; x++) {
        let cand = [...dst];
        for (let my = 0; cand && my < MH; my++) {
          for (let mx = 0; mx < MW; mx++) {
            if (monster[my][mx] === '#') {
              if (img[y+my][x+mx] !== '#') {
                cand = null;
                break;
              } else {
                setPixel(cand, x+mx, y+my, 'O');
              }
            }
          }
        }
        if (cand) {
          found++;
          dst = cand;
        }
      }
    }
    if (found) {
      console.log(dst);
      let rough = 0;
      for (let y = 0; y < IH; y++) {
        for (let x = 0; x < IW; x++) {
          if (dst[y][x] === '#') {
            rough++;
          }
        }
      }
      return rough;
    }
    img = rot(img);
  }
  return 0;
}

// puzzle 1: 17148689442341
// puzzle 2: 2009
console.log('puzzle 2: ', puzzle1());
