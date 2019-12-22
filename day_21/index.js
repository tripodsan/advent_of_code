
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));

class Program {
  constructor(code, input = []) {
    this.code = code;
    this.input = input;
    this.pc = 0;
    this.isRunning = true;
    this.isWaiting = false;
    this.output = [];
    this.relBase = 0;
  }

  run() {
    if (this.isWaiting && this.input.length > 0) {
      this.isWaiting = false;
    }
    while (this.isRunning && !this.isWaiting) {
      this.step();
    }
    return this.output;
  }

  step() {
    const { code } = this;
    const opc = code[this.pc];
    const m = [
      Math.floor(opc / 100) % 10,
      Math.floor(opc / 1000) % 10,
      Math.floor(opc / 10000) % 10
    ];

    const lda = (a) => {
      const p = code[this.pc + 1 + a];
      switch (m[a]) {
        case 0: return code[p] || 0;
        case 1: return p;
        case 2: return code[p + this.relBase] || 0;
      }
      throw Error('illegal parameter mode: ' + m[a]);
    };

    const sta = (a, v) => {
      const p = code[this.pc + 1 + a];
      switch (m[a]) {
        case 0: code[p] = v; return;
        case 1: break;
        case 2: code[p + this.relBase] = v; return;
      }
      throw Error('illegal parameter mode: ' + m[a]);
    };

    const ops = {
      // c = a + b
      '1': () => {
        sta(2, lda(0) + lda(1));
        this.pc += 4;
      },
      // c = a * b
      '2': () => {
        sta(2, lda(0) * lda(1));
        this.pc += 4;
      },
      // a = input
      '3': () => {
        if (this.input.length === 0) {
          this.isWaiting = true;
          return;
        }
        sta(0, this.input.shift());
        this.isWaiting = false;
        this.pc += 2;
      },
      // output = a;
      '4': () => {
        this.output.push(lda(0));
        this.pc += 2;
      },
      // if (a) jmp b
      '5': () => {
        if (lda(0)) {
          this.pc = lda(1) - 3;
        }
        this.pc += 3;
      },
      // if (!a) jmp b
      '6': () => {
        if (!lda(0)) {
          this.pc = lda(1) - 3;
        }
        this.pc += 3;
      },
      // c = a < b
      '7': () => {
        sta(2, lda(0) < lda(1) ? 1 : 0);
        this.pc += 4;
      },
      // c = a == b
      '8': () => {
        sta(2, lda(0) === lda(1) ? 1 : 0);
        this.pc += 4;
      },
      // relBase += a
      '9': () => {
        this.relBase += lda(0);
        this.pc += 2;
      },
      // terminate
      '99': () => {
        this.isRunning = false;
      }
    };
    const fn = ops[opc % 100];
    if (!fn) {
      throw Error('illegal opcode: ' + opc);
    }
    fn();
  }
}

function toAscii(s) {
  return s.split('').map((x) => x.charCodeAt(0));
}
/*
  ABCD
  #### -> walk
  ###_ -> walk
  ##_# -> jump
  ##__ -> walk
  #_## -> jump
  #_#_ -> walk
  #__# -> jump
  #___ -> walk
  _### -> jump
  _##_ -> die
  _#_# -> jump
  _#__ -> die
  __## -> jump
  __#_ -> die
  ___# -> jump
  ____ -> die

  !A || !B & C & D || !B & !C & D || B & !C & D

  !A || !B && D || !C && D
 */
function puzzle1() {

  const p = new Program(Array.from(data), []);
  while (p.isRunning) {
    p.input = toAscii([
      'NOT B J',
      'AND D J',
      'NOT C T',
      'AND D T',
      'OR T J',
      'NOT A T',
      'OR T J',
      'WALK'
    ].join('\n') + '\n');
    p.run();
  }
  process.stdout.write(String.fromCharCode(...p.output));

  console.log('\nResult 1:', p.output.pop());
}

/*

ABCDEFGHI

@

 #########
  !A || !B & C & D || !B & !C & D || B & !C & D

  !A || !B && D || !C && D
 */
const FLAGS = 'ABCDEFGIH';
const tt = [];
let prev = '';
for (let g = 0; g < 512; g++) {
  const ground = [];
  const flags = [];
  for (let i = 8; i>=0;i--) {
    if (Math.pow(2,i) & g) {
      ground.push('#');
      flags.push(` ${FLAGS.charAt(8-i)}`);
    } else {
      ground.push('.');
      flags.push(`!${FLAGS.charAt(8-i)}`);
    }
  }
  let walk= false;
  let jump = false;
  for (let w = 0; w < 512; w++) {
    let p = -1;
    let ins = '';
    for (let i = 8; i>=0;i--) {
      if (Math.pow(2,i) & w) {
        p++;
        ins += 'w';
      } else {
        p+=4;
        ins += 'j';
      }
      if (p>8) {
        if (ins[0] === 'w') {
          walk = true;
        } else {
          jump = true;
        }
        break;
      } else if (ground[p] === '.') {
        break;
      }
    }
  }
  console.log(ground.join(''), walk, jump);
  if (jump && ground[0] === '#') {
    flags.shift();
    flags.splice(2, 1);
    flags.pop();
    flags.pop();
    flags.pop();
    const line = flags.join(' & ');
    if (line !== prev) {
      tt.push(line);
      prev = line;
    }
  }
}
console.log(tt.join('\n'));

// !A || D && (  (E & !F & !I & H') && (E || I  )

// @
// ####..#.#
// !E & !F & !H & I

/*
!B & !C &  E & !F & !G & !I
!B & !C &  E & !F &  G & !I
!B & !C &  E &  F & !G & !I
!B & !C &  E &  F &  G & !I
!B &  C &  E & !F & !G & !I
!B &  C &  E & !F &  G & !I
!B &  C &  E &  F & !G & !I
!B &  C &  E &  F &  G & !I
 B & !C &  E & !F & !G & !I
 B & !C &  E & !F &  G & !I
 B & !C &  E &  F & !G & !I
 B & !C &  E &  F &  G & !I
 B &  C &  E & !F & !G & !I
 B &  C &  E & !F &  G & !I
 B &  C &  E &  F & !G & !I
 B &  C &  E &  F &  G & !I

  (!E & I) || E


(b * ! c * ! e) + (! b * e * f) + (! b * e * h) + (! b * i)
 @
  ___##__#_
  ABCDEFGHI

  D*(E + H) + !A!B!C
 */
function puzzle2() {
  const p = new Program(Array.from(data), []);
  while (p.isRunning) {
    p.input = toAscii([
      'OR A J',
      'AND B J',
      'AND C J',
      'NOT J J',
      'AND D J',
      'OR E T',
      'OR H T',
      'AND T J',
      'RUN'
    ].join('\n') + '\n');
    p.run();
  }
  process.stdout.write(String.fromCharCode(...p.output));

  console.log('\nResult 2:', p.output.pop());
}

puzzle1();
puzzle2();

