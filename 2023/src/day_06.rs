/*
Time:      7  15   30
Distance:  9  40  200
*/
// const INPUT: [(f64, f64); 3] = [(7.0, 9.0), (15.0, 40.0), (30.0, 200.0)];

/*
  Time:        42     89     91     89
  Distance:   308   1170   1291   1467
 */
const INPUT: [(f64, f64); 4] = [(42.0, 308.0), (89.0, 1170.0), (91.0, 1291.0), (89.0, 1467.0)];

/*
  x: charge time
  t: total time
  d: distance

  x * (t - x) > d
  t*x - x^2 > d
  x^2 - t*x  + d < 0

  x = t +- sqrt(t^2 - 4d) / 2
 */

fn ways(t:f64, d:f64) -> u64 {
  let s = (t*t - 4.0*d).sqrt();
  let x0 = ((t + s) / 2.0).ceil() as u64 - 1;
  let x1 = ((t - s) / 2.0) as u64 + 1;
  // println!("t:{}, d:{}. x0:{}, x1:{}", t, d, x0, x1);
  x0 - x1 + 1
}

fn puzzle1() {
  let score:u64 = INPUT.iter().fold(1, |acc, &(t, d)| acc * ways(t, d));
  println!("puzzle 1: {}", score); // 3317888
}

fn puzzle2() {
  // let t:f64 = 71530.0;
  // let d:f64 = 940200.0;
  let t:f64 =  42899189.0;
  let d:f64 = 308117012911467.0;
  println!("puzzle 2: {}", ways(t, d));
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}