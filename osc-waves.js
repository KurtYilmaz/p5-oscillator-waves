let xSpacing; // Distance between each horizontal location
let ySpacing; // Distance between each wave
let waveWidth; // Width of entire wave
let theta = 0; // Start angle at 0
let amplitude; // Height of wave
let frequency; // wave frequency
let dx; // Value for incrementing x
let sinValues; // Using an array to store height values for the wave
let squareValues;
let triValues;
let sawValues;
let padding; // Padding from top
let wavePosition; // Position of each wave, modified by ySpacing
let pointWidth; // Width of the wave ellipses
let speed = 0.02; // Speed of wave scrolling
let dropThreshold; // Distance from changing point to start drop
let dropSpeed = 18; // Speed of saw and square points dropping
p5.disableFriendlyErrors = true; // Performance optimization
let animHeight; // Animation height
let animWidth; // Animation width
let cnv; // Reference to canvas
// The following variables should be specified in html e.g:
/* 
<script>
  parentId = "home";
  colorSin = "#2e7986";
  colorSquare = "#2e7986";
  colorTri = "#2e7986";
  colorSaw = "#2e7986";
</script> 
*/

function setColors() {
  if (typeof colorSin == "undefined") {
    colorSin = "#1abc9c";
  }
  if (typeof colorSquare == "undefined") {
    colorSquare = "#bc1a7b";
  }
  if (typeof colorTri == "undefined") {
    colorTri = "#bc3a1a";
  }
  if (typeof colorSaw == "undefined") {
    colorSaw = "#bc9b1a";
  }
}

function setWindow() {
  if (typeof parentId != "undefined") {
    animHeight = document.getElementById(parentId).clientHeight;
    animWidth = document.getElementById(parentId).clientWidth;
    cnv = createCanvas(animWidth, animHeight);
    cnv.parent(parentId);
  } else {
    animHeight = windowHeight;
    animWidth = windowWidth;
    cnv = createCanvas(animWidth, animHeight);
  }
}

function setup() {
  setColors();
  setWindow();
  setConstants();
}

function windowResized() {
  setWindow();
  setConstants();
}

function setConstants() {
  waveWidth = width + 16;
  xSpacing = floor(animWidth / 40);
  ySpacing = floor(animHeight / 5);
  padding = floor(animHeight / 16);
  amplitude = floor(animHeight / 20);
  pointWidth = Math.min(floor(xSpacing * 0.8), amplitude / 3);
  frequency = 3 / waveWidth;
  dx = TWO_PI * frequency * xSpacing;
  dropThreshold = 0.97 * PI;
  sawThreshold = 0.15 * amplitude;
  wavePosition = padding + amplitude;
  sinValues = new Array(floor(waveWidth / xSpacing));
  squareValues = new Array(floor(waveWidth / xSpacing));
  triValues = new Array(floor(waveWidth / xSpacing));
  sawValues = new Array(floor(waveWidth / xSpacing));
}

function draw() {
  background("#2c3e50");
  calcSin(theta);
  calcSquare(theta);
  calcTri(theta);
  calcSaw(theta);
  renderWaves();
  theta += speed % TWO_PI;
}

function calcSin(thetaSin) {
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

function calcTri(thetaTri) {
  let x = thetaTri % TWO_PI;
  let slope = (2 * amplitude) / PI;
  for (let i = 0; i < triValues.length; i++) {
    if (x < HALF_PI) {
      triValues[i] = -(slope * x);
    } else if (x < PI) {
      triValues[i] = slope * x - 2 * amplitude;
    } else if (x < 3 * HALF_PI) {
      triValues[i] = slope * x - 2 * amplitude;
    } else {
      triValues[i] = -(slope * x) + 4 * amplitude;
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
      sawValues[i] = Math.min(sawValues[i], amplitude);
    } else if (x <= PI) {
      sawValues[i] = -(slope * x);
    } else {
      sawValues[i] = -(slope * x - 2 * amplitude);
    }

    x = (x + dx) % TWO_PI;
  }
}

function renderWaves() {
  renderSin(wavePosition, colorSin);
  renderSquare(wavePosition + ySpacing, colorSquare);
  renderTri(height - wavePosition - ySpacing, colorTri);
  renderSaw(height - wavePosition, colorSaw);
}

function renderSin(y, waveColor) {
  fill(color(waveColor));
  stroke(color(waveColor));
  // A simple way to draw the wave with an ellipse at each location
  for (let x = 0; x < sinValues.length; x++) {
    ellipse(x * xSpacing, sinValues[x] + y, pointWidth, pointWidth);
  }
}

function renderSquare(y, waveColor) {
  fill(color(waveColor));
  stroke(color(waveColor));
  for (let x = 0; x < sinValues.length; x++) {
    ellipse(x * xSpacing, squareValues[x] + y, pointWidth, pointWidth);
  }
}

function renderTri(y, waveColor) {
  fill(color(waveColor));
  stroke(color(waveColor));
  for (let x = 0; x < sinValues.length; x++) {
    ellipse(x * xSpacing, triValues[x] + y, pointWidth, pointWidth);
  }
}

function renderSaw(y, waveColor) {
  fill(color(waveColor));
  stroke(color(waveColor));
  for (let x = 0; x < sinValues.length; x++) {
    ellipse(x * xSpacing, sawValues[x] + y, pointWidth, pointWidth);
  }
}
