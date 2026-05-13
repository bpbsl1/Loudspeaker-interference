let speaker1, speaker2;
let mic;

let lambdaSlider;
let spacingSlider;

let lambda = 100;        // pixels
let pxToMeter = 0.01;    // 1 px = 0.01 m = 1 cm

let dragging = false;

let osc;
let soundStarted = false;

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

  drawWavefronts(speaker1, color(255, 70, 70));
  drawWavefronts(speaker2, color(255, 145, 0));

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
  line(speaker1.x, speaker1.y, mic.x, mic.y);
  line(speaker2.x, speaker2.y, mic.x, mic.y);

  drawMic();

  drawInfoPanel(d1_m, d2_m, deltaD_m, lambda_m, ratio);
  drawControls(lambda_m, spacing_m);

  updateSound(ratio);
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

function drawWavefronts(pos, col) {
  noFill();
  stroke(col);
  strokeWeight(2);

  for (let r = lambda; r < 900; r += lambda) {
    circle(pos.x, pos.y, 2 * r);
  }

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
  noStroke();
  fill(0);
  textSize(15);

  text(`wavelength λ = ${lambda_m.toFixed(2)} m`, 430, height - 55);
  text(`speaker spacing = ${spacing_m.toFixed(2)} m`, 430, height - 25);

  lambdaSlider.position(430, height + 10);
  spacingSlider.position(430, height + 40);
}

function updateSound(ratio) {
  if (!soundStarted) {
    osc.amp(0);
    return;
  }

  let amp = abs(cos(PI * ratio));

  // Limit maximum volume for classroom comfort
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
