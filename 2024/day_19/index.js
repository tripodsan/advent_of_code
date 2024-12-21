import fs from 'fs';

function parse() {
  let [towels, designs] = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n');
  towels = towels.split(',')
    .map((c) => c.trim())
    .filter((c) => !!c);
  designs = designs.split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c);

  towels.sort((a, b) => a.length - b.length);
  return {
    towels,
    designs,
  }
}

function solve(design, ts) {
  const q = [];
  q.push({
    d: design,
    s: 1,
  });

  let count = 0;
  while (q.length) {
    const { d, s } = q.shift();
    for (const t of ts) {
      if (d === t) {
        count += s;
      } else if (d.startsWith(t)) {
        const sd = d.substring(t.length);
        const ep = q.find((e) => e.d === sd);
        if (ep) {
          ep.s += s;
        } else {
          q.push({
            d: sd,
            s,
          })
        }
      }
    }
  }
  return count;
}

function puzzle1() {
  let { towels, designs } = parse();
  let n = 0;
  let sum = 0;
  for (const d of designs) {
    const count = solve(d, towels);
    if (count) {
      sum += count;
      n += 1;
    }
  }
  return [n, sum];
}

console.log('puzzle 1,2: ', puzzle1()); // 336, 758890600222015
