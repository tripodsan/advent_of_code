use std::collections::HashMap;

const INPUT: &str = r"day_08/input_test.txt";
// const INPUT: &str = r"day_08/input.txt";
#[derive(Debug)]
struct Map<'a> {
  dirs:Vec<u8>,
  nodes:HashMap<&'a str, [&'a str; 2]>,
}

impl<'a> Map<'a> {
  pub fn new() -> Self {
    Map {
      dirs: vec![],
      nodes: HashMap::new(),
    }
  }
  pub fn load_data(&mut self) {
    let content:String = std::fs::read_to_string(INPUT).expect("could not read file");
    let mut lines: Vec<_> = content.trim().lines().collect();
    // let dirs ;
    // let id:u16 = 2;
    // let mut lookup:HashMap<&str, u16> = HashMap::new();
    // lookup.insert("AAA", 0);
    // lookup.insert("ZZZ", 1);
    self.dirs = lines.remove(0).chars().map(|c| if c == 'L' { 0 } else { 1 }).collect();
    lines.remove(0);
    // let mut nodes:HashMap<u16, [u16; 2]> = HashMap::new();
    for line in lines {
      // AAA = (BBB, BBB)
      let v = line.split(&[' ', '=', ',', '(', ')']).filter(|&c| c != "").take(3).collect::<Vec<&str>>();
      if let [key, left, right] = &v[..] {
        self.nodes.insert(key, [left, right]);
      }
    }
  }
}

fn puzzle1() {
  let map = Map::new().load_data();
  println!("{map:?}")
  // println!("puzzle 1: {}", solve(false));
}

fn puzzle2() {
  // println!("puzzle 2: {}", solve(true));
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}