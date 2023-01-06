import '../../utils.js';
import { Heap } from 'heap-js';

const BOSS = {
  hp: 55,
  damage: 8,
};

// You start with 50 hit points and 500 mana points.
const PLAYER = {
  hp: 50,
  mana: 500,
  armour: 0,
};

const P0_HP = 0;
const P1_HP = 1;
const P0_MANA = 2;
const P0_COST = 3;
const P0_EFF_SHIELD = 4;
const P0_EFF_POISON = 5;
const P0_EFF_RECHRG = 6;

const P1_DAMAGE = 8;

const EFFECTS = [{
  // Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
  idx: P0_EFF_SHIELD,
  name: 'Shield',
  cost: 113,
  duration: 6,
  fn: () => {},
}, {
  // Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
  idx: P0_EFF_POISON,
  name: 'Poison',
  cost: 173,
  duration: 6,
  fn: (s) => s[P1_HP] -= 3,
}, {
  // Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.
  idx: P0_EFF_RECHRG,
  name: 'Recharge',
  cost: 229,
  duration: 5,
  fn: (s) => s[P0_MANA] += 101,
}];

const SPELLS = [{
  // Magic Missile costs 53 mana. It instantly does 4 damage.
  name: 'Missile',
  cost: 53,
  fn: (s) => s[P1_HP] -= 4,
}, {
  // Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
  name: 'Drain',
  cost: 73,
  fn: (s) => {
    s[P0_HP] += 2;
    s[P1_HP] -= 2;
  }
}];

const ALL = [
  ...EFFECTS,
  ...SPELLS,
];

function puzzle1(hard = false) {
  // // You start with 50 hit points and 500 mana points.
  const q = new Heap((e0, e1) => e1[P0_COST] - e0[P0_COST]);
  q.push([50, 55, 500, 0, 0, 0, 0, 0]);

  let best = Number.MAX_SAFE_INTEGER;
  function win(sp) {
    best = Math.min(best, sp[P0_COST]);
    // console.log('player wins with ', sp[P0_MANA], 'mana');
  }

  while (q.size()) {
    const s = q.pop();
    const time = s.pop();
    if (s[P0_COST] > best) {
      continue;
    }

    if (hard) {
      s[P0_HP] -= 1;
      if (s[P0_HP] <= 0) {
        continue;
      }
    }
    // if (time === 10) {
    //   return;
    // }
    // console.log('--- player turn ---', iter, time)
    // console.log(s);
    // apply any effects
    for (let i = P0_EFF_SHIELD; i <= P0_EFF_RECHRG; i++) {
      let t = s[i];
      if (t) {
        const e = EFFECTS[i - P0_EFF_SHIELD];
        s[i] = --t;
        // console.log(`${e.name} active. timer=${t}`)
        e.fn(s);
      }
    }
    if (s[P1_HP] <= 0) {
      win(s);
      continue;
    }

    // cast spells
    for (const spell of ALL) {
      let sp = [...s];
      if (spell.cost > sp[P0_MANA]) {
        continue;
      }
      // ignore effects that are still active
      if (spell.duration) {
        if (sp[spell.idx]) {
          continue;
        }
        // console.log('player casts ', spell.name, 'for', spell.cost);
        sp[P0_MANA] -= spell.cost;
        sp[spell.idx] = spell.duration;
        sp[P0_COST] += spell.cost;
      } else {
        // console.log('player casts ', spell.name, 'for', spell.cost);
        sp[P0_MANA] -= spell.cost;
        sp[P0_COST] += spell.cost;
        spell.fn(sp);
      }

      // console.log('--- boss turn ---', iter, time)
      // console.log(sp);
      // apply any effects
      for (let i = P0_EFF_SHIELD; i <= P0_EFF_RECHRG; i++) {
        let t = sp[i];
        if (t) {
          const e = EFFECTS[i - P0_EFF_SHIELD];
          sp[i] = --t;
          // console.log(`${e.name} active. timer=${t}`)
          e.fn(sp);
        }
      }
      if (sp[P1_HP] <= 0) {
        win(sp);
        continue;
      }

      const damage = P1_DAMAGE - (sp[P0_EFF_SHIELD] ? 7 : 0);
      sp[P0_HP] -= damage;
      // console.log(`boss does ${damage} damage.`);
      if (sp[P0_HP] <= 0) {
        // console.log('boss wins');
      } else {
        sp.push(time + 1);
        q.add(sp);
      }
    }
  }
  return best;
}

function puzzle2() {
  return puzzle1(true);
}

console.log('puzzle 1: ', puzzle1()); // 953
console.log('puzzle 2: ', puzzle2()); // 1289
