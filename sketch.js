let speaker1, speaker2;
let mic;

let lambda = 100; // pixels
let csound = 343;

let dragging = false;

// Conversion: pixels → meters
let pxToMeter = 0.01; // 1 px = 1 cm

function setup() {
  createCanvas(800, 500);

  speaker1 = createVector(width / 2 - 100, 200);
  speaker2 = createVector(width / 2 + 100, 200);

  mic = createVector(width / 2 + 200, 300);

  textFont("Arial");
}

function draw() {
  background(255);

  // Title
  fill(0);
  textSize(18);
  text("Two In-Phase Loudspeakers", 20, 30);

  textSize(14);
  text("Drag the microphone. Observe interference.", 20, 50);

  // Draw speakers
  drawSpeaker(speaker1);
  drawSpeaker(speaker2);

  // Draw wavefronts
  drawWavefronts(speaker1, color(255, 100, 100));
  drawWavefronts(speaker2, color(255, 150, 0));

  // Draw mic
  fill(0);
  circle(mic.x, mic.y, 10);

  // Distances
  let d1 = dist(mic.x, mic.y, speaker1.x, speaker1.y);
  let d2 = dist(mic.x, mic.y, speaker2.x, speaker2.y);

  // Convert to meters
  let d1_m = d1 * pxToMeter;
  let d2_m = d2 * pxToMeter;
  let lambda_m = lambda * pxToMeter;
  let delta_d_m = abs(d1 - d2) * pxToMeter;

  let ratio = delta_d_m / lambda_m;

  // Draw lines to mic
  stroke(150);
  line(speaker1.x, speaker1.y, mic.x, mic.y);
  line(speaker2.x, speaker2.y, mic.x, mic.y);
  noStroke();

  // Display values near mic
  fill(0);
  textSize(13);
  text(`d1 = ${d1_m.toFixed(2)} m`, mic.x + 10, mic.y - 20);
  text(`d2 = ${d2_m.toFixed(2)} m`, mic.x + 10, mic.y);
  text(`Δd = ${delta_d_m.toFixed(2)} m`, mic.x + 10, mic.y + 20);

  // Bottom info
  textSize(14);
  text(`λ = ${lambda_m.toFixed(2)} m`, 20, height - 60);
  text(`Δd / λ = ${ratio.toFixed(2)}`, 20, height - 40);

  // Interference type
  let label = "";

  if (abs(ratio - round(ratio)) < 0.05) {
    label = "Constructive (loud)";
  } else if (abs(ratio - (floor(ratio) + 0.5)) < 0.05) {
    label = "Destructive (quiet)";
  } else {
    label = "Intermediate";
  }

  text(label, 20, height - 20);
}

// -------------------------

function drawSpeaker(pos) {
  fill(100);
  rect(pos.x - 10, pos.y - 20, 20, 40);
}

// -------------------------

function drawWavefronts(pos, col) {
  noFill();
  stroke(col);
  for (let r = 0; r < width; r += lambda) {
    circle(pos.x, pos.y, 2 * r);
  }
  noStroke();
}

// -------------------------

function mousePressed() {
  if (dist(mouseX, mouseY, mic.x, mic.y) < 10) {
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
