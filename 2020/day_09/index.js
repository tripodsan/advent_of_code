
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/g))
  .map((s) => [s[0], Number.parseInt(s[1])]);


/*
nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6
 */

// data.forEach((d) => console.log(d, typeof(d)))

class RuntimeError extends Error {
  constructor(msg, acc, pc) {
    super(msg);
    this.acc = acc;
    this.pc = pc;
  }
}

function process(program) {
  let acc = 0;
  let pc = 0;
  let visited = [];
  while (pc < program.length) {
    const [ opc, arg ] = program[pc];
    if (visited[pc]) {
      throw new RuntimeError(`Infinite loop! acc=${acc}, pc=${pc}`, acc, pc);
    }
    visited[pc] = true;
    switch (opc) {
      case 'acc': {
        acc += arg;
        pc++;
        break;
      }
      case 'nop': {
        pc++;
        break;
      }
      case 'jmp': {
        pc += arg;
        break;
      }
      default:
        throw new RuntimeError(`Illegal opcode! acc=${acc}, pc=${pc}, opc=${opc}`, acc, pc);
    }
  }
  return acc;
}

function puzzle2() {
  let last = -1;
  while (true) {
    let found = false;
    const p = data.map((s, idx) => {
      if (!found && idx > last && (s[0] === 'nop' || s[0] === 'jmp')) {
        found = true;
        last = idx;
        return [s[0] === 'jmp' ? 'nop': 'jmp', s[1]];
      }
      return [...s];
    });
    try {
      return process(p);
    } catch (e) {
      // ignore
    }
  }
}

function puzzle1() {
  try {
    process(data);
  } catch (e) {
    console.log(e.message);
    return e.acc;
  }
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
