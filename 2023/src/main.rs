use regex::Regex;

fn puzzle1() {
    let re = Regex::new(r"(\d)").unwrap();
    let content = std::fs::read_to_string("day_01/input.txt").expect("could not read file");
    let lines:Vec<_> = content.trim().lines().collect();
    let mut sum:u32 = 0;
    for line in lines {
        let mut digits:Vec<u32> = Vec::new();
        for (_, [digit]) in re.captures_iter(line).map(|c| c.extract()) {
            let value:u32 = digit.parse::<u32>().unwrap();
            digits.push(value);
        }
        let first_digit = digits.first().unwrap();
        let last_digit = digits.last().unwrap();
        sum += *first_digit * 10 + *last_digit;
    }
    println!("puzzle 1: {}", sum);
}

fn to_digit(digit:&str) -> u32 {
    match digit {
        "one" => 1,
        "two" => 2,
        "three" => 3,
        "four" => 4,
        "five" => 5,
        "six" => 6,
        "seven" => 7,
        "eight" => 8,
        "nine" => 9,
        _ => digit.parse::<u32>().unwrap(),
    }
}

fn reverse(s: &str) -> String {
    s.chars().rev().collect()
}
fn puzzle2() {
    let re1 = Regex::new(r"(\d|one|two|three|four|five|six|seven|eight|nine)").unwrap();
    let re2 = Regex::new(r"(\d|eno|owt|eerht|ruof|evif|xis|neves|thgie|enin)").unwrap();
    let content = std::fs::read_to_string("day_01/input.txt").expect("could not read file");
    let lines:Vec<_> = content.trim().lines().collect();
    let mut sum:u32 = 0;
    for line in lines {
        let first = re1.find(line).unwrap().as_str();
        let reversed = reverse(line);
        let last = reverse(re2.find(reversed.as_str()).unwrap().as_str());
        let first_digit = to_digit(first);
        let last_digit = to_digit(last.as_str());
        sum += first_digit * 10 + last_digit;
    }
    println!("puzzle 2: {}", sum);
}

fn main() {
    puzzle1();
    puzzle2();
}