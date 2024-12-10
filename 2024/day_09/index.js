import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  const alloc = fs.readFileSync('./input.txt', 'utf-8').trim().split('').map((s, i) => parseInt(s, 10));
  const blocks = [];
  for (let i = 0; i < alloc.length; i += 2) {
    blocks.push({
      idx: i / 2,
      size: alloc[i],
      free: alloc[i + 1] ?? 0,
    })
  }
  return blocks;
}

function puzzle1() {
  const disk = parse();
  let i = 0;
  let chunk = { size: 0 };
  while (i < disk.length) {
    // console.log(i, chunk, disk.map((b) => `${b.idx}`.repeat(b.size) + '.'.repeat(b.free)).join(''));
    if (chunk.size === 0) {
      chunk = disk.pop();
      disk[disk.length - 1].free = 0
    } else if (chunk.size <=  disk[i].free) {
      // block fits in current free space. insert block after and adjust the remaining free space
      disk.splice(i + 1, 0, {
        idx: chunk.idx,
        size: chunk.size,
        free: disk[i].free - chunk.size,
      });
      chunk.size = 0;
      disk[i].free = 0;
      i += 1;
    } else {
      // block does not fit in current space. split block and adjut
      disk.splice(i + 1, 0, {
        idx: chunk.idx,
        size: disk[i].free,
        free: 0,
      });
      chunk.size -= disk[i].free;
      disk[i].free = 0;
      i += 2;
    }
  }
  if (chunk.size > 0) {
    disk.push(chunk)
    chunk.free = 0;
  }
  // console.log(i, chunk, disk.map((b) => `${b.idx}`.repeat(b.size) + '.'.repeat(b.free)).join(''));
  let sum = 0;
  i = 0;
  for (const chunk of disk) {
    // console.log(chunk)
    for (let n = 0; n < chunk.size; n += 1) {
      sum += i * chunk.idx
      i += 1;
    }
  }
  return sum;
}

function puzzle2() {
  const disk = parse();
  for (let j = disk.length - 1; j > 0; j -= 1) {
    // console.log(j, disk.map((b) => `${b.idx}`.repeat(b.size) + '.'.repeat(b.free)).join(''));
    // find if file fits
    for (let i = 0; i < j; i += 1) {
      if (disk[j].size <= disk[i].free) {
        // remove file
        const [file] = disk.splice(j, 1);
        // make previous free space larger
        disk[j - 1].free += file.size + file.free;
        // insert file after current one
        disk.splice(i + 1, 0, file);
        // and adjust the free spaces
        file.free = disk[i].free - file.size;
        disk[i].free = 0;
        j += 1
        break;
      }
    }
  }
  // console.log(disk.map((b) => `${b.idx}`.repeat(b.size) + '.'.repeat(b.free)).join(''));
  let sum = 0;
  let i = 0;
  for (const chunk of disk) {
    // console.log(chunk)
    for (let n = 0; n < chunk.size; n += 1) {
      sum += i * chunk.idx
      i += 1;
    }
    i += chunk.free;
  }
  return sum;


}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());  // 9706905316018
                                       // 6286182965311
