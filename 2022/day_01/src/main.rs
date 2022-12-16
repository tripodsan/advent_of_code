#![allow(unused)]

fn main() {
  let content = std::fs::read_to_string("input_test.txt").expect("could not read file");
  let mut lines:Vec<_> = content.lines().collect();
  let nums:Vec<i32> = lines.iter()
    .map(|line| line.parse().unwrap_or(-1))
    .collect::<Vec<i32>>();
  let mut sums:Vec<i32> = nums.split(|i| i < &0)
    .map(|iter| iter.iter().sum())
    .collect();
  sums.sort_by(|a, b| b.cmp(a));
  println!("puzzle 1: {}", sums[0]); // 69912
  sums.truncate(3);
  let s:i32 = sums.iter().sum();
  println!("puzzle 2: {}",  s); // 208180
}
