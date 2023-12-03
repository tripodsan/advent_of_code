use std::collections::HashSet;
use glam::{UVec3};
use regex::Regex;

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
  let content = std::fs::read_to_string("day_03/input_test.txt").expect("could not read file");
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
      println!("{} {} {}", s.c, x, y);
      if let Some(i) = engine.parts_by_y[y as usize].iter().find(|p| {
        println!("{:?}", engine.parts[**p]);
        engine.parts[**p].x0 >= x && x <= engine.parts[**p].x1
      }) {
        println!("insert {:?}", i);
        adj.insert(i);
      }
    }
  }
  println!("{:?}", engine.parts);
  let sum = adj.iter().fold(0, |acc, i| acc + engine.parts[**i].id);
  println!("puzzle 1: {:?} {}", adj, sum);
}

fn puzzle2() {
  let sum = 1;
  println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}