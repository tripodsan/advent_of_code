use std::fs::File;
use std::io::{BufRead, BufReader};
use glam::{IVec2};

// const INPUT: &str = r"day_11/input_test.txt";
const INPUT: &str = r"day_11/input.txt";

#[derive(Debug)]
struct Map {
  galaxies:Vec<IVec2>,
  empty_x:Vec<bool>,
  empty_y:Vec<bool>,
}

fn count_empty(empty:&Vec<bool>, mut x0:usize, mut x1:usize) -> i64 {
  if x1 < x0 {
    std::mem::swap(&mut x0, &mut x1);
  }
  let mut num = 0;
  for x in (x0 + 1)..x1 {
    if empty[x] {
      num += 1;
    }
  }
  num
}

fn load_data() -> Map {
  let mut reader = BufReader::new(File::open(INPUT).expect("could not open file"));
  let mut line = String::new();
  let mut galaxies:Vec<IVec2> = vec![];
  let mut y:i32 = 0;
  let mut max_x = 0;
  loop {
    line.clear();
    if reader.read_line(&mut line).unwrap() == 0 {
      break;
    }
    for (x, c) in line.trim().chars().enumerate() {
      if c == '#' {
        galaxies.push(IVec2::new(x as i32, y));
        max_x = max_x.max(x);
      }
    }
    y += 1;
  }
  let mut empty_x:Vec<bool> = vec![true; max_x + 1];
  let mut empty_y:Vec<bool> = vec![true; y as usize];
  for g in &galaxies {
    empty_x[g.x as usize] = false;
    empty_y[g.y as usize] = false;
  }

  Map {
    galaxies,
    empty_x,
    empty_y,
  }
}

fn sum_of_shortest_paths(age:i64) -> i64 {
  let data = load_data();
  let mut sum:i64 = 0;
  for i in 0..data.galaxies.len() - 1 {
    let g0 = data.galaxies[i];
    for j in (i+1)..data.galaxies.len() {
      let g1 = data.galaxies[j];
      let ex = count_empty(&data.empty_x, g0.x as usize, g1.x as usize);
      let ey = count_empty(&data.empty_y, g0.y as usize, g1.y as usize);
      sum += ((g1.x - g0.x).abs() + (g1.y - g0.y).abs()) as i64 + (ex + ey) * (age - 1);
    }
  }
  sum
}

#[allow(dead_code)]
pub fn run() {
  println!("puzzle 1: {}", sum_of_shortest_paths(2));       // 9565386
  println!("puzzle 2: {}", sum_of_shortest_paths(1000000)); // 857986849428
}