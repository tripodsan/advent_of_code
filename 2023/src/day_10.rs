use std::fs::File;
use std::io::{BufRead, BufReader};
use colored::Colorize;

// const INPUT: &str = r"day_10/input_test3.txt";
const INPUT: &str = r"day_10/input.txt";

const EAST:usize = 1;
const SOUTH:usize = 2;
const WEST:usize = 4;
const NORTH:usize = 8;
const PATH:usize = 16;
const OUTSIDE:usize = 32;
const INSIDE:usize = 64;

const DIRS: [[i32; 2]; 4] = [
  [ 1, 0], // 0 east   | 1
  [ 0, 1], // 1 south  | 2
  [-1, 0], // 2 west   | 4
  [ 0,-1], // 3 north  | 8
];

// defines the tile mapping. i.e. entering direction -> output direction (4 is block)
// the connected tiles bitmask defines the tile
const TILES: [[usize; 4]; 16] = [
  [4, 4, 4, 4], //  0
  [4, 4, 4, 4], //  1
  [4, 4, 4, 4], //  2
  [4, 4, 1, 0], //  3 F
  [4, 4, 4, 4], //  4
  [0, 4, 2, 4], //  5 -
  [1, 4, 4, 2], //  6 7
  [4, 4, 4, 4], //  7
  [4, 4, 4, 4], //  8
  [4, 0, 3, 4], //  9 L
  [4, 1, 4, 3], // 10 |
  [4, 4, 4, 4], // 11
  [3, 2, 4, 4], // 12 J
  [4, 4, 4, 4], // 13
  [4, 4, 4, 4], // 14
  [4, 4, 4, 4], // 16
];

#[derive(Debug)]
struct Map {
  grid:Vec<Vec<usize>>,
  start:[i32;2],
  max_x:i32,
  max_y:i32,
}

impl Map {
  pub fn get(&self, x:i32, y:i32) -> Option<usize> {
    if x >= 0 && x < self.max_x && y >= 0 && y < self.max_y {
      return Some(self.grid[y as usize][x as usize]);
    }
    None
  }

  pub(crate) fn set(&mut self, x: i32, y: i32, v: usize) {
    if x >= 0 && x < self.max_x && y >= 0 && y < self.max_y {
      self.grid[y as usize][x as usize] = v;
    }
  }

  pub(crate) fn mark(&mut self, x: i32, y: i32, v: usize) {
    if x >= 0 && x < self.max_x && y >= 0 && y < self.max_y {
      self.grid[y as usize][x as usize] |= v;
    }
  }

  pub fn count_marked(&self, v:usize) -> i32 {
    let mut num = 0;
    for row in &self.grid {
      for &c in row {
        if c & (16 + 32 + 64) == v {
          num += 1;
        }
      }
    }
    num
  }

  pub fn flood_fill(&mut self, x:i32, y:i32, v:usize, force:bool) {
    if x >= 0 && x < self.max_x && y >= 0 && y < self.max_y {
      if force || self.grid[y as usize][x as usize] & (16 + 32 + 64) == 0 {
        self.grid[y as usize][x as usize] = v;
        self.flood_fill(x - 1, y, v, false);
        self.flood_fill(x + 1, y, v, false);
        self.flood_fill(x , y - 1, v, false);
        self.flood_fill(x , y + 1, v, false);
      }
    }
  }

  pub fn fill(&mut self) {
    let mut y = 0;
    while y < self.max_y {
      let mut x = 0;
      while x < self.max_x {
        let c = self.grid[y as usize][x as usize];
        if c & (PATH + OUTSIDE) == OUTSIDE {
          self.flood_fill(x, y, OUTSIDE, true)
        }
        if c & (PATH + INSIDE) == INSIDE {
          self.flood_fill(x, y, INSIDE, true)
        }
        x += 1;
      }
      y += 1;
    }
  }

  pub fn dump(&self) {
    let mut y = 0;
    while y < self.max_y {
      let row = &self.grid[y as usize];
      let line:String = row.iter().enumerate().map(|(x, c)| {
        let t = match c & 15 {
          10 => "│",
          5 => "─",
          9 => "└",
          12 => "┘",
          6 => "┐",
          3 => "┌",
          _ => ".",
        };
        if c & (PATH + OUTSIDE) == OUTSIDE { // is outside and not path
          return "O".green().bold().to_string();
        }
        if c & (PATH + INSIDE) == INSIDE { // is inside and not path
          return "I".green().bold().to_string();
        }

        if x == self.start[0] as usize && y == self.start[1] {
          return t.red().to_string();
        }
        if c & PATH == PATH {
          return t.yellow().to_string();
        }
        t.to_string()
      }).collect();
      println!("{}", line);
      y += 1;
    }
  }
}

fn load_data() -> Map {
  let mut reader = BufReader::new(File::open(INPUT).expect("could not open file"));
  let mut line = String::new();
  let mut grid:Vec<Vec<usize>> = vec![];
  let mut y:i32 = 0;
  let mut start:[i32;2] = [0, 0];
  loop {
    line.clear();
    if reader.read_line(&mut line).unwrap() == 0 {
      break;
    }
    let row:Vec<usize> = line.trim().chars().enumerate().map(|(x, c)| {
      match c {
        '.' => 0,
        '|' => NORTH + SOUTH,
        '-' => WEST + EAST,
        'L' => NORTH + EAST,
        'J' => NORTH + WEST,
        '7' => SOUTH + WEST,
        'F' => SOUTH + EAST,
        'S' => {
          start[0] = x as i32;
          start[1] = y;
          0
        }
        _ => { panic!("invalid input")}
      }
    }).collect();
    grid.push(row);
    y += 1;
  }
  let max_x = grid[0].len() as i32;
  Map {
    grid,
    start,
    max_x,
    max_y: y,
  }
}

fn find_loop(data:&mut Map) -> i32 {
  let mut dir = 4;
  let mut x = data.start[0];
  let mut y = data.start[1];
  // find starting direction
  let mut start_tile = 0;
  for d in 0..4 {
    if let Some(tile) = data.get(x + DIRS[d][0], y + DIRS[d][1]) {
      if TILES[tile][d] != 4 {
        start_tile += i32::pow(2, d as u32);
        dir = d;
      }
    }
  }
  if dir == 4 {
    panic!("invalid starting position.")
  }
  data.set(x, y, start_tile as usize + 16);
  let mut dist = 0;
  loop {
    // mark outside and inside
    data.mark(x + DIRS[dir][1], y - DIRS[dir][0], 32);
    data.mark(x - DIRS[dir][1], y + DIRS[dir][0], 64);

    dist += 1;
    x += DIRS[dir][0];
    y += DIRS[dir][1];
    if x == data.start[0] && y == data.start[1] {
      break;
    }
    if let Some(tile) = data.get(x, y) {
      // mark path
      data.set(x, y, tile | 16);
      // mark outside and inside
      data.mark(x + DIRS[dir][1], y - DIRS[dir][0], 32);
      data.mark(x - DIRS[dir][1], y + DIRS[dir][0], 64);
      dir = TILES[tile & 15][dir];
      // println!("{x},{y} {tile} {dir}");
      if dir == 4 {
        panic!("invalid tile");
      }
    } else {
      panic!("out of bounds")
    }
  }
  // now flood fill all the non path tiles
  data.fill();
  data.dump();
  dist
}

#[allow(dead_code)]
pub fn run() {
  let mut data = load_data();
  println!("puzzle 1: {}", find_loop(&mut data) / 2);
  println!("puzzle 2: {}", data.count_marked(INSIDE));
}