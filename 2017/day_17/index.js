
function puzzle1(step) {
  const buffer = [0];
  let pos = 0;
  let size = 1;
  while (size < 2018) {
    pos = (pos + step) % size + 1;
    buffer.splice(pos, 0, size);
    size++;
  }
  return buffer[(pos + 1) % size];
}

function puzzle2(step) {
  let pos = 0;
  let size = 1;
  let value = 0;
  while (size < 50000000) {
    pos = (pos + step) % size + 1;
    if (pos === 1) {
      value = size;
    }
    size++;
  }
  return value;
}


console.log('puzzle 1: ', puzzle1(301)); // 1642
console.log('puzzle 2: ', puzzle2(301)); // 33601318
