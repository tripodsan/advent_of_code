
const fs = require('fs');
// const { kgv } = require('../../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('=').map((f) => f.trim()));

// console.log(data);

function puzzle2() {
  let mask = [];
  const mem = { };
  let floats = [];
  for (let [opc, arg] of data) {
    if (opc === 'mask') {
      mask = arg.split('');
      floats = [];
      mask.forEach((d, idx) => {
        if (d === 'X') {
          floats.push(idx);
        }
      })
      // console.log('mask', mask.join(''));
    } else {
      const adr = Number.parseInt(opc.substring(4, opc.length-1));
      const val = Number.parseInt(arg);
      // apply mask
      const badr = adr.toString(2).padStart(36, '0').split('');
      const nadr = mask.map((c, idx) => c === '0' ? badr[idx] : c);
      // console.log(badr.join(''));
      // console.log(mask.join(''));
      // console.log(nadr.join(''));
      for (let i = 0; i < 2**floats.length; i++) {
        const dst = [...nadr];
        for (let n = 0; n < floats.length; n++) {
          dst[floats[n]] = i & 2**n ? '1' :'0';
        }
        const na = dst.join('');
        // console.log(na);
        mem[`${na}`] = val;
      }
    }//3260587250457
  }
  return Object.values(mem).reduce((p, v) => p + v, 0);
}

function puzzle1() {
  let maskAnd = 0;
  let maskOr = 0;
  const mem = [];
  for (let [opc, arg] of data) {
    if (opc === 'mask') {
      maskAnd = BigInt(`0b${arg.replace(/X/g, '1')}`);
      maskOr = BigInt(`0b${arg.replace(/X/g, '0')}`);
      // console.log('and', maskAnd.toString(2));
      // console.log(' or', maskOr.toString(2));
    } else {
      const adr = Number.parseInt(opc.substring(4, opc.length-1));
      const val = BigInt(arg);
      mem[adr] = (val & maskAnd) | maskOr;
      // console.log(adr, val, mem[adr]);
    }
  }
  return mem.reduce((p, v) => p + v, 0n);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
