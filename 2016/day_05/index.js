import crypto from 'crypto';

// const ID = 'abc';
const ID = 'ffykfhsq';
function puzzle1() {
  let i = 0;
  const pwd = [];
  while (pwd.length < 8) {
    const chk = crypto
      .createHash('md5')
      .update(ID, 'utf-8')
      .update(String(i++), 'utf-8')
      .digest()
      .toString('hex')
    if (chk.startsWith('00000')) {
      console.log(chk, pwd.join(''));
      pwd.push(chk.substring(5, 6));
    }
  }
  return pwd.join('');
}

function puzzle2() {
  let i = 0;
  const pwd = Array(8).fill('_');
  let found = 0;
  while (found < 8) {
    const chk = crypto
      .createHash('md5')
      .update(ID, 'utf-8')
      .update(String(i++), 'utf-8')
      .digest()
      .toString('hex')
    if (chk.startsWith('00000')) {
      const pos = parseInt(chk.substring(5, 6), 16);
      if (pos >= 0 && pos < 8 && pwd[pos] === '_') {
        pwd[pos] = chk.substring(6, 7);
        console.log(chk, ' ok', pwd.join(''));
        found++;
      } else {
        console.log(chk, 'err', pos);
      }
    }
  }
  return pwd.join('');
}

// console.log('puzzle 1: ', puzzle1()); // c6697b55
console.log('puzzle 2: ', puzzle2());
