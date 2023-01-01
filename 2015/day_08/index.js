import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

// console.log(data);

function decoded_length(s) {
  let l = 0;
  for (let i = 1; i < s.length - 1; i++) {
    if (s[i] === '\\') {
      if (s[++i] === 'x') {
        i += 2;
      }
    }
    l++;
  }
  return l;
}

function encoded_length(s) {
  let l = 2;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === '\\') {
      l++;
    }
    l++;
  }
  return l;
}

function puzzle1() {
  let code = 0;
  let size = 0;
  for (const line of data) {
    code += line.length;
    size += decoded_length(line);
  }
  return code - size;
}

function puzzle2() {
  let code = 0;
  let size = 0;
  for (const line of data) {
    size += line.length;
    code += encoded_length(line);
  }
  return code - size;

}

console.log('puzzle 1: ', puzzle1()); // 1342
console.log('puzzle 2: ', puzzle2()); // 2797
