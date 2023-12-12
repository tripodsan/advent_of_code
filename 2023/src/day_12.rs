use std::fs::File;
use std::io::{BufRead, BufReader};

const INPUT: &str = r"day_12/input_test.txt";
// const INPUT: &str = r"day_12/input.txt";

#[derive(Debug)]
struct Report {
  configs:Vec<Configuration>,
}
#[derive(Debug)]
struct Configuration {
  map:Vec<i32>,
  chk:Vec<i32>
}

fn num_arrangements(map:&Vec<i32>, chk:&Vec<i32>) -> i32 {
  return 0;
}

fn load_data() -> Report {
  let mut reader = BufReader::new(File::open(INPUT).expect("could not open file"));
  let mut line = String::new();
  let mut configs:Vec<Configuration> = vec![];
  loop {
    line.clear();
    if reader.read_line(&mut line).unwrap() == 0 {
      break;
    }
    if let Some((map_str, chk_str)) = line.trim().split_once(' ') {
      let chk:Vec<i32> = chk_str.split(',').map(|c| c.parse().unwrap()).collect();
      let mut map:Vec<i32> = vec![];
      let mut prev = 0;
      for c in map_str.trim().chars() {
        match c {
          '.' => {
            if prev != 0 {
              map.push(prev);
              prev = 0;
            }
          },
          '#' => {
            if prev < 0 {
              map.push(prev);
              prev = 0;
            }
            prev += 1
          },
          '?' => {
            if prev > 0 {
              map.push(prev);
              prev = 0;
            }
            prev -= 1
          }
          _ => { panic!("invalid input")}
        };
      }
      if prev > 0 {
        map.push(prev)
      }
      configs.push(Configuration { map, chk })
    }
  }
  Report {
    configs,
  }
}

fn puzzle1() -> i32 {
  let mut data = load_data();
  println!("{data:?}");
  data.configs.iter().fold(0, |acc, cfg| acc + num_arrangements(&cfg.map, &cfg.chk))
}

fn puzzle2() -> i32 {
  42
}

#[allow(dead_code)]
pub fn run() {
  println!("puzzle 1: {}", puzzle1());
  println!("puzzle 2: {}", puzzle2());
}