let xSpacing = 16; // Distance between each horizontal location
let ySpacing; // Distance between each wave
let waveWidth; // Width of entire wave
let theta = 0; // Start angle at 0
let amplitude; // Height of wave
let frequency = 0.0033; // wave frequency
let dx; // Value for incrementing x
let sinValues; // Using an array to store height values for the wave
let padding; // Padding from top
let renderLines = false; // flag for rendering lines between poitns
let pointWidth = 8; // Width of the wave ellipses
let speed = 0.02; // Speed of wave scrolling
let dropThreshold;
let dropSpeed = 18; // Speed of saw and square points dropping
p5.disableFriendlyErrors = true; // Performance optimization
let currMils = 0;
let prevMils = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  dx = TWO_PI * frequency * xSpacing;
  initConstants();
  sinValues = new Array(floor(waveWidth / xSpacing));
  squareValues = new Array(floor(waveWidth / xSpacing));
  triangleValues = new Array(floor(waveWidth / xSpacing));
  sawValues = new Array(floor(waveWidth / xSpacing));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initConstants();
  sinValues = new Array(floor(waveWidth / xSpacing));
  squareValues = new Array(floor(waveWidth / xSpacing));
  triangleValues = new Array(floor(waveWidth / xSpacing));
  sawValues = new Array(floor(waveWidth / xSpacing));
}

function initConstants() {
  waveWidth = width + 16;
  ySpacing = windowHeight / 4;
  padding = windowHeight / 20;
  amplitude = windowHeight / 20;
  dropThreshold = 0.97 * PI;
}

function timerStart() {
  prevMils = millis();
}

function timerPrint(id) {
  currMils = millis() - prevMils;
  prevMils = currMils;
  print(currMils * 1000 + "- " + id + "\n");
}

function draw() {
  background("#2c3e50");
  calcSin(theta);
  calcSquare(theta);
  calcTriangle(theta);
  calcSaw(theta);
  renderWaves();
  theta += speed % TWO_PI;
}

function calcSin(thetaSin) {
  // For every x value, calculate a y value with sine function
  let x = thetaSin;
  for (let i = 0; i < sinValues.length; i++) {
    sinValues[i] = -(sin(x) * amplitude);
    x += dx;
  }
}

function calcSquare(thetaSquare) {
  let x = thetaSquare % TWO_PI;
  for (let i = 0; i < squareValues.length; i++) {
    if (x > dropThreshold && x < PI) {
      squareValues[i] += speed * dropSpeed * amplitude;
      squareValues[i] = Math.min(squareValues[i], amplitude);
    } else if (x > dropThreshold * 2 && x < TWO_PI) {
      squareValues[i] += -speed * dropSpeed * amplitude;
      squareValues[i] = Math.max(squareValues[i], -amplitude);
    } else if (x >= PI) {
      squareValues[i] = amplitude;
    } else {
      squareValues[i] = -amplitude;
    }
    x = (x + dx) % TWO_PI;
  }
}

function calcTriangle(thetaTriangle) {
  let x = thetaTriangle % TWO_PI;
  let slope = (2 * amplitude) / PI;
  for (let i = 0; i < triangleValues.length; i++) {
    if (x < HALF_PI) {
      triangleValues[i] = -(slope * x);
    } else if (x < PI) {
      triangleValues[i] = slope * x - 2 * amplitude;
    } else if (x < 3 * HALF_PI) {
      triangleValues[i] = slope * x - 2 * amplitude;
    } else {
      triangleValues[i] = -(slope * x) + 4 * amplitude;
    }
    x = (x + dx) % TWO_PI;
  }
}

function calcSaw(thetaSaw) {
  let x = thetaSaw % TWO_PI;
  let slope = amplitude / PI;
  for (let i = 0; i < sawValues.length; i++) {
    if (x > dropThreshold && x < PI) {
      sawValues[i] += speed * dropSpeed * amplitude;
      sawValues[i] = Math.min(squareValues[i], amplitude);
    } else if (x <= PI) {
      sawValues[i] = -(slope * x);
    } else {
      sawValues[i] = -(slope * x - 2 * amplitude);
    }

    x = (x + dx) % TWO_PI;
  }
}

function renderWaves() {
  renderSin(padding + amplitude, "#1abc9c");
  renderSquare(padding + amplitude + ySpacing, "#bc1a7b");
  renderTriangle(padding + amplitude + 2 * ySpacing, "#bc3a1a");
  renderSaw(padding + amplitude + 3 * ySpacing, "#bc8b1a");
}

function renderSin(y, waveColor) {
  strokeWeight(6);
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < sinValues.length; x++) {
    fill(color(waveColor));
    stroke(color(waveColor));
    ellipse(x * xSpacing, sinValues[x] + y, pointWidth, pointWidth);
    if (x > 0 && renderLines) {
      line(
        (x - 1) * xSpacing,
        sinValues[x - 1] + y,
        x * xSpacing,
        sinValues[x] + y
      );
    }
  }
}

function renderSquare(y, waveColor) {
  for (let x = 0; x < sinValues.length; x++) {
    fill(color(waveColor));
    stroke(color(waveColor));
    ellipse(x * xSpacing, squareValues[x] + y, pointWidth, pointWidth);
    if (x > 0 && renderLines) {
      if (squareValues[x - 1] == squareValues[x]) {
        line(
          (x - 1) * xSpacing,
          squareValues[x - 1] + y,
          x * xSpacing,
          squareValues[x] + y
        );
      }
    }
  }
}

function renderTriangle(y, waveColor) {
  for (let x = 0; x < sinValues.length; x++) {
    fill(color(waveColor));
    stroke(color(waveColor));
    ellipse(x * xSpacing, triangleValues[x] + y, pointWidth, pointWidth);
    if (x > 0 && renderLines) {
      line(
        (x - 1) * xSpacing,
        triangleValues[x - 1] + y,
        x * xSpacing,
        triangleValues[x] + y
      );
    }
  }
}

function renderSaw(y, waveColor) {
  for (let x = 0; x < sinValues.length; x++) {
    fill(color(waveColor));
    stroke(color(waveColor));
    ellipse(x * xSpacing, sawValues[x] + y, pointWidth, pointWidth);
    if (x > 0 && renderLines) {
      if (abs(sawValues[x - 1] - sawValues[x]) <= amplitude * 0.15) {
        line(
          (x - 1) * xSpacing,
          sawValues[x - 1] + y,
          x * xSpacing,
          sawValues[x] + y
        );
      }
    }
  }
}
