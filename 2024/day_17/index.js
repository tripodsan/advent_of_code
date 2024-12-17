import assert from 'assert';
import fs from 'fs';

function parse() {
  const [reg, prog] = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n');
  const [,a,b,c] = reg.split(/[^\d]+/).map((c) => parseInt(c, 10));
  const code = prog.split(/[^\d]+/).map((c) => parseInt(c, 10));
  code.shift();
  return {
    reg: {
      a,b,c,
    },
    code,
  }
}

function run(code, reg) {
  let pc = 0;
  const out = [];

  while (pc >=0 && pc < code.length) {
    const opc = code[pc++];
    const op = code[pc++];

    const comp = () => {
      // Combo operands 0 through 3 represent literal values 0 through 3.
      // Combo operand 4 represents the value of register A.
      if (op === 4) {
        return reg.a;
      } else if (op === 5) {
        return reg.b;
      } else if (op === 6) {
        return reg.c;
      } else if (op === 7) {
        throw new Error('illegal comp');
      } else {
        return op;
      }
    };
    switch (opc) {
      case 0:
        // The adv instruction (opcode 0) performs division.
        // The numerator is the value in the A register.
        // The denominator is found by raising 2 to the power of the instruction's combo operand.
        // (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
        reg.a = Math.floor(reg.a / 2**comp());
        break;
      case 1:
        // The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the
        // instruction's literal operand, then stores the result in register B.
        reg.b ^= op;
        break;
      case 2:
        // The bst instruction (opcode 2) calculates the value of its combo operand modulo 8
        // (thereby keeping only its lowest 3 bits), then writes that value to the B register.
        reg.b = comp() % 8;
        break;
      case 3:
        // The jnz instruction (opcode 3) does nothing if the A register is 0.
        // However, if the A register is not zero, it jumps by setting the instruction pointer to the
        // value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
        if (reg.a !== 0) {
          pc = op;
        }
        break;
      case 4:
        // The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C,
        // then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
        reg.b ^= (reg.c % 8);
        break;
      case 5:
        // The out instruction (opcode 5) calculates the value of its combo operand modulo 8,
        // then outputs that value. (If a program outputs multiple values, they are separated by commas.)
        out.push(comp() % 8);
        break;
      case 6:
        // The bdv instruction (opcode 6) works exactly like the adv instruction except that the
        // result is stored in the B register. (The numerator is still read from the A register.)
        reg.b = Math.floor(reg.a / 2**comp());
        break;
      case 7:
        // The cdv instruction (opcode 7) works exactly like the adv instruction except that the result
        // is stored in the C register. (The numerator is still read from the A register.)
        reg.c = Math.floor(reg.a / 2**comp());
        break;
      default:
        throw new Error('illegal opc');
    }
  }
  return out;
}

function puzzle1() {
  const { code, reg } = parse();
  const out = run(code, reg);
  return out.join(',');
}

function calc(a, one) {
  let b = 0;
  let c = 0;
  const out = [];
  while (a) {
    b = a % 8     // 2,4
    b = b ^ 7     // 1,7
    c = Math.floor(a / 2**b)  // 7,5,
    a = Math.floor(a / 2**3)  // 0,3,
    b = b ^ (c%8)     // 4,4,
    b = b ^ 7     // 1,7,
    out.push(b % 8); // 5,5,
    if (one) {
      break;
    }
  }
  return out;
}

function solve(target) {
  if (target.length === 0) {
    return [0];
  }
  const g = target[0];
  const rest = target.slice(1);
  const as = solve(rest);
  const ret = [];
  for (const A of as) {
    for (let d = 0; d < 8; d++) {
      const ap = A * 8 + d;
      const out = calc(ap, true);
      if (out[0] === g) {
        ret.push(ap);
      }
    }
  }
  return ret;
}

function puzzle2() {
  const { code, reg } = parse();
  const [A] = solve(code);
  if (!A) {
    throw Error();
  }
  const out = run(code, { a: A, b:0, c:0 });
  assert.deepEqual(out, code);
  return A;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
