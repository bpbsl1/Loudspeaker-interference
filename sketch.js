// Loudspeaker Interference Demo
// Built for classroom use with p5.js
// Two speakers are in phase. Drag the microphone to change path-length difference.

let speaker1;
let speaker2;
let mic;
let wavelengthSlider;
let spacingSlider;
let wavelengthLabel;
let spacingLabel;
let showRingsCheckbox;
let showNodalCheckbox;
let time = 0;

const waveSpeed = 2.0; // visual speed only, not actual speed of sound

function setup() {
  const canvas = createCanvas(940, 620);
  canvas.parent("sketch-holder");

  speaker1 = createVector(230, 220);
  speaker2 = createVector(390, 220);
  mic = createVector(710, 280);

  wavelengthSlider = createSlider(40, 160, 90, 1);
  wavelengthSlider.position(30, height + 25);
  wavelengthSlider.parent("sketch-holder");

  wavelengthLabel = createSpan("");
  wavelengthLabel.position(230, height + 25);
  wavelengthLabel.parent("sketch-holder");

  spacingSlider = createSlider(60, 300, 160, 1);
  spacingSlider.position(30, height + 60);
  spacingSlider.parent("sketch-holder");

  spacingLabel = createSpan("");
  spacingLabel.position(230, height + 60);
  spacingLabel.parent("sketch-holder");

  showRingsCheckbox = createCheckbox("show circular wavefronts", true);
  showRingsCheckbox.position(260, height + 78);
  showRingsCheckbox.parent("sketch-holder");

  showNodalCheckbox = createCheckbox("show approximate nodal/antinodal bands", true);
  showNodalCheckbox.position(260, height + 108);
  showNodalCheckbox.parent("sketch-holder");
}

function draw() {
  background(255);

  const lambda = wavelengthSlider.value();
  const spacing = spacingSlider.value();
  wavelengthLabel.html(`wavelength λ = ${lambda}px`);
  spacingLabel.html(`speaker spacing = ${spacing}px`);

  const centerX = 310;
  speaker1.x = centerX - spacing / 2;
  speaker2.x = centerX + spacing / 2;

  drawTitle(lambda, spacing);

  if (showNodalCheckbox.checked()) {
    drawInterferenceMap(lambda);
  }

  if (showRingsCheckbox.checked()) {
    drawCircularWaves(speaker1, lambda, color(230, 70, 70));
    drawCircularWaves(speaker2, lambda, color(255, 145, 50));
  }

  drawSpeakers();
  drawMic();
  drawPathLines(lambda);
  drawTravelingWaveDiagram(lambda);
  drawInfoPanel(lambda);

  time += 0.025;
}

function drawTitle(lambda, spacing) {
  noStroke();
  fill(0);
  textSize(20);
  textStyle(BOLD);
  text("Two in-phase loudspeakers", 25, 32);
  textStyle(NORMAL);
  textSize(15);
  text("Drag the microphone. Watch how the path-length difference controls the sound amplitude.", 25, 56);

  textSize(14);
  fill(30);
  
}

function drawSpeakers() {
  drawSpeaker(speaker1.x, speaker1.y, "1");
  drawSpeaker(speaker2.x, speaker2.y, "2");

  stroke(0);
  strokeWeight(1);
  line(speaker1.x, speaker1.y - 80, speaker1.x, speaker1.y + 300);
  line(speaker2.x, speaker2.y - 80, speaker2.x, speaker2.y + 300);
  drawingContext.setLineDash([]);

  noStroke();
  fill(0);
  textSize(16);
  text("speakers are in phase", speaker1.x - 50, speaker1.y - 105);
}

function drawSpeaker(x, y, label) {
  push();
  translate(x, y);
  fill(120);
  stroke(40);
  strokeWeight(2);
  rect(-28, -22, 15, 44);
  quad(-13, -15, 17, -35, 17, 35, -13, 15);
  fill(0);
  noStroke();
  textSize(18);
  text(label, -5, 58);
  pop();
}

function drawMic() {
  fill(0);
  noStroke();
  circle(mic.x, mic.y, 14);
  textSize(15);
  text("microphone", mic.x + 14, mic.y - 12);
}

