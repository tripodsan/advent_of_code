import crypto from 'crypto';
import fs from 'fs';


const CONFIGS = {
  TEST: {
    size: 20,
    start: '10000',
  },
  PUZ1: {
    size: 272,
    start: '00101000101111010',
  },
  PUZ2: {
    size: 35_651_584,
    start: '00101000101111010',
  },
}

function solve({ start, size }) {
  let data = start.split('').map((d) => parseInt(d, 10));
  while (data.length < size) {
    const len = data.length;
    data.push(0);
    for (let i = len - 1; i >= 0; i--) {
      data.push(1 - data[i]);
    }
  }
  data.length = size;
  while (data.length % 2 === 0) {
    for (let i = 0; i < data.length - 1; i += 2) {
      const j = i / 2;
      data[j] = 1 - data[i] ^ data[i + 1];
    }
    data.length /= 2;
  }
  return data.join('');
}

function puzzle1() {
  return solve(CONFIGS.PUZ1);
}

function puzzle2() {
  return solve(CONFIGS.PUZ2);
}

console.log('puzzle 1: ', puzzle1()); // 10010100110011100
console.log('puzzle 2: ', puzzle2());
