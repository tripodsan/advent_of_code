import fs from 'fs';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim() || '-1')
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));

function puzzle2() {
  const sums = []
  let sum = 0;
  for (const d of data) {
    if (d < 0) {
      sums.push(sum)
      sum = 0
    } else {
      sum += d
    }
  }
  sums.sort((s0, s1) => s1 - s0);
  return sums[0] + sums[1] + sums[2];
}

function puzzle2_heap() {
  const maxHeap = new Heap(Heap.maxComparator);
  let sum = 0;
  for (const d of data) {
    if (d < 0) {
      maxHeap.push(sum)
      sum = 0
    } else {
      sum += d
    }
  }
  return maxHeap.pop() + maxHeap.pop() + maxHeap.pop();
}

function puzzle1() {
  let max = 0;
  let sum = 0;
  for (const d of data) {
    if (d < 0) {
      max = Math.max(max, sum)
      sum = 0
    } else {
      sum += d
    }
  }

  return max;
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
console.log('puzzle 2+: ', puzzle2_heap());
