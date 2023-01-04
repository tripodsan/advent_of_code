import fs from 'fs';
import '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n').map((line) => line.split(/[\s:]+/));

function parse() {
  const boss = {
    hp: parseInt(data.shift().pop()),
    damage: parseInt(data.shift().pop()),
    armour: parseInt(data.shift().pop()),
  }
  const shop = {};
  let group;
  for (const line of data) {
    if (line.length === 1) {
      group = null;
    } else {
      if (group === null) {
        group = [];
        shop[line.shift()] = group;
      } else {
        group.push({
          name: line.shift(),
          cost: parseInt(line.shift()),
          damage: parseInt(line.shift()),
          armour: parseInt(line.shift()),
        })
      }
    }
  }
  const none = {
    name: 'None',
    cost: 0,
    damage: 0,
    armour: 0,
  };
  shop.Armor.push(none);
  shop.Rings.push(none);
  shop.Rings.push(none);
  // console.log(shop);
  return { boss, shop };
}

function *pairs(a) {
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = i + 1; j < a.length; j++) {
      yield [a[i], a[j]];
    }
  }
}

function play(p0, p1) {
  while (true) {
    p1.hp -= Math.max(1, p0.damage - p1.armour);
    if (p1.hp <= 0) {
      return 0;
    }
    p0.hp -= Math.max(1, p1.damage - p0.armour);
    if (p0.hp <= 0) {
      return 1;
    }
  }
}

function solve() {
  const { boss, shop } = parse();
  let best = Number.MAX_SAFE_INTEGER;
  let worst = 0;
  for (const weapon of shop.Weapons) {
    for (const armour of shop.Armor) {
      for (const rings of pairs(shop.Rings)) {
        let cost = 0;
        const player = {
          hp: 100,
          damage: 0,
          armour: 0,
        };
        for (const item of [weapon, armour, ...rings]) {
          cost += item.cost;
          player.damage += item.damage;
          player.armour += item.armour;
        }
        boss.hp = 100;
        const winner = play(player, boss);
        // console.log(cost, winner, player, boss);
        if (winner === 0) {
          best = Math.min(best, cost);
        } else {
          worst = Math.max(worst, cost);
        }
      }
    }
  }
  console.log('puzzle 1', best);  // 91
  console.log('puzzle 2', worst); // 158
}

solve();
