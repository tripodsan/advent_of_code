
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim());

function isHeight(v) {
  if (v.endsWith('cm')) {
    const n = Number(v.substring(0, 3));
    return n >= 150 && n <= 193;
  }
  if (v.endsWith('in')) {
    const n = Number(v.substring(0, 2));
    return n >= 59 && n <= 76;
  }
  return false;
}

function process(validate) {
  let wasEmpty = true;
  let numValid = 0;
  let check = {};
  for (let line of data) {
    if (!line) {
      if (!wasEmpty) {
        const num = Object.keys(check).length;
        if (num === 0 || num === 1 && check.cid) {
          numValid++;
        }
      }
      wasEmpty = true;
    } else {
      if (wasEmpty) {
        wasEmpty = false;
        /*
          byr (Birth Year) - four digits; at least 1920 and at most 2002.
          iyr (Issue Year) - four digits; at least 2010 and at most 2020.
          eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
          hgt (Height) - a number followed by either cm or in:
            If cm, the number must be at least 150 and at most 193.
            If in, the number must be at least 59 and at most 76.
          hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
          ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
          pid (Passport ID) - a nine-digit number, including leading zeroes.
          cid (Country ID) - ignored, missing or not.
         */
        check = {
          byr: (v) => Number(v) >= 1920 && Number(v) <= 2002,
          iyr: (v) => Number(v) >= 2010 && Number(v) <= 2020,
          eyr: (v) => Number(v) >= 2020 && Number(v) <= 2030,
          hgt: (v) => isHeight(v),
          hcl: (v) => /^#[0-9a-f]{6}$/.test(v),
          ecl: (v) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].indexOf(v) >= 0,
          pid: (v) => /^[0-9]{9}$/.test(v),
          cid: (v) => true,
        }
      }
      const fields = line.split(/\s+/).map((f) => f.split(':'));
      fields.forEach(([key, val]) => {
        if (!validate || check[key](val)) {
          delete check[key];
        }
      });
    }

  }
  return numValid;
}
function puzzle2() {
  return process(true);
}

function puzzle1() {
  return process();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
