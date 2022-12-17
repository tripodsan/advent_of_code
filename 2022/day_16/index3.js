// copied from https://gist.github.com/p-a/843788fad6d49dca815facd822f01092

import fs from 'fs';

const memo = func => {
  const cache = new Map();
  return (...args) => {
    const key = args.join();
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      const val = func(...args);
      cache.set(key, val);
      return val;
    }
  };
};

const RE = /Valve (..) has flow rate=(\d+); tunnels? leads? to valves? (.*)/;

const parse = input =>
  new Map(
    input
      .split("\n")
      .map(line => RE.exec(line))
      .map(([, valve, rate, valves]) => [
        valve,
        Number(rate),
        valves.split(", "),
      ])
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([valve, rate, valves], i, arr) => [
        1n << BigInt(i),
        [
          rate,
          valves.map(
            v =>
              1n <<
              BigInt(
                arr.findIndex(([valve]) => v === valve)
              )
          ),
          valve,
        ],
      ])
  );

const shortestPath = graph => {
  const keys = [...graph.keys()];
  const distMap = new Map(
    keys.map(k => [
      k,
      new Map(keys.map(l => [l, Number.MAX_SAFE_INTEGER])),
    ])
  );
  keys.forEach(u =>
    graph.get(u).map(v => distMap.get(u).set(v, 1))
  );
  keys.forEach(k => distMap.get(k).set(k, 0));
  keys.forEach(k =>
    keys.forEach(i =>
      keys.forEach(j =>
        distMap
          .get(i)
          .set(
            j,
            Math.min(
              distMap.get(i).get(j),
              distMap.get(i).get(k) + distMap.get(k).get(j)
            )
          )
      )
    )
  );
  return distMap;
};

const evaluate = (input, time = 30, firstrun = false) => {
  const data = parse(input);
  const distMap = shortestPath(
    new Map([...data].map(([key, data]) => [key, data[1]]))
  );
  const keys = [...data.keys()];
  const flow = new Map(keys.map(k => [k, data.get(k)[0]]));

  const START = 1n;
  const dfs = memo((valve, minutes, open, firstrun) =>
    keys
      .filter(
        k =>
          !(open & k) &&
          flow.get(k) &&
          distMap.get(valve).get(k) < minutes
      )
      .map(k => {
        const d = distMap.get(valve).get(k) + 1;
        const timeleft = minutes - d;
        return (
          timeleft * flow.get(k) +
          dfs(k, timeleft, open | k, firstrun)
        );
      })
      .reduce(
        (max, v) => (max > v ? max : v),
        firstrun ? dfs(START, time, open, false) : 0
      )
  );
  return dfs(START, time, 0n, firstrun);
};

const data = fs.readFileSync('./input.txt', 'utf-8').trim()

console.log(evaluate(data));
console.log(evaluate(data, 26, true));
