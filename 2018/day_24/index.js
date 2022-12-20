import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';
import { Heap } from 'heap-js';

const RE = /(\d+) units each with (\d+) hit points (\([^)]+\))?\s?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;

/*
Immune System:
17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2
989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3
2033 units each with 4054 hit points (immune to cold; weak to fire, slashing) with an attack that does 18 slashing damage at initiative 3
3109 units each with 3593 hit points with an attack that does 9 bludgeoning damage at initiative 11

Infection:
801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1
4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4
 */

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');


function parseAttrs(a) {
  const attrs = {
    immune: new Set(),
    weak: new Set(),
  };
  if (a) {
    let key = null;
    for (const w of a.split(/\W+/)) {
      if (w === 'weak' || w === 'immune') {
        key = w;
      } else if (w && w !== 'to') {
        attrs[key].add(w);
      }
    }
  }
  return attrs;
}

function parseGroup(line, name, player) {
  // console.log(line);
  const [_, num, hit, attrs, atk, atkType, ini] = line.match(RE);
  const g = {
    player,
    name,
    num: parseInt(num, 10),
    hit: parseInt(hit, 10),
    attrs: parseAttrs(attrs),
    atk: parseInt(atk, 10),
    atkType,
    ini: parseInt(ini, 10),
  };
  return updatePower(g);
}

function parse() {
  const players = [];
  let p = null;
  for (const line of data) {
    if (line === 'Immune System:') {
      p = {
        name: 'Immune System',
        groups: [],
      };
      players.push(p);
    } else if (line === 'Infection:') {
      p = {
        name: 'Infection',
        groups: [],
      }
      players.push(p);
    } else if (line) {
      p.groups.push(parseGroup(line, `${p.name} ${p.groups.length + 1}`, p));
    }
  }
  // console.log(JSON.stringify(players, null, 2));
  return players;
}


function damage(g0, g1) {
  if (g1.attrs.immune.has(g0.atkType)) {
    return 0;
  }
  if (g1.attrs.weak.has(g0.atkType)) {
    return g0.eff * 2;
  }
  return g0.eff;
}

function updatePower(g) {
  // Each group also has an effective power: the number of units in that group multiplied by their attack damage
  g.eff = g.num * g.atk;
  return g;
}

function select(gs0, gs1) {
  // sort gs0 by effective power
  gs0.sort((g0, g1) => {
    // In decreasing order of effective power, groups choose their targets;
    const c = g1.eff - g0.eff;
    if (c) {
      return c;
    }
    // in a tie, the group with the higher initiative chooses first.
    return g1.ini - g0.ini;
  });

  const ret = [];
  // list of candidates
  const cs = gs1.map((g1) => ({ group: g1, dmg: 0 }))
  for (const g0 of gs0) {
    // update damage for each candidate
    for (const c of cs) {
      c.dmg = damage(g0, c.group);
    }
    cs.sort((c0, c1) => {
      // The attacking group chooses to target the group in the enemy army to which it would deal the most damage
      let c = c1.dmg - c0.dmg;
      if (c) {
        return c;
      }
      // If an attacking group is considering two defending groups to which it would deal equal damage,
      // it chooses to target the defending group with the largest effective power
      c = c1.group.eff - c0.group.eff;
      if (c) {
        return c;
      }
      // if there is still a tie, it chooses the defending group with the highest initiative.
      return c1.group.ini - c0.group.ini;
    })
    // for (const c of cs) {
    //   console.log(`${g0.ini}->${c.group.ini} ${g0.name} would deal ${c.group.name} ${c.dmg} damage`);
    // }
    // If it cannot deal any defending groups damage, it does not choose a target.
    if (cs.length && cs[0].dmg > 0) {
      const c = cs.shift();
      ret.push({
        att: g0,
        def: c.group,
      });
    }
    if (!cs.length) {
      break;
    }
  }
  // ret.forEach((move) => console.log(`${move.att.name} selects ${move.def.name}`));
  return ret;
}

function simulate(boost = 0) {
  const ps = parse();
  for (const g of ps[0].groups) {
    g.atk += boost;
    updatePower(g);
  }
  while (ps[0].groups.length && ps[1].groups.length) {
    // for (const p of ps) {
    //   for (const g of p.groups) {
    //     console.log(`${g.name} contains ${g.num} units`);
    //   }
    // }

    // During the target selection phase, each group attempts to choose one target. In decreasing order of effective power
    const t0 = select(ps[0].groups, ps[1].groups);
    const t1 = select(ps[1].groups, ps[0].groups);

    // Groups attack in decreasing order of initiative, regardless of whether they are part of the infection or the immune system.
    const moves = [...t0, ...t1];
    moves.sort((m0, m1) => m1.att.ini - m0.att.ini);
    let tie = true;
    for (const { att, def } of moves) {
      // The defending group only loses whole units from damage; damage is always dealt in such a way
      // that it kills the most units possible, and any remaining damage to a unit that does not immediately kill it is ignored.
      const dmg = damage(att, def);
      const loss = Math.floor(dmg / def.hit);
      if (loss > 0) {
        tie = false;
      }
      // console.log(`${att.ini}->${def.ini} ${att.name} attacks ${def.name}, killing ${loss} units`);
      def.num = Math.max(0, def.num - loss);
      updatePower(def);
      if (!def.num) {
        const idx = def.player.groups.indexOf(def);
        if (idx < 0) {
          throw Error('!!!');
        }
        def.player.groups.splice(idx, 1);
      }
    }
    // console.log('------------------------------------')
    if (tie) {
      console.log(boost, 'tie!');
      return null;
    }
  }
  return ps;
}

function results(winner) {
  console.log(`${winner.name} wins!`);
  let num = 0;
  for (const g of winner.groups) {
    console.log(`  ${g.name} contains ${g.num} units`);
    num += g.num;
  }
  return num;
}

function puzzle1() {
  const ps = simulate(0);
  return results(ps[0].groups.length ? ps[0] : ps[1]);
}

function puzzle2() {
  let boost = 1;
  while (true) {
    const ps = simulate(boost++);
    if (ps && ps[0].groups.length) {
      return results(ps[0])
    }
  }
}

console.log('puzzle 1:', puzzle1()); // 10538
console.log('puzzle 2:', puzzle2());
