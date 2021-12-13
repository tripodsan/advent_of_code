require('../../utils.js');

const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((c, idx) => c.split(/,/).map((d) => parseInt(d, 10)));


function solve(np, nm) {
  const scores = new Array(np).fill(0);
  let cp = 0;
  let current = {
    v: 0,
  };
  current.next = current;
  current.prev = current;

  for (let marble = 1; marble <= nm; marble++) {
    if (marble % 23 === 0) {
      /*
        However, if the marble that is about to be placed has a number which is a multiple of 23,
        something entirely different happens. First, the current player keeps the marble they would have placed,
        adding it to their score.

        In addition, the marble 7 marbles counter-clockwise from the current marble is removed
        from the circle and also added to the current player's score.
        The marble located immediately clockwise of the marble that was removed becomes the new current marble.
       */

      scores[cp] += marble;
      for (let i = 0; i < 7; i++) {
        current = current.prev;
      }
      scores[cp] += current.v;
      current.prev.next = current.next;
      current.next.prev = current.prev;
      current = current.next;
    } else {
      /*
        each Elf takes a turn placing the lowest-numbered remaining marble into the circle between the
        marbles that are 1 and 2 marbles clockwise of the current marble. (When the circle is large enough,
        this means that there is one marble between the marble that was just placed and the current marble.)
        The marble that was just placed then becomes the current marble.
      */
      const prev = current.next;
      const next = current.next.next;
      const x = {
        v: marble,
        next,
        prev,
      };
      next.prev = x;
      prev.next = x;
      current = x;
    }
    cp = (cp + 1) % np;
  }
  return scores.max();
}

for (const [np, nm, score] of data) {
  console.log('puzzle 1:', solve(np, nm), score);
  // break;
}

console.log('puzzle 2:', solve(464, 70918 * 100));


