// ---- 3D LAMP CANVAS ----
const canvas = document.getElementById("lamp-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  angle = -0.3,
  isDragging = false,
  lastX = 0;
let lampOn = false;

function resize() {
  const container = document.getElementById("lamp-canvas-container");
  W = canvas.width = container.offsetWidth;
  H = canvas.height = container.offsetHeight;
  drawLamp();
}

function project3D(x, y, z, rotY) {
  const cosA = Math.cos(rotY),
    sinA = Math.sin(rotY);
  const rx = x * cosA + z * sinA;
  const rz = -x * sinA + z * cosA;
  const scale = 600 / (600 + rz);
  return { x: W / 2 + rx * scale, y: H / 2 + y * scale, z: rz, scale };
}

function drawLamp() {
  ctx.clearRect(0, 0, W, H);
  // Background
  const bgGrad = ctx.createRadialGradient(
    W / 2,
    H / 2,
    0,
    W / 2,
    H / 2,
    W * 0.7
  );
  bgGrad.addColorStop(0, lampOn ? "#2a1a00" : "#1a1a1a");
  bgGrad.addColorStop(1, "#0d0d0d");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  const s = Math.min(W, H) * 0.4;
  const baseY = H * 0.72;
  const baseX = W * 0.5;

  // Shadow on ground
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.ellipse(baseX, baseY + s * 0.05, s * 0.6, s * 0.08, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#000";
  ctx.fill();
  ctx.restore();

  // BASE
  const b1 = project3D(-s * 0.4, s * 0.05, 0, angle);
  const b2 = project3D(s * 0.4, s * 0.05, 0, angle);
  const baseTop = baseY;
  const baseBottom = baseY + s * 0.06;

  ctx.beginPath();
  ctx.moveTo(baseX + b1.x - W / 2, baseTop);
  ctx.lineTo(baseX + b2.x - W / 2, baseTop);
  ctx.lineTo(baseX + b2.x - W / 2 + 8, baseBottom);
  ctx.lineTo(baseX + b1.x - W / 2 - 8, baseBottom);
  ctx.closePath();
  const baseGrad = ctx.createLinearGradient(0, baseTop, 0, baseBottom);
  baseGrad.addColorStop(0, "#555");
  baseGrad.addColorStop(1, "#222");
  ctx.fillStyle = baseGrad;
  ctx.fill();

  // BASE TOP SURFACE
  ctx.beginPath();
  ctx.ellipse(baseX, baseTop, s * 0.42, s * 0.06, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#666";
  ctx.fill();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.stroke();

  // POLE
  const poleBot = { x: baseX, y: baseTop };
  const poleTop = {
    x: baseX + Math.sin(angle) * s * 0.1,
    y: baseTop - s * 0.8,
  };
  ctx.beginPath();
  ctx.moveTo(poleBot.x - 8, poleBot.y);
  ctx.lineTo(poleBot.x - 6, poleTop.y);
  ctx.lineTo(poleBot.x + 6, poleTop.y);
  ctx.lineTo(poleBot.x + 8, poleBot.y);
  ctx.closePath();
  const poleGrad = ctx.createLinearGradient(poleBot.x - 8, 0, poleBot.x + 8, 0);
  poleGrad.addColorStop(0, "#444");
  poleGrad.addColorStop(0.5, "#888");
  poleGrad.addColorStop(1, "#333");
  ctx.fillStyle = poleGrad;
  ctx.fill();

  // ARM JOINT at pole top
  const jointX = poleTop.x,
    jointY = poleTop.y;
  ctx.beginPath();
  ctx.arc(jointX, jointY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#777";
  ctx.fill();
  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ARM
  const armEndX = jointX + Math.cos(angle + 0.8) * s * 0.35;
  const armEndY = jointY - Math.sin(0.8) * s * 0.1 - s * 0.05;
  ctx.beginPath();
  ctx.moveTo(jointX, jointY);
  ctx.lineTo(armEndX, armEndY);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.strokeStyle = "#aaa";
  ctx.lineWidth = 4;
  ctx.stroke();

  // LAMP HEAD (conical shade)
  const headX = armEndX,
    headY = armEndY;
  const shadeOpen = s * 0.22;
  const shadeDepth = s * 0.14;
  const tilt = 0.3;

  ctx.save();
  ctx.translate(headX, headY);
  ctx.rotate(tilt);

  // Shade outer
  ctx.beginPath();
  ctx.moveTo(-shadeOpen, shadeDepth);
  ctx.lineTo(0, 0);
  ctx.lineTo(shadeOpen, shadeDepth);
  ctx.closePath();
  const shadeGrad = ctx.createLinearGradient(-shadeOpen, 0, shadeOpen, 0);
  shadeGrad.addColorStop(0, lampOn ? "#c44800" : "#888");
  shadeGrad.addColorStop(0.5, lampOn ? "#e8390e" : "#ccc");
  shadeGrad.addColorStop(1, lampOn ? "#c44800" : "#777");
  ctx.fillStyle = shadeGrad;
  ctx.fill();
  ctx.strokeStyle = lampOn ? "#ff6633" : "#999";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Shade rim
  ctx.beginPath();
  ctx.ellipse(0, shadeDepth, shadeOpen, shadeOpen * 0.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = lampOn ? "#c44800" : "#666";
  ctx.fill();

  // Light cone if on
  if (lampOn) {
    ctx.save();
    ctx.globalAlpha = 0.15;
    const lightGrad = ctx.createRadialGradient(
      0,
      shadeDepth,
      0,
      0,
      shadeDepth,
      s * 0.8
    );
    lightGrad.addColorStop(0, "#ffaa00");
    lightGrad.addColorStop(1, "transparent");
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.moveTo(-shadeOpen * 0.8, shadeDepth);
    ctx.lineTo(-shadeOpen * 2.5, shadeDepth + s * 0.8);
    ctx.lineTo(shadeOpen * 2.5, shadeDepth + s * 0.8);
    ctx.lineTo(shadeOpen * 0.8, shadeDepth);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Bulb
  ctx.beginPath();
  ctx.arc(0, shadeDepth * 0.7, 8, 0, Math.PI * 2);
  ctx.fillStyle = lampOn ? "#ffffaa" : "#aaa";
  if (lampOn) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffcc00";
  }
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // SWITCH on pole
  const swX = poleBot.x + 12 + Math.sin(angle) * 15;
  const swY = baseTop - s * 0.15;
  ctx.beginPath();
  ctx.roundRect(swX - 8, swY - 14, 16, 28, 4);
  ctx.fillStyle = "#333";
  ctx.fill();
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  ctx.stroke();
  // Switch knob
  ctx.beginPath();
  ctx.roundRect(swX - 5, lampOn ? swY - 10 : swY + 0, 10, 12, 2);
  ctx.fillStyle = lampOn ? "#e8390e" : "#888";
  ctx.fill();

  // CORD
  ctx.beginPath();
  ctx.moveTo(poleBot.x, poleBot.y + s * 0.06);
  ctx.bezierCurveTo(
    poleBot.x + 20,
    poleBot.y + s * 0.2,
    poleBot.x - 20,
    poleBot.y + s * 0.3,
    poleBot.x,
    poleBot.y + s * 0.35
  );
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.stroke();
}

// Dragging
canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.clientX;
});
canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  angle += (e.clientX - lastX) * 0.01;
  lastX = e.clientX;
  drawLamp();
});
canvas.addEventListener("mouseup", () => (isDragging = false));
canvas.addEventListener("mouseleave", () => (isDragging = false));
canvas.addEventListener("touchstart", (e) => {
  isDragging = true;
  lastX = e.touches[0].clientX;
});
canvas.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging) return;
    angle += (e.touches[0].clientX - lastX) * 0.01;
    lastX = e.touches[0].clientX;
    drawLamp();
    e.preventDefault();
  },
  { passive: false }
);
canvas.addEventListener("touchend", () => (isDragging = false));

