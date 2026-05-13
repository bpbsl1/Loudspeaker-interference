let speaker1, speaker2;
let mic;

let lambda = 100;        // pixels
let pxToMeter = 0.01;    // 1 pixel = 0.01 m = 1 cm

let dragging = false;

function setup() {
  createCanvas(900, 600);

  speaker1 = createVector(300, 260);
  speaker2 = createVector(500, 260);
  mic = createVector(700, 330);

  textFont("Arial");
}

function draw() {
  background(255);

  drawTitle();
  drawWavefronts(speaker1, color(255, 80, 80));
  drawWavefronts(speaker2, color(255, 150, 0));

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

  stroke(80);
  line(speaker1.x, speaker1.y, mic.x, mic.y);
  line(speaker2.x, speaker2.y, mic.x, mic.y);

  drawMic();

  drawInfoPanel(d1_m, d2_m, deltaD_m, lambda_m, ratio);
}

function drawTitle() {
  noStroke();
  fill(0);
  textSize(24);
  textStyle(BOLD);
  text("Two In-Phase Loudspeakers", 30, 40);

  textStyle(NORMAL);
  textSize(16);
  text("Drag the microphone. Watch how path-length difference changes the sound.", 30, 70);
}

function drawSpeaker(pos, label) {
  fill(90);
  stroke(0);
  rect(pos.x - 12, pos.y - 30, 24, 60);

  fill(130);
  triangle(pos.x + 12, pos.y - 35, pos.x + 60, pos.y - 60, pos.x + 60, pos.y + 60);

  noStroke();
  fill(0);
  textSize(22);
  text(label, pos.x - 5, pos.y + 85);
}

function drawWavefronts(pos, col) {
  noFill();
  stroke(col);
  strokeWeight(2);

  for (let r = lambda; r < 700; r += lambda) {
    circle(pos.x, pos.y, 2 * r);
  }

  strokeWeight(1);
}

function drawMic() {
  noStroke();
  fill(0);
  circle(mic.x, mic.y, 16);

  fill(0);
  textSize(14);
  text("microphone", mic.x + 15, mic.y - 10);
}

function drawInfoPanel(d1_m, d2_m, deltaD_m, lambda_m, ratio) {
  let panelX = 570;
  let panelY = 95;
  let panelW = 300;
  let panelH = 210;

  fill(255);
  stroke(0);
  strokeWeight(2);
  rect(panelX, panelY, panelW, panelH, 12);

  noStroke();
  fill(0);
  textSize(16);
  textStyle(BOLD);
  text("Measurements in meters", panelX + 20, panelY + 35);

  textStyle(NORMAL);
  textSize(15);
  text(`d₁ = ${d1_m.toFixed(2)} m`, panelX + 20, panelY + 70);
  text(`d₂ = ${d2_m.toFixed(2)} m`, panelX + 20, panelY + 100);
  text(`Δd = |d₁ - d₂| = ${deltaD_m.toFixed(2)} m`, panelX + 20, panelY + 130);
  text(`λ = ${lambda_m.toFixed(2)} m`, panelX + 20, panelY + 160);
  text(`Δd / λ = ${ratio.toFixed(2)}`, panelX + 20, panelY + 190);

  let label;

  if (abs(ratio - round(ratio)) < 0.05) {
    label = "Constructive: loud";
  } else if (abs(ratio - (floor(ratio) + 0.5)) < 0.05) {
    label = "Destructive: quiet";
  } else {
    label = "Intermediate";
  }

  fill(0, 130, 0);
  textStyle(BOLD);
  text(label, 30, height - 40);
  textStyle(NORMAL);

  fill(0);
  textSize(15);
  text("Constructive: Δd = 0, λ, 2λ, 3λ, ...", 30, height - 90);
  text("Destructive: Δd = λ/2, 3λ/2, 5λ/2, ...", 30, height - 65);
}

function mousePressed() {
  if (dist(mouseX, mouseY, mic.x, mic.y) < 20) {
    dragging = true;
  }
}

function mouseDragged() {
  if (dragging) {
    mic.x = mouseX;
    mic.y = mouseY;
  }
}

function mouseReleased() {
  dragging = false;
}
