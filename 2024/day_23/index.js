import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';


function parse() {
  const pairs = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => !!l)
    .map((l) => l.split('-'));

  const hosts = new Map();

  for (const p of pairs) {
    const hs = p.map((name) => {
      let h = hosts.get(name);
      if (!h) {
        h = {
          name,
          out: new Map()
        };
        hosts.set(name,  h);
      }
      return h;
    });
    hs[0].out.set(hs[1].name, hs[1]);
    hs[1].out.set(hs[0].name, hs[0]);
  }
  return hosts;
}

function puzzle1() {
  const hosts = parse();
  const res = new Set();
  for (const h of hosts.values()) {
    if (h.name.startsWith('t')) {
      for (const c0 of h.out.values()) {
        for (const c1 of c0.out.values()) {
          if (c1.out.has(h.name)) {
            const set = [h.name, c0.name, c1.name].sort((a,b) => a.localeCompare(b));
            res.add(set.join(','))
          }
        }
      }
    }
  }
  return res.size;
}

function puzzle2() {
  const hosts = parse();
  let best = '';
  for (const h of hosts.values()) {
    const group = [h.name];
    // all outgoing computers need to be connected to all others in this group
    for (const c0 of h.out.values()) {
      // check if c0 is connected to all the computers in the current group
      const included = group.every((name) => c0.out.has(name));
      if (included) {
        // add to group
        group.push(c0.name);
      }
    }
    const code = group.sort((a,b) => a.localeCompare(b)).join(',');
    // console.log(code);
    if (code.length > best.length) {
      best = code;
    }
  }
  return best;
}

console.log('puzzle 1:', puzzle1()); // 1599
console.log('puzzle 2:', puzzle2()); // av,ax,dg,di,dw,fa,ge,kh,ki,ot,qw,vz,yw

