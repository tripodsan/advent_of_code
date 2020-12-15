
// const data = '0,3,6'
const data = '11,18,0,20,1,7,16'
// const data = '2,1,10,11,0,6' // wompking
  .split(',')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map(((s) => Number.parseInt(s, 10)));

console.log(data);

function run(limit) {
  let idx = 1;
  let last = [];
  let lastNumber = 0;
  while (idx <= data.length) {
    last[lastNumber] = idx;
    lastNumber = data[idx - 1];
    idx++;
  }
  while (idx <= limit) {
    const d = last[lastNumber] || idx;
    last[lastNumber] = idx;
    lastNumber = idx - d;
    idx++;
    if (idx % 1000000 === 0) {
      console.log(idx, last.length);
    }
  }
  return lastNumber;
}

function puzzle2() {
  return run(30000000);
}

function puzzle1() {
  return run(2020);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
