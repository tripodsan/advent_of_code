import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  return fs.readFileSync('./input.txt', 'utf-8').trim().split('\n').map((line) => {
    const data = line.split(/[\s:]+/).map((s) => parseInt(s, 10));
    return {
      value: data.shift(),
      ops: data,
    }
  });
}

function check(expected, act, ops, path = '', concat = false) {
  if (ops.length === 0) {
    if (act === expected) {
      console.log(expected, act, ops, path)
      return true;
    }
    return false;
  }
  if (act > expected) {
    return false;
  }
  const [op, ...rest] = ops;
  return check(expected, act * op, rest, `${path} * ${op}`, concat)
    || concat && check(expected, parseInt(`${act}${op}`, 10), rest,`${path} || ${op}`, concat)
    || check(expected,act + op, rest, `${path} + ${op}`, concat)
    ;
}

function puzzle1() {
  let sum = 0;
  for (const { value, ops} of parse()) {
    console.log('-----------------------')
    const first = ops.shift();
    if (check(value, first, ops, String(first))) {
      console.log(value, ops)
      sum += value;
    }
  }
  return sum;
}

function puzzle2() {
  let sum = 0;
  for (const { value, ops} of parse()) {
    console.log('-----------------------')
    const first = ops.shift();
    if (check(value, first, ops, String(first), true)) {
      console.log(value, ops)
      sum += value;
    }
  }
  return sum;
}

// console.log('puzzle 1: ', puzzle1()); // 2654749936343
console.log('puzzle 2: ', puzzle2());
