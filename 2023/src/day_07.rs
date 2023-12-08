// const INPUT: &str = r"day_07/input_test.txt";
const INPUT: &str = r"day_07/input.txt";
#[derive(Debug)]
struct Hand {
  // A, K, Q, J, T, 9, 8, 7, 6, 5, 4, 3, or 2 -> 12...0
  _hand:String,
  cards:[u8; 5],
  value:u8,
  bid:u64,
}

fn load_data(joker:bool) -> Vec<Hand> {
  let content = std::fs::read_to_string(INPUT).expect("could not read file");
  let lines: Vec<_> = content.trim().lines().collect();
  let mut hands: Vec<Hand> = vec![];
  for line in lines {
    if let Some((hand, bid)) = line.split_once(' ') {
      let mut jokers = 0;
      let cards:[u8; 5] = hand.chars().map(|c| {
        (match c {
          'A' => 14,
          'K' => 13,
          'Q' => 12,
          'J' => if joker { jokers += 1; 1 } else { 11 },
          'T' => 10,
          _ => c.to_digit(10).unwrap(),
        }) as u8
      }).collect::<Vec<u8>>().try_into().expect("wrong size");
      let mut count:[u8; 15] = [0; 15];
      for c in cards {
        count[c as usize] += 1
      }
      if jokers > 0 {
        // if there are jokers, add them to the biggest set
        count[1] = 0;
      }
      count.sort_by(|a, b| b.cmp(a));
      count[0] += jokers;
      let value = match count[0..5] {
        [5, 0, 0, 0, 0] => 6, // 5 of a kind
        [4, 1, 0, 0, 0] => 5, // 4 of a kind
        [3, 2, 0, 0, 0] => 4, // full house
        [3, 1, 1, 0, 0] => 3, // 3 of a kind
        [2, 2, 1, 0, 0] => 2, // 2 pair
        [2, 1, 1, 1, 0] => 1, // 1 pair
        _ => 0, // high card
      };
      hands.push(Hand {
        _hand: hand.to_string(),
        cards,
        value,
        bid: bid.parse().unwrap(),
      })
    }
  }
  // sort by hand value and card value
  hands.sort_by(|a, b| {
    let c = a.value.cmp(&b.value);
    if c.is_eq() {
      return a.cards.cmp(&b.cards);
    }
    return c;
  });
  hands
}

fn solve(joker:bool)->u64 {
  let hands = load_data(joker);
  hands.iter().enumerate().fold(0, |acc, (pos, hand)| {
    // println!("{} {:?}", pos, hand);
    acc + (pos + 1) as u64 * hand.bid
  })
}

fn puzzle1() {
  println!("puzzle 1: {}", solve(false));
}

fn puzzle2() {
  println!("puzzle 2: {}", solve(true));
}

#[allow(dead_code)]
pub fn run() {
  puzzle1();
  puzzle2();
}