import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const RE = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n').map((l) => {
    const [_, nr, ore_ore, cly_ore, obs_ore, obs_cly, geo_ore, geo_obs ] = l.match(RE);
    const bp = {
      nr,
      rec: {
        ore_ore: parseInt(ore_ore, 10),
        cly_ore: parseInt(cly_ore, 10),
        obs_ore: parseInt(obs_ore, 10),
        obs_cly: parseInt(obs_cly, 10),
        geo_ore: parseInt(geo_ore, 10),
        geo_obs: parseInt(geo_obs, 10),
      },
    };
    bp.rec.max_ore = Math.max(bp.rec.ore_ore, bp.rec.cly_ore, bp.rec.obs_ore, bp.rec.geo_ore);
    return bp;
  });

data.forEach((rec) => console.log(rec));

function build(rec, res, resP) {
  const ret = Array(4);
  for (let i = 0; i < 4; i++) {
    if (res[i] < rec[i]) {
      return null;
    }
    ret[i] = resP[i] - rec[i];
  }
  return ret
}

function add(v0, v1) {
  const ret = Array(v0.length);
  for (let i = 0; i < ret.length; i++) {
    ret[i] = v0[i] + v1[i];
  }
  return ret;
}

function work(rec, max_time) {
  const q = [];
  q.push({
    time: max_time,
    rob: [1, 0, 0, 0],
    res: [0, 0, 0, 0],
  });

  let bestGeodes = 0;
  let iter = 0;
  while (q.length) {
    const { time, rob, res } = q.pop();
    if (iter++ % 10000000 === 0) {
      console.log(iter, time, q.length, rob, res, bestGeodes);
    }
    const timeP = time - 1;
    // next amount of resource
    const resP = add(res, rob);
    if (!timeP) {
      bestGeodes = Math.max(bestGeodes, resP[3]);
      continue;
    }
    // if remaining time is not enough to produce geodes, abort path
    if (resP[3] + (timeP * timeP + timeP) / 2 + rob[3] * timeP <= bestGeodes) {
      continue;
    }

    // if there is enough obs and ore, always build a geode robot
    if (res[0] >= rec.geo_ore && res[2] >= rec.geo_obs) {
      q.push({
        time: timeP,
        rob: add(rob, [0, 0, 0, 1]),
        res: add(resP, [-rec.geo_ore, 0, -rec.geo_obs, 0]),
      });
    } else {
      // try building an obsidian robot (if it not already has enough)
      if (res[0] >= rec.obs_ore && res[1] >= rec.obs_cly) {
        if (res[2] < timeP * (rec.geo_obs - rob[2])) {
          q.push({
            time: timeP,
            rob: add(rob, [0, 0, 1, 0]),
            res: add(resP, [-rec.obs_ore, -rec.obs_cly, 0, 0]),
          });
        }
      }
      // try building a clay robot
      if (res[0] >= rec.cly_ore) {
        if (res[1] < timeP * (rec.obs_cly - rob[1])) {
          q.push({
            time: timeP,
            rob: add(rob, [0, 1, 0, 0]),
            res: add(resP, [-rec.cly_ore, 0, 0, 0]),
          });
        }
      }
      // try building an ore robot
      if (res[0] >= rec.ore_ore) {
        if (res[0] < timeP * (rec.max_ore - rob[0])) {
          q.push({
            time: timeP,
            rob: add(rob, [1, 0, 0, 0]),
            res: add(resP, [-rec.ore_ore, 0, 0, 0]),
          });
        }
      }
      // do nothing:
      q.push({
        time: timeP,
        rob,
        res: resP,
      });
    }
  }
  return bestGeodes;
}

function puzzle1() {
  let q = 0;
  for (const bp of data) {
    const ret = work(bp.rec, 24);
    console.log(`Blueprint ${bp.nr}: ${ret} geodes.`);
    q += bp.nr * ret;
  }
  return q;
}

function puzzle2() {
  let q = 1;
  for (let i = 0; i < data.length && i < 3; i++) {
    const bp = data[i];
    const ret = work(bp.rec, 32);
    console.log(`Blueprint ${bp.nr}: ${ret} geodes.`);
    q *= ret;
  }
  return q;

}

// console.log('puzzle 1 : ', puzzle1()); // 1356
console.log('puzzle 2 : ', puzzle2());
