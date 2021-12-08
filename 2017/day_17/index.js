
function puzzle1(step) {
  const buffer = [0];
  let pos = 0;
  let size = 1;
  while (size < 2018) {
    pos = (pos + step) % size;
    size++;
    pos = (pos + 1) % size;
    buffer.splice(pos, 0, size - 1);
  }
  return buffer[(pos + 1) % size];
}

function puzzle2(step) {
  let pos = 0;
  let size = 1;
  let after = 1;
  let value = 0;
  while (size < 50000000) {
    pos = (pos + step) % size;
    size++;
    pos = (pos + 1) % size;
    if (pos === after) {
      value = size - 1;
    }
    if (pos < after) {
      after++;
    }
    // console.log(pos, after, value);
  }
  return value;
}


console.log('puzzle 1: ', puzzle1(301));
console.log('puzzle 2: ', puzzle2(301));
