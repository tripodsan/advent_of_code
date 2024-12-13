import fs from 'fs';
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
    // console.log(a0, a1, b0, b1, x, y);
    arcades.push({
      mat: [[a0, b0], [a1, b1]],
      target: [x, y],
    });
  }
  return arcades;
}

function solve({mat, target}) {
  const inv = [[0,0], [0,0]];
  const det = vec2.invDet(inv, mat);
  const n = vec2.matrixMult([], inv, target);
  // console.log(n, det, n[0]%det, n[1]%det);
  if (n[0]%det === 0 && n[1]%det === 0) {
    const price =  (n[0] * 3 + n[1]) / det;
    // console.log(price);
    return price;
  }
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

console.log('puzzle 1: ', puzzle1())  // 35574
console.log('puzzle 2: ', puzzle2()); // 80882098756071
