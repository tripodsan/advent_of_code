function shoot(vx, vy, x0, y0, x1, y1) {
  let x = 0;
  let y = 0;
  let maxY = 0;
  while (y >= y1) {
    maxY = Math.max(maxY , y);
    if (x >= x0 && x <= x1 && y <= y0 && y >= y1) {
      return maxY;
    }
    x += vx;
    y += vy;
    vx -= Math.sign(vx);
    vy -= 1;
  }
  return -1;
}

function solve(x0, y0, x1, y1) {
  let maxY = 0;
  let num = 0;
  for (let vx = 0; vx <= x1; vx++) {
    for (let vy = y1; vy <= -y1; vy++) {
      let y = shoot(vx, vy, x0, y0, x1, y1);
      // console.log(vx, vy, y);
      if (y >= 0) {
        maxY = Math.max(maxY , y);
        num++;
      }
    }
  }
  console.log(' highest y:', maxY);
  console.log('num shoots:', num);
}


// target area: x=20..30, y=-10..-5
// solve(20, -5, 30, -10);  // 45 - 112

// target area: x=155..182, y=-117..-67
//  highest y: 6786
// num shoots: 2313
solve(155, -67, 182, -117);
