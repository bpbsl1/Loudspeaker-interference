let speaker1, speaker2;
let mic;

let lambdaSlider;
let spacingSlider;

let lambda = 100;        // pixels
let pxToMeter = 0.01;    // 1 px = 0.01 m

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
  lambdaSlider.parent("canvas-holder");

  spacingSlider = createSlider(120, 320, 200, 1);
  spacingSlider.parent("canvas-holder");

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

  drawTravelingSineWave(speaker1, color(255, 70, 70), 0);
  drawTravelingSineWave(speaker2, color(255, 145, 0), PI / 8);

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
  strokeWeight(1);
  line(speaker1.x + 65, speaker1.y, mic.x, mic.y);
  line(speaker2.x + 65, speaker2.y, mic.x, mic.y);

  noStroke();
  fill(0);
  textSize(16);
  text("d₁", (speaker1.x + mic.x) / 2 + 20, (speaker1.y + mic.y) / 2 - 15);
  text("d₂", (speaker2.x + mic.x) / 2 + 20, (speaker2.y + mic.y) / 2 + 20);

  drawMic();

  drawSpeakerSeparationArrow(spacing_m);
  drawInfoPanel(d1_m, d2_m, deltaD_m, lambda_m, ratio);
  drawControls(lambda_m, spacing_m);

  updateSound(ratio);

  time += 0.04;
}

function drawTitle() {
  noStroke();
  fill(0);
  textSize(28);
  textStyle(BOLD);
  text("Two In-Phase Loudspeakers", 40, 40);

  textStyle(NORMAL);
  textSize(17);
  text("Drag the microphone. Watch how path-length difference controls the sound amplitude.", 40, 70);
}

function drawSpeaker(pos, label) {
  fill(90);
  stroke(0);
  strokeWeight(2);
  rect(pos.x - 12, pos.y - 35, 24, 70);

  fill(130);
  triangle(
    pos.x + 12, pos.y - 45,
    pos.x + 70, pos.y - 75,
    pos.x + 70, pos.y + 75
  );

  noStroke();
  fill(0);
  textSize(24);
  text(label, pos.x - 5, pos.y + 105);
}

function drawTravelingSineWave(pos, col, phaseShift) {
  noFill();
  stroke(col);
  strokeWeight(3);

  beginShape();

  for (let x = pos.x + 70; x < width - 40; x += 4) {
    let y = pos.y + 35 * sin(TWO_PI * (x - pos.x) / lambda - time + phaseShift);
    vertex(x, y);
  }

  endShape();

  strokeWeight(1);
}

function drawMic() {
  noStroke();
  fill(0);
  circle(mic.x, mic.y, 18);

  fill(0);
  textSize(15);
  text("microphone", mic.x + 15, mic.y - 10);
}

function drawSpeakerSeparationArrow(spacing_m) {
  let y = speaker1.y + 160;
  let x1 = speaker1.x + 65;
  let x2 = speaker2.x + 65;

  stroke(0);
  strokeWeight(2);
  line(x1, y, x2, y);

  // Left arrowhead
  line(x1, y, x1 + 12, y - 7);
  line(x1, y, x1 + 12, y + 7);

  // Right arrowhead
  line(x2, y, x2 - 12, y - 7);
  line(x2, y, x2 - 12, y + 7);

  noStroke();
  fill(0);
  textSize(17);
  textAlign(CENTER);
  text(`speaker separation = ${spacing_m.toFixed(2)} m`, (x1 + x2) / 2, y + 30);
  textAlign(LEFT);
}

function drawInfoPanel(d1_m, d2_m, deltaD_m, lambda_m, ratio) {
  let panelX = 35;
  let panelY = 105;
  let panelW = 350;
  let panelH = 255;

  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 12);

  noStroke();
  fill(0);
  textSize(18);
  textStyle(BOLD);
  text("Measurements in meters", panelX + 20, panelY + 35);

  textStyle(NORMAL);
  textSize(17);
  text(`d₁ = ${d1_m.toFixed(2)} m`, panelX + 20, panelY + 75);
  text(`d₂ = ${d2_m.toFixed(2)} m`, panelX + 20, panelY + 110);
  text(`Δd = |d₁ - d₂| = ${deltaD_m.toFixed(2)} m`, panelX + 20, panelY + 145);
  text(`λ = ${lambda_m.toFixed(2)} m`, panelX + 20, panelY + 180);
  text(`Δd / λ = ${ratio.toFixed(2)}`, panelX + 20, panelY + 215);

  let label;

  if (abs(ratio - round(ratio)) < 0.05) {
    label = "Constructive: loud";
    fill(0, 130, 0);
  } else if (abs(ratio - (floor(ratio) + 0.5)) < 0.05) {
    label = "Destructive: quiet";
    fill(180, 0, 0);
  } else {
    label = "Intermediate";
    fill(0);
  }

  textStyle(BOLD);
  text(label, panelX + 20, panelY + 245);
  textStyle(NORMAL);

  fill(0);
  textSize(17);
  text("Constructive: Δd = 0, λ, 2λ, 3λ, ...", 40, height - 105);
  text("Destructive: Δd = λ/2, 3λ/2, 5λ/2, ...", 40, height - 75);

  if (!soundStarted) {
    fill(180, 0, 0);
    textStyle(BOLD);
    text("Click inside the simulation to start sound.", 40, height - 40);
    textStyle(NORMAL);
  }
}

function drawControls(lambda_m, spacing_m) {
  let sliderY = height - 55;

  lambdaSlider.position(430, sliderY);
  spacingSlider.position(430, sliderY + 35);

  noStroke();
  fill(0);
  textSize(16);
  text(`wavelength λ = ${lambda_m.toFixed(2)} m`, 650, sliderY + 15);
  text(`speaker separation = ${spacing_m.toFixed(2)} m`, 650, sliderY + 50);
}

function updateSound(ratio) {
  if (!soundStarted) {
    osc.amp(0);
    return;
  }

  let amp = abs(cos(PI * ratio));
  osc.amp(0.25 * amp, 0.1);
}

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
