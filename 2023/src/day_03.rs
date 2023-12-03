use std::collections::HashSet;
use glam::{UVec3};
use regex::Regex;

// const INPUT: &str = r"day_03/input_test.txt";
const INPUT: &str = r"day_03/input.txt";

#[derive(Debug)]
struct Part {
  x0: i32,
  x1: i32,
  y: i32,
  id: u32,
}

#[derive(Debug)]
struct Symbol {
  x: i32,
  y: i32,
  c: char,
}

#[derive(Debug)]
struct Engine {
  parts_by_y: Vec<Vec<usize>>,
  parts: Vec<Part>,
  symbols: Vec<Symbol>,
}

fn load_data() -> Engine {
  let content = std::fs::read_to_string(INPUT).expect("could not read file");
  let lines: Vec<_> = content.trim().lines().collect();
  let mut engine = Engine {
    parts_by_y: Vec::new(),
    parts: Vec::new(),
    symbols: Vec::new(),
  };
  for (y, line) in lines.iter().enumerate() {
    let mut x0:i32 = 0;
    let mut x1:i32 = 0;
    let mut id = 0;
    let mut parts_by_y = Vec::new();
    for (x, c) in line.chars().enumerate() {
      match c {
        '0'..='9' => {
          if id == 0 {
            x0 = x as i32;
          }
          x1 = x as i32;
          id = id * 10 + c.to_digit(10).unwrap();
        },
        '.' => {
          if id > 0 {
            parts_by_y.push(engine.parts.len());
            engine.parts.push(Part { x0, x1, y: y as i32, id });
            id = 0;
          }
        },
        _ => {
          engine.symbols.push(Symbol { x: x as i32, y: y as i32, c });
          if id > 0 {
            parts_by_y.push(engine.parts.len());
            engine.parts.push(Part { x0, x1, y: y as i32, id });
            id = 0;
          }
        }
      }
    }
    if id > 0 {
      parts_by_y.push(engine.parts.len());
      engine.parts.push(Part { x0, x1, y: y as i32, id });
      id = 0;
    }
    engine.parts_by_y.push(parts_by_y);
  }
  engine
}

const DIRECTIONS: [[i32; 2]; 8] = [
  [ -1, -1],
  [  0, -1],
  [  1, -1],
  [  1,  0],
  [  1,  1],
  [  0,  1],
  [ -1,  1],
  [ -1,  0],
];

fn puzzle1() {
  let engine = load_data();
  let mut adj = HashSet::new();
  for s in engine.symbols {
    for d in DIRECTIONS {
      let x = s.x + d[0];
      let y = s.y + d[1];
      if let Some(i) = engine.parts_by_y[y as usize].iter().find(|&&p| {
        engine.parts[p].x0 <= x && x <= engine.parts[p].x1
      }) {
        adj.insert(i);
      }
    }
  }
  // println!("{:?}", engine.parts);
  let sum = adj.iter().fold(0, |acc, &&i| acc + engine.parts[i].id);
  println!("puzzle 1: {}", sum);
}

fn puzzle2() {
  let engine = load_data();
  let mut sum = 0;
  for s in engine.symbols {
    if s.c == '*' {
      let mut adj = HashSet::new();
      for d in DIRECTIONS {
        let x = s.x + d[0];
        let y = s.y + d[1];
        if let Some(i) = engine.parts_by_y[y as usize].iter().find(|&&p| {
          engine.parts[p].x0 <= x && x <= engine.parts[p].x1
        }) {
          adj.insert(i);
        }
      }
      if adj.len() == 2 {
        sum += adj.iter().fold(1, |acc, &&i| acc * engine.parts[i].id);
      }
    }
  }
  println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}