use std::cmp;
use std::collections::HashSet;

// const INPUT: &str = r"day_04/input_test.txt";
const INPUT: &str = r"day_04/input.txt";
#[derive(Debug)]
struct Game {
  wins: u32,
  num: u32,
}

fn load_data() -> Vec<Game> {
  // Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
  let content = std::fs::read_to_string(INPUT).expect("could not read file");
  let lines: Vec<_> = content.trim().lines().collect();
  let mut games: Vec<Game> = Vec::new();
  for line in lines {
    if let Some((_, numbers)) = line.split_once(':') {
      if let Some((win, scr)) = numbers.trim().split_once('|') {
        let winning:HashSet<u32> = HashSet::from_iter(win.trim().split_whitespace().map(|str| str.parse().unwrap()));
        let scratched:HashSet<u32> = HashSet::from_iter(scr.trim().split_whitespace().map(|str| str.parse().unwrap()));
        let game = Game {
          wins: winning.intersection(&scratched).count() as u32,
          num: 1,
        };
        games.push(game);
      }
    }
  }
  games
}

fn puzzle1() {
  let games = load_data();
  let mut sum = 0;
  for game in games {
    if game.wins > 0 {
      sum += i32::pow(2, game.wins - 1);
    }
  }
  println!("puzzle 1: {}", sum);
}

fn puzzle2() {
  let mut games = load_data();
  let mut sum = 0;
  for x in 0..games.len() {
    let game = &games[x];
    let num = game.num;
    sum += num;
    for i in 0..cmp::min(game.wins as usize, games.len()) {
      games[x + i + 1].num += num;
    }
  }

  println!("puzzle 2: {}", sum);
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}