function drawPathLines(lambda) {
  const d1 = dist(speaker1.x, speaker1.y, mic.x, mic.y);
  const d2 = dist(speaker2.x, speaker2.y, mic.x, mic.y);
  const delta = abs(d1 - d2);

  strokeWeight(2);
  stroke(80, 80, 80, 180);
  line(speaker1.x, speaker1.y, mic.x, mic.y);
  stroke(80, 80, 80, 100);
  line(speaker2.x, speaker2.y, mic.x, mic.y);

  noStroke();
  fill(0);
  textSize(15);
  text(`d₁ = ${nf(d1, 1, 1)} px`, (speaker1.x + mic.x) / 2, (speaker1.y + mic.y) / 2 - 10);
  text(`d₂ = ${nf(d2, 1, 1)} px`, (speaker2.x + mic.x) / 2, (speaker2.y + mic.y) / 2 + 20);
  text(`Δd = |d₁ - d₂| = ${nf(delta, 1, 1)} px`, 520, 92);
  text(`Δd / λ = ${nf(delta / lambda, 1, 2)}`, 520, 116);
}

function drawCircularWaves(source, lambda, c) {
  noFill();
  stroke(c);
  strokeWeight(2);
  const maxR = 900;
  for (let r = (time * waveSpeed * lambda) % lambda; r < maxR; r += lambda) {
    circle(source.x, source.y, 2 * r);
  }
}

function drawInterferenceMap(lambda) {
  loadPixels();
  const step = 6;
  for (let x = 0; x < width; x += step) {
    for (let y = 85; y < height - 115; y += step) {
      const r1 = dist(x, y, speaker1.x, speaker1.y);
      const r2 = dist(x, y, speaker2.x, speaker2.y);
      const phase1 = TWO_PI * (r1 / lambda - time);
      const phase2 = TWO_PI * (r2 / lambda - time);
      const pressure = sin(phase1) + sin(phase2);
      const amp = abs(pressure) / 2;

      noStroke();
      if (amp > 0.85) {
        fill(30, 120, 210, 35); // antinodal, louder
        rect(x, y, step, step);
      } else if (amp < 0.12) {
        fill(240, 40, 40, 40); // nodal, quiet
        rect(x, y, step, step);
      }
    }
  }
}

function drawTravelingWaveDiagram(lambda) {
  const y0 = 500;
  const x0 = 220;
  const x1 = 860;
  const amp = 45;

  stroke(0);
  strokeWeight(1);
  line(70, y0, 900, y0);
  noStroke();
  fill(0);
  textSize(16);
  text("resulting pressure wave at the microphone", 70, y0 - 70);
  text("Δp", 35, y0 - 50);
  text("x", 905, y0 + 5);

  const d1 = dist(speaker1.x, speaker1.y, mic.x, mic.y);
  const d2 = dist(speaker2.x, speaker2.y, mic.x, mic.y);
  const delta = abs(d1 - d2);
  const phaseDiff = TWO_PI * delta / lambda;
  const resultAmp = abs(2 * cos(phaseDiff / 2));
  const scaledAmp = amp * resultAmp / 2;

  noFill();
  stroke(0, 120, 200);
  strokeWeight(3);
  beginShape();
  for (let x = x0; x <= x1; x += 3) {
    const y = y0 - scaledAmp * sin(TWO_PI * (x - x0) / lambda - time * TWO_PI);
    vertex(x, y);
  }
  endShape();

  fill(0, 120, 0);
  noStroke();
  textSize(18);
  text(`superposed amplitude ≈ ${nf(resultAmp, 1, 2)} × one speaker`, 360, y0 + 82);
}

function drawInfoPanel(lambda) {
  const d1 = dist(speaker1.x, speaker1.y, mic.x, mic.y);
  const d2 = dist(speaker2.x, speaker2.y, mic.x, mic.y);
  const delta = abs(d1 - d2);
  const ratio = delta / lambda;
  const nearestInteger = round(ratio);
  const nearestHalf = floor(ratio) + 0.5;

  let message;
  if (abs(ratio - nearestInteger) < 0.08) {
    message = "LOUD: constructive interference, Δd ≈ mλ";
  } else if (abs(ratio - nearestHalf) < 0.08) {
    message = "QUIET: destructive interference, Δd ≈ (m + 1/2)λ";
  } else {
    message = "PARTIAL interference";
  }

  fill(245);
  stroke(180);
  rect(510, 135, 390, 96, 10);

  noStroke();
  fill(0);
  textSize(16);
  text(message, 530, 168);
  textSize(14);
  text("Constructive: Δd = 0, λ, 2λ, ...", 530, 195);
  text("Destructive: Δd = λ/2, 3λ/2, 5λ/2, ...", 530, 216);
}

function mouseDragged() {
  if (mouseX > 0 && mouseX < width && mouseY > 75 && mouseY < height - 110) {
    mic.x = mouseX;
    mic.y = mouseY;
  }
}

function mousePressed() {
  if (dist(mouseX, mouseY, mic.x, mic.y) < 30) {
    mic.x = mouseX;
    mic.y = mouseY;
  }
}
