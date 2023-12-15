import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',');

class HashMap {
  static hash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i += 1) {
      h = (h + s.charCodeAt(i)) * 17 % 256;
    }
    return h;
  }

  constructor() {
    this.map = Array.from({ length: 256 }, () => []);
  }

  set(key, value) {
    const slot = this.map[HashMap.hash(key)];
    const idx = slot.findIndex((e) => e.key === key);
    if (idx >= 0) {
      slot[idx].value = value;
    } else {
      slot.push({key, value});
    }
  }

  remove(key) {
    const slot = this.map[HashMap.hash(key)];
    const idx = slot.findIndex((e) => e.key === key);
    if (idx >= 0) {
      slot.splice(idx, 1);
    }
  }

  checksum() {
    let sum = 0;
    for (let i = 1; i <= this.map.length; i += 1) {
      const slot = this.map[i - 1];
      for (let j = 1; j <= slot.length; j += 1) {
        sum += i * j * slot[j - 1].value;
      }
    }
    return sum;
  }
}

function puzzle1() {
  return data.reduce((acc, cur) => acc + HashMap.hash(cur), 0);
}

function puzzle2() {
  const map = new HashMap();
  for (const ins of data) {
    if (ins.endsWith('-')) {
      map.remove(ins.substring(0, ins.length - 1));
    } else {
      const [ key, value] = ins.split('=');
      map.set(key, value);
    }
  }
  return map.checksum();
}

console.log('puzzle 1:', puzzle1()); // 501680
console.log('puzzle 2:', puzzle2()); // 241094
