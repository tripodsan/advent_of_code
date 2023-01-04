const N = 33_100_000;

function puzzle1() {
  const max = 1000000;
  const houses = new Array(max).fill(0);
  for (let i = 1; i < max; i++) {
    for (let j = 1; j < max; j++) {
      const p = i * j;
      if (p < max) {
        houses[p] += i * 10;
      } else {
        break;
      }
    }
    if (houses[i] >= N) {
      return i;
    }
  }
}

function puzzle2() {
  const max = 1000000;
  const houses = new Array(max).fill(0);
  for (let i = 1; i < max; i++) {
    for (let j = 1; j <= 50; j++) {
      const p = i * j;
      if (p < max) {
        houses[p] += i * 11;
      } else {
        break;
      }
    }
    if (houses[i] >= N) {
      return i;
    }
  }

}

console.log('puzzle 1: ', puzzle1()); // 776160
console.log('puzzle 2: ', puzzle2()); // 786240
