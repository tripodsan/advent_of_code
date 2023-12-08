use std::collections::HashMap;
use std::fs::File;
use std::io::{BufRead, BufReader, Error};
use regex::Regex;
use num::integer::lcm;

// const INPUT: &str = r"day_08/input_test2.txt";
const INPUT: &str = r"day_08/input.txt";
#[derive(Debug)]
struct Map {
  dirs:Vec<u8>,
  nodes:HashMap<String, [String; 2]>,
}

impl Map {
  pub fn get_path_length(&self, start: &str, end: &str) -> (u64, String) {
    let mut i = 0;
    let num = self.dirs.len();
    let mut pos = start;
    while !pos.ends_with(end) {
      pos = self.nodes.get(pos).expect("invalid pos")[self.dirs[i % num] as usize].as_str();
      i += 1;
    }
    (i as u64, pos.to_string())
  }
}

fn load_data() -> Result<Map, Error> {
  let mut reader = BufReader::new(File::open(INPUT).expect("could not open file"));
  let mut line = String::new();
  reader.read_line(&mut line)?;
  let mut map = Map {
    dirs: line.trim().chars().map(|c| if c == 'L' { 0 } else { 1 }).collect(),
    nodes: HashMap::new(),
  };
  reader.read_line(&mut line)?; // skip

  // AAA = (BBB, BBB)
  let r = Regex::new(r"(\w+) = \((\w+), (\w+)\)\s*").unwrap();
  loop {
    line.clear();
    if reader.read_line(&mut line)? == 0 {
      break;
    }
    r.captures_iter(line.as_str()).for_each(|cap| {
      map.nodes.insert(cap[1].to_string(), [cap[2].to_string(), cap[3].to_string()]);
    });
  }
  Ok(map)
}

fn puzzle1() -> Result<(), Error> {
  let map = load_data()?;
  println!("puzzle 1: {}", map.get_path_length(&"AAA", &"ZZZ").0);
  Ok(())
}

fn puzzle2() -> Result<(), Error> {
  let map = load_data()?;
  let mut kgv:u64 = 1;
  for key in map.nodes.keys() {
    if key.ends_with('A') {
      let (len, _last) = map.get_path_length(key, "Z");
      // println!("{} -> {}: {}", key, last, len);
      kgv = lcm(kgv , len)
    }
  }
  println!("puzzle 2: {}", kgv);
  Ok(())
}

#[allow(dead_code)]
pub fn run() {
  puzzle1().ok(); // 18673
  puzzle2().ok(); // 17972669116327
}