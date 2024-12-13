import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

/*
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

n0 * a0 + n1 * b0 = x

n0 * a1 + n1 * b0 = y

|a0 a1|   |x|   | X |
|     | * | | = |   |
|b0 b1|   |y|   | Y |


xy = inv(M) * [X,Y]
 */

function parse() {
  const arcades = [];
  for (let m of fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n')) {
    const [,a0, a1, b0, b1, x, y] = m.split(/[^\d]+/sg).map((s) => parseInt(s, 10));
    console.log(a0, a1, b0, b1, x, y);
    arcades.push({
      mat: [[a0, b0], [a1, b1]],
      target: [x, y],
    });
  }
  return arcades;
}

function isInteger(n) {
  return Math.abs(Math.round(n) - n) < 0.0001;
}

function solve({mat, target}) {
  // console.log('----------------------------------')
  // console.log(mat)
  const inv = vec2.inv(mat);
  // console.log(inv)
  const n = vec2.matrixMult([], inv, target);
  if (isInteger(n[0]) && isInteger(n[1])) {
    const price =  Math.round(n[0]) * 3 + Math.round(n[1]);
    console.log(price);
    return price;
  }
  console.log(n);
  return 0;
}

function puzzle1() {
  const arcades = parse();
  return arcades.reduce((acc, arc) => acc + solve(arc), 0);
}

function puzzle2() {
  const ADD = 10000000000000;
  const arcades = parse();
  return arcades.map((arcade) => {
    arcade.target[0] += ADD;
    arcade.target[1] += ADD;
    return arcade;
  }).reduce((acc, arc) => acc + solve(arc), 0);
}

console.log('puzzle 1: ', puzzle1())
console.log('puzzle 2: ', puzzle2());
