function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  let sx, sy;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    sx = x + Math.cos(a) * radius2;
    sy = y + Math.sin(a) * radius2;
    vertex(sx, sy);
    sx = x + Math.cos(a + halfAngle) * radius1;
    sy = y + Math.sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

export { star };
