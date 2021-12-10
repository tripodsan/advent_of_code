require('../../utils.js');
/*
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
 */

const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9wft]+/)
    .filter((d) => !!d)
  );


// console.log(data);

function puzzle1() {
  const guards = {};
  let best = { total: 0 };
  let guard;
  let from;
  for (const [year, month, day, hour, min, id, mark] of data) {
    const minute = parseInt(min);
    if (mark === 'ft') {
      const gid = parseInt(id);
      guard = guards[gid];
      if (!guard) {
        guard = {
          gid,
          sleep: new Array(60).fill(0),
          total: 0,
          best: 0,
        }
        guards[gid] = guard;
      }
    } else if (id === 'f') {
      // falls asleep
      from = minute;
    } else if (id === 'w') {
      // wake up
      while (from < minute) {
        guard.sleep[from++]++;
        guard.total++;
      }
      if (guard.total > best.total) {
        best = guard;
      }
    } else {
      throw Error();
    }
  }
  const { idx } = best.sleep.max();
  console.log('puzzle 1: ', best.gid * idx);

  const mostSleep =  new Array(60).fill(0);
  const bestGuards = new Array(60).fill(0);
  for (let i = 0; i < 60; i++) {
    Object.values(guards).forEach((g) => {
      if (g.sleep[i] > mostSleep[i]) {
        mostSleep[i] = g.sleep[i];
        bestGuards[i] = g.gid;
      }
    });
  }
  const { idx: bestMinute } = mostSleep.max();
  console.log('puzzle 2: ', bestMinute * bestGuards[bestMinute]);
}

puzzle1();


