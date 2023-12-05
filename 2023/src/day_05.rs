use std::cmp;
use std::collections::{HashMap, HashSet};

const INPUT: &str = r"day_05/input_test.txt";
// const INPUT: &str = r"day_05/input.txt";
#[derive(Debug)]
struct Puzzle {
  seeds:Vec<i64>,
  maps:HashMap<String, Mapping>,
}

impl Puzzle {
  pub(crate) fn transpose(&self, seed_range: &Vec<SeedRange>) {
    todo!()
  }
}

impl Puzzle {
  pub(crate) fn resolve(&self, seed: i64) -> i64 {
    let mut typ = "seed";
    let mut val = seed;
    while let Some(mapping) = self.maps.get(typ) {
      typ = mapping.dst.as_str();
      val = mapping.map(val);
    }
    val
  }
}

#[derive(Debug)]
struct Range {
  a0: i64,
  a1: i64,
  d: i64,
}

#[derive(Debug)]
struct Mapping {
  src:String,
  dst:String,
  ranges:Vec<Range>,
}

impl Mapping {
  pub(crate) fn map(&self, val: i64) -> i64 {
    for r in self.ranges.iter() {
      if val >= r.a0 && val < r.a1 {
        return val + r.d
      }
    }
    val
  }
}


fn load_data() -> Puzzle {
  let content = std::fs::read_to_string(INPUT).expect("could not read file");
  let mut lines: Vec<_> = content.trim().lines().collect();
  lines.push("");
  let mut puz = Puzzle {
    seeds: vec![],
    maps: HashMap::new(),
  };
  puz.seeds = lines.remove(0).split_whitespace().map(|c| {
    c.parse().unwrap()
  }).collect();
  lines.remove(0);
  while lines.len() > 0 {
    let title = lines.remove(0);
    let (src, dst) = title.trim().split_once(' ').unwrap();
    let mut ranges = Vec::new();
    while let mp = lines.remove(0) {
      if mp.len() == 0 {
        break
      }
      let mut iter = mp.split_whitespace().map(|c| c.parse().unwrap());
      let to = iter.next().unwrap();
      let from = iter.next().unwrap();
      let len = iter.next().unwrap();
      ranges.push(Range {
        a0: from,
        a1: from + len,
        d: to - from,
      });
    }
    // sort ranges and insert identity mappings if needed
    ranges.sort_by(|a,b| a.a0.cmp(&b.a0));
    let mut i = 0;
    while (i < ranges.len() - 1) {
      let r0 = &ranges[i];
      let r1 = &ranges[i+1];
      if (r0.a1 != r1.a0) {
        // insert identity range
        println!("insert: {}, {}", r0.a1, r1.a0);
        ranges.insert(i + 1, Range {
          a0: r0.a1,
          a1: r1.a0,
          d: 0,
        });
        i += 2;
      } else {
        i += 1;
      }
    }
    puz.maps.insert(src.to_string(), Mapping {
      src: src.to_string(),
      dst: dst.to_string(),
      ranges
    });
  }
  puz
}

fn puzzle1() {
  let puz = load_data();
  let mut loc = i64::MAX;
  for seed in puz.seeds.iter() {
    loc = cmp::min(loc, puz.resolve(*seed));
  }
  println!("puzzle 1: {}", loc); // 35 // 825516882
  // println!("puz: {:?}", puz)
}


#[derive(Debug)]
struct SeedRange {
  a0: i64,
  a1: i64,
}
fn puzzle2() {
  let puz = load_data();
  let mut ranges:Vec<SeedRange> = vec![];
  for i in (0..puz.seeds.len()).step_by(2) {
    ranges.push(SeedRange {
      a0: puz.seeds[i],
      a1: puz.seeds[i] + puz.seeds[i + 1],
    });
  }
  puz.transpose(&ranges);
  println!("ranges: {:?}", ranges);
  // let mut puz = load_data();
  // println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}