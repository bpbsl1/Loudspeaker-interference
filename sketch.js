let speaker1, speaker2;
let mic;

let lambdaSlider;
let spacingSlider;

let lambda = 100;
let pxToMeter = 0.01;

let dragging = false;

let osc;
let soundStarted = false;

let time = 0;

function setup() {
  let canvas = createCanvas(1000, 620);
  canvas.parent("canvas-holder");

  speaker1 = createVector(430, 300);
  speaker2 = createVector(630, 300);
  mic = createVector(820, 360);

  textFont("Arial");

  lambdaSlider = createSlider(60, 160, 100, 1);
  spacingSlider = createSlider(120, 320, 200, 1);

  osc = new p5.Oscillator("sine");
  osc.freq(440);
  osc.amp(0);
  osc.start();
}

function draw() {
  background(255);

  lambda = lambdaSlider.value();

  let spacing = spacingSlider.value();
  let centerX = 530;

  speaker1.x = centerX - spacing / 2;
  speaker2.x = centerX + spacing / 2;

  drawTitle();

  drawWave(speaker1, color(255, 70, 70), 0);
  drawWave(speaker2, color(255, 145, 0), 0);

  drawSpeaker(speaker1, "1");
  drawSpeaker(speaker2, "2");

  let d1 = dist(mic.x, mic.y, speaker1.x, speaker1.y);
  let d2 = dist(mic.x, mic.y, speaker2.x, speaker2.y);
  let deltaD = abs(d1 - d2);
  let ratio = deltaD / lambda;

  let d1_m = d1 * pxToMeter;
  let d2_m = d2 * pxToMeter;
  let deltaD_m = deltaD * pxToMeter;
  let lambda_m = lambda * pxToMeter;
  let spacing_m = spacing * pxToMeter;

  stroke(100);
  line(speaker1.x + 50, speaker1.y, mic.x, mic.y);
  line(speaker2.x + 50, speaker2.y, mic.x, mic.y);

  noStroke();
  fill(0);
  textSize(16);
  text("d₁", (speaker1.x + mic.x) / 2, (speaker1.y + mic.y) / 2 - 10);
  text("d₂", (speaker2.x + mic.x) / 2, (speaker2.y + mic.y) / 2 + 15);

  drawMic();

  drawArrow(spacing_m);
  drawInfo(d1_m, d2_m, deltaD_m, lambda_m, ratio);
  drawControls(lambda_m, spacing_m);

  updateSound(ratio);

  time += 0.05;
}

// ---------- WAVES ----------
function drawWave(pos, col, phase) {
  stroke(col);
  strokeWeight(3);
  noFill();

  beginShape();
  for (let x = pos.x + 50; x < width - 40; x += 3) {
    let y = pos.y + 30 * sin(TWO_PI * (x - pos.x) / lambda - time + phase);
    vertex(x, y);
  }
  endShape();

  strokeWeight(1);
}

// ---------- SPEAKER ----------
function drawSpeaker(pos, label) {
  fill(70);
  stroke(0);
  rect(pos.x - 25, pos.y - 40, 30, 80, 5);

  fill(130);
  ellipse(pos.x + 25, pos.y, 60, 60);

  fill(90);
  ellipse(pos.x + 25, pos.y, 35, 35);

  fill(40);
  ellipse(pos.x + 25, pos.y, 12, 12);

  noStroke();
  fill(0);
  textSize(20);
  text(label, pos.x - 5, pos.y + 75);
}

// ---------- MIC ----------
function drawMic() {
  fill(0);
  circle(mic.x, mic.y, 18);
  text("microphone", mic.x + 15, mic.y - 10);
}

// ---------- ARROW ----------
function drawArrow(spacing_m) {
  let y = speaker1.y + 150;
  let x1 = speaker1.x + 50;
  let x2 = speaker2.x + 50;

  stroke(0);
  strokeWeight(2);
  line(x1, y, x2, y);

  line(x1, y, x1 + 10, y - 6);
  line(x1, y, x1 + 10, y + 6);

  line(x2, y, x2 - 10, y - 6);
  line(x2, y, x2 - 10, y + 6);

  noStroke();
  textAlign(CENTER);
  text(`speaker separation = ${spacing_m.toFixed(2)} m`, (x1 + x2) / 2, y + 25);
  textAlign(LEFT);
}

// ---------- INFO BOX ----------
function drawInfo(d1, d2, dd, lambda, ratio) {
  fill(255);
  stroke(0);
  rect(35, 105, 350, 250, 12);

  noStroke();
  fill(0);
  textSize(18);
  text("Measurements in meters", 55, 140);

  textSize(16);
  text(`d₁ = ${d1.toFixed(2)} m`, 55, 180);
  text(`d₂ = ${d2.toFixed(2)} m`, 55, 210);
  text(`Δd = ${dd.toFixed(2)} m`, 55, 240);
  text(`λ = ${lambda.toFixed(2)} m`, 55, 270);
  text(`Δd / λ = ${ratio.toFixed(2)}`, 55, 300);

  if (abs(ratio - round(ratio)) < 0.05) {
    fill(0, 130, 0);
    text("Constructive: loud", 55, 330);
  } else if (abs(ratio - (floor(ratio) + 0.5)) < 0.05) {
    fill(180, 0, 0);
    text("Destructive: quiet", 55, 330);
  }
}

// ---------- CONTROLS (FIXED!) ----------
function drawControls(lambda_m, spacing_m) {
  let x = 420;
  let y = height - 90;

  lambdaSlider.position(x, y);
  spacingSlider.position(x, y + 40);

  noStroke();
  fill(0);
  textSize(16);

  text(`λ = ${lambda_m.toFixed(2)} m`, x + 180, y + 15);
  text(`separation = ${spacing_m.toFixed(2)} m`, x + 180, y + 55);
}

// ---------- SOUND ----------
function updateSound(ratio) {
  if (!soundStarted) return;
  let amp = abs(cos(PI * ratio));
  osc.amp(0.25 * amp, 0.1);
}

// ---------- INTERACTION ----------
function mousePressed() {
  userStartAudio();
  soundStarted = true;

  if (dist(mouseX, mouseY, mic.x, mic.y) < 25) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    mic.x = constrain(mouseX, 420, width - 40);
    mic.y = constrain(mouseY, 110, height - 130);
  }
}

function mouseReleased() {
  dragging = false;
}

// ---------- TITLE ----------
function drawTitle() {
  fill(0);
  textSize(28);
  text("Two In-Phase Loudspeakers", 40, 40);

  textSize(16);
  text("Drag the microphone. Observe interference.", 40, 70);
}
