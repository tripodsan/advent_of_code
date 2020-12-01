const fs = require('fs');
const data = fs.readFileSync('./input_womp.txt', 'utf-8')
  .split('\n');

/* Iterative Function to calculate
   (x^y)%p in O(log y) */
function power(x, y, p) {
  // Initialize result
  let res = BigInt(1);
  while (y > 0) {
    // If y is odd, multiply x
    // with result
    if (y%2n === 1n) {
      res = (res * x) % p;
      y--;
    }
    // y must be even now
    // y = y / 2
    y /= 2n;
    x = (x * x) % p;
  }
  return res;
}

function egcd(a, b) {
  if (a === 0n)
    return [b, 0n, 1n];
  else {
    const [g, y, x] = egcd(b % a, a);
    return [g, x - (b / a) * y, y];
  }
}

function modinv(a, m) {
  [g, x, y] = egcd(a, m);
  if (g !== 1n)
    throw new Error('modular inverse does not exist');
  else {
    return x % m;
  }
}


function getShuffle(N, rev) {
  let a = 1n;
  let b = 0n;
  const d = Array.from(data);
  if (rev) {
    d.reverse();
  }
  d.forEach((line) => {
    const ins = line.split(' ');
    if (ins[0] === 'cut') {
      const n = BigInt(+(ins.pop()));
      if (rev) {
        b = (b + n ) % N;
      } else {
        b = (N + b - n) % N;
      }
    } else if (ins[1] === 'into') {
      a = (N-a) % N;
      b = (N-b - 1n) % N;
    } else if (ins[1] === 'with') {
      const n = BigInt(+(ins.pop()));
      if (rev) {
        const m = (N+modinv(n, N))%N;
        a = (a*m)%N;
        b = (b*m)%N;
      } else {
        a = (a*n) % N;
        b = (b*n) % N;
      }
    }
  });
  return [a, b];
}

function puzzle1() {
  let pos = 2019n;
  let N = 10007n;
  const [a, b] = getShuffle(N);
  pos = (pos*a + b)%N;
  console.log('result 1: ', pos);

  const [aa, bb] = getShuffle(N, true);
  pos = (pos*aa + bb)%N;
  console.log('result 1: ', pos);
}

function puzzle2() {
  let pos = 2020n;
  const N = 119315717514047n;
  const n = 101741582076661n;

  let [aa, bb] = getShuffle(N, true);

  // a^n x + b(1-a^n)/(1-a)  => a^n x + b(1-a^n) * modInv(a-1, N) % N
  const a = power(aa, n, N);
  const b = bb*(a-1n)*modinv(aa-1n, N)%N;

  pos = (pos*a + b)%N;
  console.log('result 2: ', pos);
}

puzzle1(); // 4704
puzzle2();