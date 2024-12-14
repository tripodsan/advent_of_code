import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

// const X = 11;
// const Y = 7;
const X = 101;
const Y = 103;


function parse() {
  return fs.readFileSync('./input.txt', 'utf-8').trim().split('\n').map((line) => {
    const [,x,y,vx,vy] = line.split(/[^\d-]+/).map((s) => parseInt(s, 10));
    return {
      x,y,vx,vy
    }
  });
}

function makeGrid(robots) {
  const grid = new Grid(2);
  for (const robot of robots) {
    grid.getOrSet([robot.x, robot.y], () => ({ c: 1}), (cell) => {
      cell.c++;
      return cell;
    })
  }
  return grid;
}

function puzzle1() {
  const robots = parse();
  for (let n = 0; n < 100; n++) {
    for (const robot of robots) {
      robot.x = (robot.x + robot.vx + X) % X;
      robot.y = (robot.y + robot.vy + Y) % Y;
    }
  }
  const grid = makeGrid(robots);
  // grid.dump(undefined, (cell) => cell ? cell.c : `.`)
  const quads = [0, 0, 0, 0];
  for (let y = 0; y < Y; y++) {
    if (y === Math.floor(Y/2)) {
      continue;
    }
    const j = y < Y/2 ? 0 : 2;
    for (let x = 0; x < X; x++) {
      if (x === Math.floor(X/2)) {
        continue;
      }
      const cell = grid.get([x,y]);
      if (cell) {
        const i = j + (x < X/2 ? 0 : 1);
        quads[i] += cell.c;
      }
    }
  }
  return quads.reduce((p, v) => p * v, 1)
}

function puzzle2() {
  const robots = parse();
  for (let n = 0; n < X*Y; n++) {
    for (const robot of robots) {
      robot.x = (robot.x + robot.vx + X) % X;
      robot.y = (robot.y + robot.vy + Y) % Y;
    }
    // the robots display the easter egg when none overlap
    const grid = makeGrid(robots);
    if (grid.values().every((cell) => cell.c === 1)) {
      console.log(`-----< ${n + 1} >------------------------------------------------`);
      grid.dump(undefined, (cell) => cell ? cell.c : `.`)
      return n + 1;
    }
  }

}

console.log('puzzle 1: ', puzzle1()); // 229868730
console.log('puzzle 2: ', puzzle2()); // 7861
