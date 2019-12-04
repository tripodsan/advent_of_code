
function run(low, high, fn) {
  let c = 0;
  for (let i = low; i <= high; i++) {
    const p = `${i}`.split('').map((c) => +c);
    const m = new Array(10).fill(0);
    let dec = false;
    let prev = 0;
    p.forEach((c) => {
      if (prev > c) {
        dec = true;
      }
      prev = c;
      m[c]++
    });
    if (!dec && m.findIndex(fn) >= 0) {
      c++;
    }
  }
  return c;
}

function puzzle2() {
  const r = run(171309, 643603, (c) => c === 2);
  console.log('result 2: ', r);
}

function puzzle1() {
  const r = run(171309, 643603, (c) => c > 1);
  console.log('result 1: ', r);
}

puzzle1();
puzzle2();

