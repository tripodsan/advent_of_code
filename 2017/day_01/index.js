
const fs = require('fs');
// 995
// 1130
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('').map((l) => parseInt(l, 10)));

function puzzle1(nums, c) {
  const len = nums.length;
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    const d = nums[i];
    if (d === nums[(i+c) % len]) {
      sum += d;
    }
  }
  return sum;
}

data.forEach((nums) => {
  console.log('puzzle 1: ', puzzle1(nums, 1))
})
data.forEach((nums) => {
  console.log('puzzle 2: ', puzzle1(nums, nums.length / 2))
})
