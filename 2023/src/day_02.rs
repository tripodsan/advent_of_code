use glam::{UVec3};
use regex::Regex;

#[derive(Debug)]
struct Game {
  id: u32,
  samples: Vec<UVec3>,
}

fn load_data() -> Vec<Game> {
  // Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
  let re1 = Regex::new(r"Game (\d+):(.+)").unwrap();
  let content = std::fs::read_to_string("day_02/input.txt").expect("could not read file");
  let lines: Vec<_> = content.trim().lines().collect();
  let mut games: Vec<Game> = Vec::new();
  for line in lines {
    let caps = re1.captures(line).unwrap();
    let id: u32 = caps.get(1).map_or(0, |m| m.as_str().parse().unwrap());
    let right = caps.get(2).map_or("", |m| m.as_str());
    let game = Game {
      id,
      samples: right.trim().split(';').map(|samp| {
        let mut sample = UVec3::new(0, 0, 0);
        for pt in samp.trim().split(',') {
          if let Some((num, color)) = pt.trim().split_once(' ') {
            let v = num.parse().unwrap();
            match color {
              "red" => sample.x = v,
              "green" => sample.y = v,
              "blue" => sample.z = v,
              _ => {}
            }
          }
        }
        sample
      }).collect(),
    };
    games.push(game);
  }
  games
}

fn puzzle1() {
  let games = load_data();
  let fix = UVec3::new(12, 13, 14);
  let sum = games.iter()
    .filter(|game| game.samples.iter()
      .all(|pt| pt.x <= fix.x && pt.y <= fix.y && pt.z <= fix.z))
    .fold(0, |acc, game| game.id + acc);
  println!("puzzle 1: {}", sum);
}

fn puzzle2() {
  let games = load_data();
  let sum = games.iter().fold(0, |acc, game| {
    let max = game.samples.iter().fold(UVec3::ZERO, |acc: UVec3, sample| sample.max(acc));
    acc + max.x * max.y * max.z
  });
  println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}