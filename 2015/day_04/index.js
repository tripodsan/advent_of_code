import crypto from 'crypto';

// const ID = 'abcdef';
const ID = 'yzbqklnj';


function find(pat) {
  let i = 0;
  while (true) {
    const chk = crypto
      .createHash('md5')
      .update(ID + i, 'utf-8')
      .digest('hex');
    if (chk.startsWith(pat)) {
      return i;
    }
    i++;
  }
}
function puzzle1() {
  return find('00000');
}

function puzzle2() {
  return find('000000');
}

console.log('puzzle 1: ', puzzle1()); // 282749
console.log('puzzle 2: ', puzzle2());
