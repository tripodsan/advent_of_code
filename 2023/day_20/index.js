import fs from 'fs';

function parse() {
  const modules = {};
  // &pr -> pd, vx, vn, cl, hm
  fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n')
    .forEach((line) => {
      const [mod, ...children] = line.split(/[ >,-]+/);
      const name = mod.substring(1);
      const type = mod.substring(0, 1);
      modules[name] = {
        name,
        type,
        children,
        parents: [],
        state: type === '&' ? {} : 0, // for nands, the state is the inputs of the parents
      }
    });

  // link children
  for (const mod of Object.values(modules)) {
    mod.children = mod.children.map((c) => {
      let child = modules[c];
      if (!child) {
        // pure output module
        child = modules[c] = {
          name: c,
          type: '?',
          children: [],
          parents: [],
        }
      }
      if (child.type === '&') {
        child.state[mod.name] = 0;
      }
      child.parents.push(mod);
      return child;
    });
  }
  return modules;
}

function propagate(signals, stats) {
  const new_pulses = [];
  for (const signal of signals) {
    const [parent, mod, pulse] = signal;
    stats[pulse]++;
    let new_pulse = -1;
    if (mod.type === 'b') {
      // There is a single broadcast module (named broadcaster).
      // When it receives a pulse, it sends the same pulse to all of its destination modules.
      new_pulse = pulse;
    } else if (mod.type === '%') {
      // Flip-flop modules (prefix %) are either on or off; they are initially off.
      // If a flip-flop module receives a high pulse, it is ignored and nothing happens.
      // However, if a flip-flop module receives a low pulse, it flips between on and off.
      // If it was off, it turns on and sends a high pulse. If it was on, it turns off and sends a low pulse.
      if (pulse === 0) {
        mod.state ^= 1;
        new_pulse = mod.state;
      }
    } else if (mod.type === '&') {
      // Conjunction modules (prefix &) remember the type of the most recent pulse received from each of their connected input modules;
      // they initially default to remembering a low pulse for each input.
      // When a pulse is received, the conjunction module first updates its memory for that input.
      // Then, if it remembers high pulses for all inputs, it sends a low pulse; otherwise, it sends a high pulse.
      mod.state[parent] = pulse;

      // this is for part II to detect if an input changed to high during a cycle.
      // apparently the puzzle in constructed in a way so that all 4 inputs go high during the same
      // propagation cycle (because after the cycle is finished, the states are low again).
      if (mod.sticky && pulse) {
        mod.sticky[parent] = 1;
      }
      new_pulse = Object.values(mod.state).indexOf(0) < 0 ? 0 : 1;
    }
    if (new_pulse >= 0) {
      for (const child of mod.children) {
        new_pulses.push([mod.name, child, new_pulse]);
        // console.log(`${mod.name} (${new_pulse ? 'high' : 'low'}) -> ${child.name}`);
      }
    }
  }
  return new_pulses;
}

function push(root, stats) {
  let pulses = [['button', root, 0]];
  while (pulses.length) {
    pulses = propagate(pulses, stats);
  }
}

function puzzle1() {
  const modules = parse();
  const stats = [0, 0];
  const root = modules['roadcaster'];
  for (let i = 0; i < 1000; i++) {
    push(root, stats)
  }
  return stats[0] * stats[1];
}

function puzzle2() {
  const modules = parse();
  const stats = [0, 0];
  const root = modules['roadcaster'];

  // my puzzle input has 4 distinct circuits that end in &kj, the parent of rx. when all 4 are high,
  // then rx will receive a low. we count the periodicity of input
  const rx = modules['rx'];
  const kj = rx.parents[0];

  const highs = new Map();
  let i = 0;
  let p = 1;
  while (highs.size !== kj.parents.length) {
    i += 1;
    kj.sticky = {};
    push(root, stats);
    for (const name of Object.keys(kj.sticky)) {
      if (!highs.has(name)) {
        // console.log(`found period of ${name}:`, i);
        highs.set(name, i);
        p *= i;
      }
    }
  }
  return p;
}

console.log('puzzle 1:', puzzle1()); // 949764474
console.log('puzzle 2:', puzzle2());

