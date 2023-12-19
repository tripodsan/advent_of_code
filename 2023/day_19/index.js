import fs from 'fs';

const OPS = {
  '<': (rule, part) => part[rule.prop] < rule.value ? rule.next : null,
  '>': (rule, part) => part[rule.prop] > rule.value ? rule.next : null,
  't': (rule, part) => rule.next,
};

function parse(fn) {
  let [p0, p1] = fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n\n');
  const workflows = {};
  p0
    .split('\n')
    .forEach((line) => {
      const [name, rulesStr] = line.split(/[{}]+/);
      // px{a<2006:qkq,m>2090:A,rfg}
      const rules = rulesStr.split(',').map((rule) => {
        const [cond, next] = rule.split(':');
        if (!next) {
          return {
            op: 't',
            next: cond,
          };
        }
        const [prop, value] = cond.split(/[<>]/);
        return {
          prop,
          next,
          value: Number.parseInt(value, 10),
          op: cond.charAt(1),
        };
      });
      workflows[name] = {
        name,
        rules,
        parents: [],
      };
    });

  return {
    workflows,
    // {x=96,m=100,a=1797,s=545}
    parts: p1
      .split('\n')
      .map((line) => {
        const part = {};
        line.split(/[{,}]+/).filter((c) => !!c).forEach((c) => {
          const [categ, value] = c.split('=');
          part[categ] = Number.parseInt(value, 10);
        })
        return part;
      }),
  }
}

function transition(workflows, name, part) {
  while (true) {
    let wf = workflows[name];
    if (!wf) {
      return name;
    }
    for (const rule of wf.rules) {
      const next = OPS[rule.op](rule, part);
      if (next) {
        name = next;
        break;
      }
    }
  }
}

function puzzle1() {
  const { workflows, parts } = parse();
  let sum = 0;
  for (const part of parts) {
    if (transition(workflows, 'in', part) === 'A') {
      sum += part.x + part.m + part.a + part.s;
    }
  }
  return sum;
}

function limit(range, rule, inverse) {
  const np = rule.op === 't' ? null : [...range[rule.prop]];
  if (inverse) {
    if (rule.op === '<') { // >=
      np[0] = Math.max(np[0], rule.value);
    } else if (rule.op === '>') { // <=
      np[1] = Math.min(np[1], rule.value);
    } else { // 't'
      return null;
    }
  } else {
    if (rule.op === '<') {
      np[1] = Math.min(np[1], rule.value - 1);
    } else if (rule.op === '>') {
      np[0] = Math.max(np[0], rule.value + 1);
    } else { // 't'
      return range;
    }
  }
  // out of range
  if (np[0] > np[1]) {
    return null;
  }
  return {
    ...range,
    [rule.prop]: np,
  };
}

function backtrack(workflows, name, range) {
  const wf = workflows[name];
  const ranges = [];
  for (const parent of wf.parents) {
    const pwf = workflows[parent];
    // kst{a<3094:A,m>2135:R,x<672:A,A}
    let r = {
      ...range,
      path: [parent, ...range.path],
    };
    for (const rule of pwf.rules) {
      if (rule.next === name) {
        // and positive rule
        const nr = limit(r, rule);
        if (nr) {
          // now backtrack further
          if (parent === 'in') {
            ranges.push(nr);
          } else {
            ranges.push(...backtrack(workflows, parent, nr));
          }
        }
      }
      // invert range
      r = limit(r, rule, true);
      if (!r) {
        break;
      }
    }
  }
  return ranges;
}

function puzzle2() {
  // create back references
  const { workflows } = parse();
  workflows['A'] = {
    name: 'A',
    parents: [],
    rules: [],
  }
  workflows['R'] = {
    name: 'R',
    parents: [],
    rules: [],
  }
  // create backreferences
  for (const [name, workflow] of Object.entries(workflows)) {
    for (const rule of workflow.rules) {
      const nw = workflows[rule.next];
      if (!nw.parents.includes(name)) {
        nw.parents.push(name);
      }
    }
  }
  // console.log(workflows);
  // for each 'A', backtrack and limit ranges
  const ranges = backtrack(workflows, 'A', {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
    path: ['A'],
  })
  // sum combinations
  return ranges
    .reduce((acc, range) => {
        const c = ['x', 'm', 'a', 's'].reduce((acc, p) => (1 + range[p][1] - range[p][0]) * acc, 1);
        // console.log(range, c);
        return acc + c;
      }, 0);
}

console.log('puzzle 1:', puzzle1()); // 348378
console.log('puzzle 2:', puzzle2()); // 121158073425385
