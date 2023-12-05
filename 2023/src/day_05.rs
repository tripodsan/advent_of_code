use std::cmp;
use std::collections::{HashMap};

// const INPUT: &str = r"day_05/input_test.txt";
const INPUT: &str = r"day_05/input.txt";
#[derive(Debug)]
struct Puzzle {
  seeds:Vec<i64>,
  maps:HashMap<String, Mapping>,
}

impl Puzzle {
  pub(crate) fn transpose(&self, seed_range: Vec<SeedRange>)->Vec<SeedRange> {
    let mut typ = "seed";
    let mut res:Vec<SeedRange> = seed_range;
    while let Some(mapping) = self.maps.get(typ) {
      typ = mapping.dst.as_str();
      res = mapping.transpose(res);
    }
    return res;
  }

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
#[derive(PartialEq)]
struct Range {
  a0: i64,
  a1: i64,
  d: i64,
}

#[derive(Debug)]
struct Mapping<> {
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

  fn find(&self, val: i64) -> Option<&Range> {
    for r in self.ranges.iter() {
      if val >= r.a0 && val < r.a1 {
        return Some(r);
      }
    }
    None
  }

  pub(crate) fn transpose(&self, seed_range: Vec<SeedRange>) -> Vec<SeedRange> {
    let mut res:Vec<SeedRange> = vec![];
    for r in seed_range {
      if let Some(r0) = self.find(r.a0) {
        if let Some(r1) = self.find(r.a1) {
          // if both are in the same range, just map both ends to the destination
          if r0 == r1 {
            res.push(SeedRange {
              a0: r.a0 + r0.d,
              a1: r.a1 + r1.d,
            });
          } else {
            // create lower half of new range
            res.push(SeedRange {
              a0: r.a0 + r0.d,
              a1: r0.a1 + r0.d,
            });
            // create upper half of new range
            res.push(SeedRange {
              a0: r1.a0 + r1.d,
              a1: r.a1 + r1.d,
            });
          }
        } else {
          // if the upper end is beyond the last range, just map the seed range
          res.push(SeedRange {
            a0: r.a0 + r0.d,
            a1: r.a1 + r0.d,
          });
        }
      } else {
        // not mapped range - reuse seed range
        res.push(r);
      }
    }
    return res;
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
    loop {
      let mp = lines.remove(0);
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
    while i < ranges.len() - 1 {
      let r0 = &ranges[i];
      let r1 = &ranges[i+1];
      if r0.a1 != r1.a0 {
        // insert identity range
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
#[derive(Copy, Clone)]
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
  ranges = puz.transpose(ranges);
  ranges.sort_by(|a, b| a.a0.cmp(&b.a0));
  println!("puzzle 2: {}", ranges[0].a0);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}