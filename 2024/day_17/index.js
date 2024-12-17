import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  const [reg, prog] = fs.readFileSync('./input_test.txt', 'utf-8').trim().split('\n\n');
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

function puzzle1() {
  const { code, reg } = parse();
  let pc = 0;
  while (pc >=0 && pc < code.length) {
    const opc = code[pc++];
    let op = code[pc++];
    /*
    Combo operands 0 through 3 represent literal values 0 through 3.
    // Combo operand 4 represents the value of register A.
Combo operand 5 represents the value of register B.
Combo operand 6 represents the value of register C.
Combo operand 7 is reserved and will not appear in valid programs.
     */

    switch (opc) {
      // The adv instruction (opcode 0) performs division.
      // The numerator is the value in the A register.
      // The denominator is found by raising 2 to the power of the instruction's combo operand.
      // (So, an operand of 2 would divide A by 4 (2^2); an operand of 5 would divide A by 2^B.) The result of the division operation is truncated to an integer and then written to the A register.
      case 0:
        reg.a = Math.floor(reg.a / 2**op)


//
// The bxl instruction (opcode 1) calculates the bitwise XOR of register B and the instruction's literal operand, then stores the result in register B.
//
// The bst instruction (opcode 2) calculates the value of its combo operand modulo 8 (thereby keeping only its lowest 3 bits), then writes that value to the B register.
//
// The jnz instruction (opcode 3) does nothing if the A register is 0. However, if the A register is not zero, it jumps by setting the instruction pointer to the value of its literal operand; if this instruction jumps, the instruction pointer is not increased by 2 after this instruction.
//
// The bxc instruction (opcode 4) calculates the bitwise XOR of register B and register C, then stores the result in register B. (For legacy reasons, this instruction reads an operand but ignores it.)
//
// The out instruction (opcode 5) calculates the value of its combo operand modulo 8, then outputs that value. (If a program outputs multiple values, they are separated by commas.)
//
// The bdv instruction (opcode 6) works exactly like the adv instruction except that the result is stored in the B register. (The numerator is still read from the A register.)
//
// The cdv instruction (opcode 7) works exactly like the adv instruction except that the result is stored in the C register. (The numerator is still read from the A register.)

    }
  }

  console.log(prog);
}

function puzzle2() {
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
