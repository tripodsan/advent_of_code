import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

const DIRS = {
  '^': [0, -1],
  '>': [1, 0],
  'v': [0, 1],
  '<': [-1, 0],
}

function parse() {
  const [gridData, moveData] = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n\n');
  let robot;
  const grid = new Grid(2).init(gridData, (x, y, c) => {
    if (c === '@') {
      robot = [x,y];
      c = '.';
    }
    return c;
  });
  const move = moveData.trim().split('').filter((c) => !!c)
  return {
    grid,
    move,
    robot,
  };
}

function puzzle1() {
  let { robot, grid, move } = parse();
  // grid.dump(robot);

  const moveRobot = (dir, cell) => {
    const next = grid.get(vec2.add([], cell.v, dir));
    if (next.c === '#') {
      return null;
    }
    if (next.c === 'O') {
      moveRobot(dir, next)
    }
    if (next.c === '.') {
      next.c = cell.c;
      cell.c = '.'
      return next
    }
    return null;
  }

  let r = grid.get(robot);
  for (const d of move) {
    const dir = DIRS[d];
    if (!dir) {
      continue;
    }
    // console.log(`-------------< ${d} ${dir} >---------------`);
    const next = moveRobot(dir, r);
    if (next) {
      r = next;
    }
    // grid.dump(r.v);
  }
  let score = 0;
  for (const cell of grid.values()) {
    if (cell.c === 'O') {
      score += cell.v[0] + cell.v[1] * 100;
    }
  }
  return score;
}

function widen(g0) {
  const grid = new Grid(2);
  for (const cell of g0.values()) {
    const v0 = [cell.v[0] * 2, cell.v[1]];
    const v1 = [v0[0] + 1, v0[1]];
    if (cell.c === '.') {
      grid.put(v0, '.');
      grid.put(v1, '.');
    } else if (cell.c === '#') {
      grid.put(v0, '#');
      grid.put(v1, '#');
    } else {
      grid.put(v0, '(');
      grid.put(v1, ')');
    }
  }
  return grid;
}

function puzzle2() {
  let { robot, grid: grid0, move } = parse();
  const grid = widen(grid0);
  robot[0] *= 2;
  // grid.dump(robot);

  const moveRobotHorz = (dir, cell) => {
    const next = grid.get(vec2.add([], cell.v, dir));
    if (next.c === '#') {
      return null;
    }
    if (next.c === '(' || next.c === ')') {
      moveRobotHorz(dir, next)
    }
    if (next.c === '.') {
      next.c = cell.c;
      cell.c = '.'
      return next
    }
    return null;
  }

  const canMoveVert = (dir, cell) => {
    const next = grid.get(vec2.add([], cell.v, dir));
    if (next.c === '#') {
      return null;
    }
    if (next.c === '(') {
      const right = grid.get(vec2.add([], next.v, [1, 0]))
      return canMoveVert(dir, next) && canMoveVert(dir, right);
    } else if (next.c === ')') {
      const left = grid.get(vec2.add([], next.v, [-1, 0]))
      return canMoveVert(dir, next) && canMoveVert(dir, left);
    }
    return true;
  }

  const moveRobotVert = (dir, cell) => {
    const next = grid.get(vec2.add([], cell.v, dir));
    if (next.c === '#') {
      return null;
    }
    if (next.c === '.') {
      next.c = cell.c;
      cell.c = '.';
      return next;
    }
    if (next.c === '(') {
      const right = grid.get(vec2.add([], next.v, [1, 0]))
      moveRobotVert(dir, next);
      moveRobotVert(dir, right);
      next.c = cell.c;
      cell.c = '.';
    } else if (next.c === ')') {
      const left = grid.get(vec2.add([], next.v, [-1, 0]))
      moveRobotVert(dir, next);
      moveRobotVert(dir, left);
      next.c = cell.c
      cell.c = '.';
    }
    return next;
  }

  let r = grid.get(robot);
  for (const d of move) {
    const dir = DIRS[d];
    if (!dir) {
      continue;
    }
    // console.log(`-------------< ${d} ${dir} >---------------`);
    if (dir[1] === 0) {
      const next = moveRobotHorz(dir, r);
      if (next) {
        r = next;
      }
    } else {
      if (canMoveVert(dir, r)) {
        r = moveRobotVert(dir, r);
      }
    }
    // grid.dump(r.v);
  }
  let score = 0;
  for (const cell of grid.values()) {
    if (cell.c === '(') {
      score += cell.v[0] + cell.v[1] * 100;
    }
  }
  return score;
}

console.log('puzzle 1: ', puzzle1()); // 1406392
console.log('puzzle 2: ', puzzle2()); // 1429013
