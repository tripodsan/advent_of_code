
function puzzle1(pa, pb) {
  /*
    The generators both work on the same principle. To create its next value,
    a generator will take the previous value it produced, multiply it by a factor
    (generator A uses 16807; generator B uses 48271), '
    and then keep the remainder of dividing that resulting product by 2147483647.
    That final remainder is the value it produces next.
   */
  function generator(fact, seed) {
    let prev = seed;
    return () => {
      prev = (prev * fact) % 2147483647;
      return prev;
    }
  }

  const ga = generator(16807, pa);
  const gb = generator(48271, pb);
  let match = 0;
  for (let i = 0; i < 40000000; i++) {
    const v0 = ga();
    const v1 = gb();
    if ((v0 & 0xffff) === (v1 & 0xffff)) {
      match++;
    }
  }
  return match;
}

function puzzle2(pa, pb) {
  /*
    The generators both work on the same principle. To create its next value,
    a generator will take the previous value it produced, multiply it by a factor
    (generator A uses 16807; generator B uses 48271), '
    and then keep the remainder of dividing that resulting product by 2147483647.
    That final remainder is the value it produces next.

    part 2:
    Generator A looks for values that are multiples of 4.
    Generator B looks for values that are multiples of 8.
   */
  function generator(fact, seed, mod) {
    let prev = seed;
    return () => {
      do {
        prev = (prev * fact) % 2147483647;
      } while (prev % mod)
      return prev;
    }
  }

  const ga = generator(16807, pa, 4);
  const gb = generator(48271, pb, 8);
  let match = 0;
  for (let i = 0; i < 5000000; i++) {
    const v0 = ga();
    const v1 = gb();
    if ((v0 & 0xffff) === (v1 & 0xffff)) {
      match++;
    }
  }
  return match;
}

// console.log('puzzle 1: ', puzzle1(65, 8921));
console.log('puzzle 1: ', puzzle1(618, 814));
// console.log('puzzle 2: ', puzzle2(65, 8921));
console.log('puzzle 2: ', puzzle2(618, 814));
