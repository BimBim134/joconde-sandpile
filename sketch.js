let grid = [];
let next_grid;
let fast_mode = false;

let img;

let c0, c1, c2, c3, c4;

let radius;
let r1, r2;

let slider;
let threshold = 200;

function preload() {
  img = loadImage('joconde.jpeg');
}

function setup() {
  createCanvas(img.width, img.height);
  imageMode(CENTER);
  image(img, width / 2, height / 2);

  slider = createSlider(0, 255, threshold, 1);
  slider.position(20, 120);
  slider.style('width', '120px');

  // color
  c0 = color(55, 90, 125);
  c1 = color(110, 90, 125);
  c2 = color(190, 110, 130);
  c3 = color(245, 115, 130);
  c4 = color(250, 175, 150);

  for (let x = 0; x < width; x++) {
    grid[x] = [];
    for (let y = 0; y < height; y++) {
      grid[x][y] = 0;
    }
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (pixels[4 * (x + y * width)] < threshold / 4) {
        grid[x][y] = 0;
      } else if (pixels[4 * (x + y * width)] >= threshold / 4 & pixels[4 * (x + y * width)] < threshold / 2) {
        grid[x][y] = 1;
      } else if (pixels[4 * (x + y * width)] >= threshold / 2 & pixels[4 * (x + y * width)] < 3 * threshold / 4) {
        grid[x][y] = 2;
      } else if (pixels[4 * (x + y * width)] >= 3 * threshold / 4 & pixels[4 * (x + y * width)] < threshold) {
        grid[x][y] = 3;
      } else {
        grid[x][y] = 4;
      }
    }
  }
  showGrid();

  next_grid = grid.slice();
  //frameRate(0.5);
}

function draw() {
  background(c0);

  if (fast_mode) {
    for (let it = 0; it < 50; it++) {
      update_grid();
    }
  } else {
    update_grid();
  }

  showGrid();
  rectMode(CORNER);
  noStroke();
  fill(0,64);
  rect(0,0,250,150);

  noStroke();
  fill(255);
  textAlign(LEFT);
  text("press 'f' for fast mode, 'r' to restart", 20, 20);
  text(" : 0\n : 1\n : 2\n : 3\n : >3", 33, 35);
  rectMode(CENTER);
  stroke(255);
  fill(c0);
  rect(25, 32 * 1, 10, 10);
  fill(c1);
  rect(25, 47, 10, 10);
  fill(c2);
  rect(25, 61, 10, 10);
  fill(c3);
  rect(25, 76, 10, 10);
  fill(c4);
  rect(25, 91, 10, 10);

  threshold = slider.value();
  noStroke();
  fill(255);
  text('threshold value : ' + threshold,20,115);

  if (fast_mode) {
    textAlign(CENTER);
    noStroke();
    fill(255);
    text("fast mode", width / 2, height - 20);
  }
}

function keyPressed() {
  if (key == 'f') {
    fast_mode = !fast_mode;
    return false;
  } else if (key == 'r') {
    restart(threshold);
    return false;
  }
}

function restart(threshold) {
  background(0);
  image(img, width / 2, height / 2);
  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (pixels[4 * (x + y * width)] < threshold / 4) {
        grid[x][y] = 0;
      } else if (pixels[4 * (x + y * width)] >= threshold / 4 & pixels[4 * (x + y * width)] < threshold / 2) {
        grid[x][y] = 1;
      } else if (pixels[4 * (x + y * width)] >= threshold / 2 & pixels[4 * (x + y * width)] < 3 * threshold / 4) {
        grid[x][y] = 2;
      } else if (pixels[4 * (x + y * width)] >= 3 * threshold / 4 & pixels[4 * (x + y * width)] < threshold) {
        grid[x][y] = 3;
      } else {
        grid[x][y] = 4;
      }
    }
  }
}


function update_grid() {
  next_grid = grid.slice();
  for (let x = 1; x < width - 2; x++) {
    for (let y = 1; y < height - 2; y++) {
      if (grid[x][y] > 3) {
        change = true;
        next_grid[x][y] -= 4;
        next_grid[x + 1][y + 1] += 1;
        next_grid[x - 1][y - 1] += 1;
        next_grid[x - 1][y + 1] += 1;
        next_grid[x + 1][y - 1] += 1;
      }
    }
  }
  grid = next_grid.slice();
}

function showGrid() {
  loadPixels();
  for (let x = 1; x < width - 2; x++) {
    for (let y = 1; y < height - 2; y++) {

      let c;
      switch (grid[x][y]) {
        case 0:
          c = c0;
          break;
        case 1:
          c = c1;
          break;
        case 2:
          c = c2;
          break;
        case 3:
          c = c3;
          break;
        case 4:
          c = c4;
      }
      set(x, y, c);
    }

  }
  updatePixels();
}