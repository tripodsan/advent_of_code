
function puzzle1(max) {
  const list = [3, 7];
  let p0 = 0;
  let p1 = 1;
  while (list.length < max + 10) {
    const s0 = list[p0];
    const s1 = list[p1];
    const sum = s0 + s1;
    if (sum >= 10) {
      list.push(1);
    }
    list.push(sum % 10);
    p0 = (p0 + s0 + 1) % list.length;
    p1 = (p1 + s1 + 1) % list.length;
    // console.log(list.join(''));
  }
  return list.slice(max, max + 10).join('');
}

function puzzle2(pattern) {
  pattern = pattern.split('').map((d) => parseInt(d, 10));
  const list = [3, 7];
  let p0 = 0;
  let p1 = 1;
  let matched = 0;
  let offset = 2;

  const update = (n) => {
    list.push(n);
    if (pattern[matched++] === n) {
      if (matched === pattern.length) {
        return true;
      }
    } else {
      offset += matched;
      matched = 0;
    }
  }

  while (true) {
    const s0 = list[p0];
    const s1 = list[p1];
    const sum = s0 + s1;
    if (sum >= 10) {
      if (update(1)) {
        return offset;
      }
    }
    if (update(sum % 10)) {
      return offset;
    }
    p0 = (p0 + s0 + 1) % list.length;
    p1 = (p1 + s1 + 1) % list.length;
  }
}


console.log('puzzle 1:', puzzle1(47801))
console.log('puzzle 2:', puzzle2('51589'))
console.log('puzzle 2:', puzzle2('59414'))
console.log('puzzle 2:', puzzle2('047801'))
// console.log('puzzle 2:', puzzle1(true));