// Double-click to toggle lamp
canvas.addEventListener("dblclick", () => {
  lampOn = !lampOn;
  drawLamp();
});

const lampData = {
  head: {
    title: "Lamp Head (Shade)",
    desc: 'The conical shade is a perfect affordance — its shape naturally directs light downward. The wide opening communicates "light comes from here." Double-click the lamp to toggle it on/off.',
  },
  arm: {
    title: "Articulated Arm",
    desc: "The joints signal flexibility through their visible hinges. The mapping is intuitive: move the arm, move the light. No instruction needed.",
  },
  base: {
    title: "Weighted Base",
    desc: 'The heavy, flat base communicates stability. A constraint by design — it limits tipping while the cord exit signals "this plugs in." Drag the lamp to rotate and explore.',
  },
  switch: {
    title: "Physical Switch",
    desc: "A tactile switch provides immediate feedback. The two-position toggle maps perfectly to on/off states. You can feel when it clicks — no ambiguity.",
  },
};

function showLampInfo(part) {
  const d = lampData[part];
  document.getElementById("lip-title").textContent = d.title;
  document.getElementById("lip-desc").textContent = d.desc;
  document.getElementById("lampInfoPanel").classList.add("show");
}
function closeLampInfo() {
  document.getElementById("lampInfoPanel").classList.remove("show");
}

function playVideo(placeholder) {
  placeholder.style.display = "none";
  const video = document.getElementById("main-video");
  video.style.display = "block";
  video.play();
}

window.addEventListener("resize", resize);
resize();
