use std::fs::File;
use std::io::{BufRead, BufReader};

// const INPUT: &str = r"day_09/input_test.txt";
const INPUT: &str = r"day_09/input.txt";

fn load_data() -> Vec<Vec<i64>> {
  let mut reader = BufReader::new(File::open(INPUT).expect("could not open file"));
  let mut line = String::new();
  let mut data:Vec<Vec<i64>> = vec![];
  loop {
    line.clear();
    if reader.read_line(&mut line).unwrap() == 0 {
      break;
    }
    data.push(line.trim().split_whitespace().map(|c| c.parse().unwrap()).collect());
  }
  data
}

fn extrapolate(seq: &Vec<i64>, rev:bool) -> i64 {
  let mut der:Vec<i64> = vec![];
  let mut last:i64 = 0;
  let mut zero:bool = true;
  for i in 0..seq.len() - 1 {
    last = seq[i + 1];
    let diff = last - seq[i];
    if diff != 0 {
      zero = false
    }
    der.push(diff);
  }
  if zero {
    return if rev {seq[0] } else { last };
  }
  let next = extrapolate(&der, rev);
  if rev {
    seq[0] - next
  } else {
    last + next
  }
}

fn puzzle1() {
  let data = load_data();
  let sum:i64 = data.iter().fold(0, |acc, seq| acc + extrapolate(seq, false));
  println!("puzzle 1: {}", sum);
}

fn puzzle2() {
  let data = load_data();
  let sum:i64 = data.iter().fold(0, |acc, seq| acc + extrapolate(seq, true));
  println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}