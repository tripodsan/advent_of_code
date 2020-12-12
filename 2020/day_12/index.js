const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => [s[0], Number.parseInt(s.substring(1))]);

// console.log(data);

/*
puzzle 1:  1148

Action N means to move north by the given value.
Action S means to move south by the given value.
Action E means to move east by the given value.
Action W means to move west by the given value.
Action L means to turn left the given number of degrees.
Action R means to turn right the given number of degrees.
Action F means to move forward by the given value in the direction the ship is currently facing.
 */

/*
Action N means to move the waypoint north by the given value.
Action S means to move the waypoint south by the given value.
Action E means to move the waypoint east by the given value.
Action W means to move the waypoint west by the given value.
Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
Action F means to move forward to the waypoint a number of times equal to the given value.

puzzle 2:  52203
 */

function rot(v, d) {
  d = (d+360)%360;
  switch (d) {
    case 0:
      return v;
    case 90:
      return [v[1], -v[0]];
    case 180:
      return [-v[0], -v[1]];
    case 270:
      return [-v[1], v[0]];
  }
}

function run() {
  let x = 0;
  let y = 0;
  let v = [1, 0];
  data.forEach(([c, n]) => {
    switch (c) {
      case 'N':
        y += n;
        break;
      case 'E':
        x += n;
        break;
      case 'S':
        y -= n;
        break;
      case 'W':
        x -= n;
        break;
      case 'L':
        v = rot(v, 360-n);
        break;
      case 'R':
        v = rot(v, n);
        break;
      case 'F':
        x += n * v[0];
        y += n * v[1];
        break;
    }
  });
  return Math.abs(x) + Math.abs(y);
}

function puzzle2() {
  let x = 0;
  let y = 0;
  let v = [10, 1];
  data.forEach(([c, n]) => {
    switch (c) {
      case 'N':
        v[1] += n;
        break;
      case 'E':
        v[0] += n;
        break;
      case 'S':
        v[1] -= n;
        break;
      case 'W':
        v[0] -= n;
        break;
      case 'L':
        v = rot(v, 360-n);
        break;
      case 'R':
        v = rot(v, n);
        break;
      case 'F':
        x += n * v[0];
        y += n * v[1];
        break;
    }
  });
  return Math.abs(x) + Math.abs(y);
}

function puzzle1() {
  return run();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
