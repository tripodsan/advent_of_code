import fs from 'fs';
import { ocr } from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim().split('\n');

function decompress(bytes, recursive = false, pos = 0, end = bytes.length) {
  let num = 0;

  const readInt = () => {
    let d = 0;
    while (bytes[pos] !== 'x' && bytes[pos] !== ')') {
      d = d * 10 + parseInt(bytes[pos++], 10);
    }
    return d;
  }

  while (pos < end) {
    if (bytes[pos] === '(') {
      pos++;
      let n = readInt();
      if (bytes[pos++] !== 'x') {
        throw Error();
      }
      let c = readInt();
      if (bytes[pos++] !== ')') {
        throw Error();
      }
      const d = recursive
        ? decompress(bytes, recursive, pos, pos + n)
        : n;
      pos += n;
      num += d * c;
    } else {
      pos++;
      num += 1;
    }
  }
  return num;
}

function puzzle1() {
  return decompress(data[0].split(''));
}

function puzzle2() {
  return decompress(data[0].split(''), true);
}

console.log('puzzle 1: ', puzzle1()); // 120765
console.log('puzzle 2: ', puzzle2()); // 11658395076

// for (const line of data) {
//   console.log(line, decompress2(line.split(''), 0));
// }
