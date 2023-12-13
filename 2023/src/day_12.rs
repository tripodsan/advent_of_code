use std::collections::HashMap;
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
  map:String,
  chk:Vec<usize>
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
    if let Some((map, chk_str)) = line.trim().split_once(' ') {
      let chk:Vec<usize> = chk_str.split(',').map(|c| c.parse().unwrap()).collect();
      configs.push(Configuration { map: map.to_string(), chk })
    }
  }
  Report {
    configs,
  }
}

fn spans(map:&[char], pos:usize, len:usize) -> bool {
  // if any of the position is reserved by a `.`, it cannot span
  for i in 0..len {
    if (map[pos + i] == '.') {
      return false;
    }
  }
  // left and right edge must not be a '#'
  (pos == 0 || map[pos - 1] != '#') && (pos + len == map.len() || map[pos + len] != '#')
}

fn distribute(pot:&HashMap<usize,Vec<i32>>, hashes:&Vec<[usize;2]>, hashIdx:usize, last:i32, chk:&[usize], x:usize, total:usize, remain:usize, mut key:String, cache: &mut HashMap<String, u64>) -> u64 {
  let mut sum = 0;
  let num = chk[x];
  key += &*format!(",{}", x);
  let pkey:&str = format!("{last}{key}").as_str();
  if cache.contains_key(pkey) {
    return *cache.get(pkey).unwrap();
  }
  for p in pot[&num][0..] {
    if p > last {
      let end = p + num as i32;
      // remove any hashes that are covered
      let mut idx = hashIdx;
      while (idx < hashes.len()) {
        let hash = hashes[idx];
        if (hash[0] >= p as usize && hash[1] <= end as usize) {
          idx += 1;
        } else {
          break;
        }
      }
      // if there are hashes not covered yet, abort
      if (idx < hashes.len() && hashes[idx][1] <= end as usize) {
        continue;
      }
      // if there is not enough room to cover the remaining springs, abort
      if (p + remain as i32 > total as i32) {
        continue;
      }
      sum += if x < chk.len() - 1 {
        distribute(pot, hashes, idx, end, chk, x + 1, total, remain - num, key.to_string(), cache)
      } else if idx == hashes.len() {
        1
      } else {
        0
      }
    }
  }
  cache.insert(pkey.to_string(), sum);
  return sum;
}

fn solve(config:&Configuration) -> u64 {
  // const str = map.join('');
  // console.log(`    ${str}`, chk.join());
  // potential positions for groups of springs
  let mut pot:HashMap<usize,Vec<i32>> = HashMap::new();
  let mut numSprings = 0;
  let chk:&[usize] = &config.chk[0..];
  let map:&[char] = &config.map.chars().collect::<Vec<_>>()[0..];
  for num in chk {
    numSprings += num;
    if (!pot.contains_key(num)) {
      let mut p:Vec<i32> = vec![];
      pot.insert(*num, p);
      for x in 0..=(map.len() - num) {
        if spans(&map, x, *num) {
          p.push(x as i32);
          // console.log(chalk`${String(num).padStart(3)} ${str.substring(0, x)}{red ${'#'.repeat(num)}}${str.substring(x + num)}`);
        }
      }
    }
  }
  // collect the ranges of hashes
  let mut hashes:Vec<[usize;2]> = vec![];
  let mut start:i32 = -1;
  let mut end = 0;
  for x in 0..map.len() {
    if (map[x] == '#') {
      if (start < 0) {
        start = x as i32;
      }
      end = x;
    } else {
      if (start >= 0) {
        hashes.push([start as usize, end + 1]);
        start = -1;
      }
    }
  }
  if (start >= 0) {
    hashes.push([start as usize, end + 1]);
  }

  let mut cache:HashMap<String, u64> = HashMap::new();
  let num = distribute(&pot, &hashes, 0, -1, chk, 0, map.len(), numSprings, "".to_string(), &mut cache);
// console.log(str, chk.join(), num);
  return num;
}

fn puzzle1() -> u64 {
  let data = load_data();
  data.configs.iter().fold(0, |acc, cfg| acc + solve(cfg))
}

fn puzzle2() -> u64 {
  // let sum = 0;
  // for (const { map, chk } of
  // data) {
  //   sum += solve(
  //     map.concat('?', map, '?', map, '?', map, '?', map),
  //     chk.concat(chk, chk, chk, chk),
  //   );
  // }
  // return sum;
  0
}


#[allow(dead_code)]
pub fn run() {
  println!("puzzle 1: {}", puzzle1());
  println!("puzzle 2: {}", puzzle2());
}