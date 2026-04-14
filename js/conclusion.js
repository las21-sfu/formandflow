/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         SCROLL REVEAL
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach(
      (e) => e.isIntersecting && e.target.classList.add("visible")
    ),
  { threshold: 0.12 }
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         PRODUCT SCANNER DATA
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const products = [
  {
    name: "THE NORMAN DOOR",
    score: 3,
    verdict:
      "A door so poorly designed it became the synonym for design failure. A flat plate on a door that must be pulled — no affordance, no logic, only a label admitting defeat.",
    bars: [
      { label: "Affordance", val: 10, good: false },
      { label: "Signifiers", val: 20, good: false },
      { label: "Mapping", val: 50, good: true },
      { label: "Feedback", val: 30, good: false },
      { label: "Simplicity", val: 15, good: false },
    ],
    svg: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="10" width="160" height="240" rx="3" fill="#3a3028" stroke="#5a4a38" stroke-width="2"/>
            <rect x="30" y="20" width="140" height="220" rx="2" fill="#4a3a28" stroke="#5a4a38" stroke-width="1"/>
            <rect x="145" y="110" width="28" height="8" rx="4" fill="#c8a850" stroke="#a08030" stroke-width="1"/>
            <text x="100" y="195" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="Space Mono,monospace" font-size="9" letter-spacing="1">PUSH</text>
            <rect x="30" y="180" width="140" height="1" fill="rgba(255,255,255,0.05)"/>
          </svg>`,
    dots: [
      {
        x: "76%",
        y: "47%",
        type: "bad",
        title: "SIGNIFIER FAILURE",
        text: "A horizontal bar affords pushing. But this door opens by pulling. The affordance directly contradicts the required action.",
      },
      {
        x: "50%",
        y: "80%",
        type: "bad",
        title: "LABEL = DESIGN FAILURE",
        text: "Any door that needs a 'PUSH' or 'PULL' sign has already failed. Signs are admissions of defeat by the designer.",
      },
      {
        x: "25%",
        y: "30%",
        type: "good",
        title: "HINGE VISIBLE",
        text: "The visible hinge is a rare success — it signals which side is fixed, helping users predict the swing direction.",
      },
    ],
  },
  {
    name: "THE DESK LAMP",
    score: 8,
    verdict:
      "An example of thoughtful industrial design. The form suggests how it should be used: the angled shade directs light, the joint invites adjustment, and the switch provides clear feedback.",
    bars: [
      { label: "Affordance", val: 90, good: true },
      { label: "Signifiers", val: 85, good: true },
      { label: "Mapping", val: 80, good: true },
      { label: "Feedback", val: 75, good: true },
      { label: "Simplicity", val: 95, good: true },
    ],
    svg: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="240" rx="55" ry="8" fill="#222" opacity="0.6"/>
            <rect x="85" y="195" width="30" height="8" rx="3" fill="#555" stroke="#666"/>
            <ellipse cx="100" cy="196" rx="32" ry="6" fill="#666" stroke="#888" stroke-width="1"/>
            <rect x="96" y="100" width="8" height="96" fill="#666" stroke="#888" stroke-width="1"/>
            <circle cx="100" cy="100" r="10" fill="#777" stroke="#999" stroke-width="1.5"/>
            <line x1="100" y1="100" x2="148" y2="72" stroke="#888" stroke-width="8" stroke-linecap="round"/>
            <line x1="100" y1="100" x2="148" y2="72" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
            <polygon points="148,72 120,90 176,90" fill="#c8390e" stroke="#e8490e" stroke-width="1"/>
            <ellipse cx="148" cy="90" rx="28" ry="5" fill="#a8290e"/>
            <circle cx="148" cy="84" r="5" fill="#ffeeaa"/>
            <rect x="110" y="155" width="12" height="22" rx="3" fill="#333" stroke="#555"/>
            <rect x="113" y="158" width="6" height="8" rx="1" fill="#e8390e"/>
          </svg>`,
    dots: [
      {
        x: "72%",
        y: "35%",
        type: "good",
        title: "CONE AFFORDS DIRECTION",
        text: "The conical shade visually communicates 'light goes this way.' No label required. The form is the function.",
      },
      {
        x: "55%",
        y: "52%",
        type: "good",
        title: "JOINT AFFORDS ROTATION",
        text: "The visible pivot joint signals flexibility. Users intuitively grab and reposition — zero instruction needed.",
      },
      {
        x: "62%",
        y: "68%",
        type: "good",
        title: "TACTILE SWITCH",
        text: "A physical toggle with two distinct positions. Click feedback is immediate and unambiguous — on or off.",
      },
      {
        x: "54%",
        y: "82%",
        type: "bad",
        title: "CORD EXIT AMBIGUOUS",
        text: "Where does the cord exit the base? If unclear, the user struggles to position the lamp near an outlet.",
      },
    ],
  },
  {
    name: "THE SMART KETTLE",
    score: 4,
    verdict:
      "A simple task made unnecessarily complex. Boiling water does not require an app, multiple presets, or connectivity. The added features increase effort without improving the core function.",
    bars: [
      { label: "Affordance", val: 55, good: true },
      { label: "Signifiers", val: 25, good: false },
      { label: "Mapping", val: 30, good: false },
      { label: "Feedback", val: 40, good: false },
      { label: "Simplicity", val: 10, good: false },
    ],
    svg: `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="230" rx="55" ry="7" fill="#222" opacity="0.5"/>
            <rect x="55" y="60" width="90" height="165" rx="14" fill="#3a3a3a" stroke="#555" stroke-width="1.5"/>
            <rect x="62" y="70" width="76" height="120" rx="8" fill="#111" stroke="#333"/>
            <text x="100" y="110" text-anchor="middle" fill="#e8390e" font-family="Space Mono,monospace" font-size="7">WiFi ●</text>
            <text x="100" y="122" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Space Mono,monospace" font-size="6">60°  70°  80°</text>
            <text x="100" y="134" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Space Mono,monospace" font-size="6">90° 100° ECO</text>
            <text x="100" y="152" text-anchor="middle" fill="rgba(255,255,255,0.2)" font-family="Space Mono,monospace" font-size="5">Open App to Control</text>
            <rect x="140" y="120" width="22" height="60" rx="8" fill="#2a2a2a" stroke="#444"/>
            <rect x="50" y="110" width="8" height="16" rx="3" fill="#444"/>
            <ellipse cx="100" cy="62" rx="35" ry="6" fill="#555" stroke="#777"/>
          </svg>`,
    dots: [
      {
        x: "75%",
        y: "50%",
        type: "good",
        title: "HANDLE AFFORDS GRIP",
        text: "The handle shape correctly affords gripping and pouring. This single element works. Everything else struggles.",
      },
      {
        x: "52%",
        y: "55%",
        type: "bad",
        title: "6 TEMPERATURE MODES",
        text: "Six unlabelled temperature presets with no physical feedback. Users must guess, then verify on the app.",
      },
      {
        x: "52%",
        y: "65%",
        type: "bad",
        title: "APP DEPENDENCY",
        text: "Fraser's warning made real: when a kettle requires a software update to function, technology has become a hurdle.",
      },
      {
        x: "35%",
        y: "46%",
        type: "bad",
        title: "POWER BUTTON HIDDEN",
        text: "The most critical control — turn on/off — is flush with the body, indistinguishable from the casing by touch.",
      },
    ],
  },
];

let currentProduct = 0;

function loadProduct(idx, btn) {
  currentProduct = idx;
  document
    .querySelectorAll(".ptab")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProduct();
}

function renderProduct() {
  const p = products[currentProduct];
  const visual = document.getElementById("productVisual");

  // Build visual
  visual.innerHTML = `
          <div class="product-svg-wrap" style="position:relative; max-width:220px;">
            ${p.svg}
            ${p.dots
              .map(
                (d, i) => `
              <div class="annotation-dot ${d.type}" 
                   style="left:${d.x}; top:${
                  d.y
                }; transform:translate(-50%,-50%)">
                <div class="annotation-tooltip" style="
                  ${
                    parseFloat(d.x) > 60
                      ? "right:calc(100% + 12px); left:auto;"
                      : "left:calc(100% + 12px);"
                  }
                  top:50%; transform:translateY(-50%);
                ">
                  <strong class="${d.type}">${d.title}</strong>
                  ${d.text}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `;

  // Score + name
  document.getElementById("piScore").textContent = p.score;
  document.getElementById("piName").textContent = p.name;
  document.getElementById("piVerdict").textContent = p.verdict;

  // Bars
  const barsEl = document.getElementById("piBars");
  barsEl.innerHTML = p.bars
    .map(
      (b) => `
          <div class="pi-bar-row">
            <span class="pi-bar-label">${b.label}</span>
            <div class="pi-bar-track">
              <div class="pi-bar-fill ${b.good ? "good" : ""}" style="width:0%" 
                   data-target="${b.val}%"></div>
            </div>
            <span class="pi-bar-val">${b.val}</span>
          </div>
        `
    )
    .join("");

  // Animate bars
  requestAnimationFrame(() => {
    document.querySelectorAll(".pi-bar-fill").forEach((bar) => {
      bar.style.width = bar.dataset.target;
    });
  });
}

renderProduct();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CHECKLIST
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const checkItems = [
  {
    q: "Instant Clarity",
    desc: "Can you tell how the object works the moment you see it, without reading anything?",
    good: "You've found an affordance — the object communicates its use through form alone.",
    bad: "This is a design failure. Any object requiring study has already lost the user.",
  },
  {
    q: "Intuitive Controls",
    desc: "Are the controls placed where your hands naturally go, and do they move in logical directions?",
    good: "Natural mapping at work. The control layout mirrors how we expect the world to respond.",
    bad: "Arbitrary control placement. The designer didn't consider how users naturally interact.",
  },
  {
    q: "Immediate Feedback",
    desc: "Does every action produce an obvious, immediate response — sight, sound, or feel?",
    good: "Good feedback closes the gulf of evaluation. You always know if your action worked.",
    bad: "Silent systems breed uncertainty. Users repeat actions or give up entirely.",
  },
  {
    q: "No Manual Needed",
    desc: "Could someone who's never used this object operate it safely after 10 seconds?",
    good: "Self-documenting design — the gold standard. The object teaches itself.",
    bad: "An instruction manual is a confession of failure. The design did not communicate.",
  },
  {
    q: "Built to Last",
    desc: "Does this object feel like it was made to be repaired, not replaced?",
    good: "Fraser's ageless design philosophy embodied. Durability is an ethical choice.",
    bad: "Planned obsolescence. This object was designed to be discarded, not cherished.",
  },
];

const verdicts = [
  { title: "Keep Going", text: "Start clicking to evaluate the object." },
  {
    title: "One Passes",
    text: "A single principle holding on. This object is mostly fighting its user.",
  },
  {
    title: "Struggling",
    text: "Two principles holding. There is potential here, but the design is letting its user down.",
  },
  {
    title: "Mixed Results",
    text: "Halfway there. Some considered decisions, but gaps remain that will frustrate users daily.",
  },
  {
    title: "Well Designed",
    text: "Four principles met. This is a genuinely considered object — rare and worth celebrating.",
  },
  {
    title: "Design Excellence",
    text: "A perfect score. This object is self-evident, honest, and built to last. This is what we fight for.",
  },
];

let checked = new Set();

function renderChecklist() {
  const grid = document.getElementById("checklistGrid");
  grid.innerHTML = checkItems
    .map(
      (item, i) => `
          <div class="check-item ${
            checked.has(i) ? "checked" : ""
          }" onclick="toggleCheck(${i})">
            <div class="check-box"></div>
            <div>
              <div class="check-q">${item.q}</div>
              <div class="check-desc">${item.desc}</div>
            </div>
          </div>
        `
    )
    .join("");
}

function toggleCheck(i) {
  if (checked.has(i)) checked.delete(i);
  else checked.add(i);
  renderChecklist();
  updateCheckResult();
}

function updateCheckResult() {
  const n = checked.size;
  const resultEl = document.getElementById("checklistResult");
  resultEl.classList.add("visible");
  document.getElementById("crScore").textContent = `${n}/5`;
  const v = verdicts[n];
  document.getElementById(
    "crText"
  ).innerHTML = `<strong>${v.title}</strong>${v.text}`;
}

renderChecklist();

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         DESIGN AUDIT
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const auditCriteria = [
  {
    name: "Affordances",
    principle: "Norman · Principle 01",
    desc: "Does the form suggest its function?",
  },
  {
    name: "Signifiers",
    principle: "Norman · Principle 02",
    desc: "Are actions clearly communicated?",
  },
  {
    name: "Mapping",
    principle: "Norman · Principle 03",
    desc: "Do controls behave as expected?",
  },
  {
    name: "Feedback",
    principle: "Norman · Principle 04",
    desc: "Is every action confirmed?",
  },
  {
    name: "Sustainability",
    principle: "Fraser · Principle 01",
    desc: "Can it be repaired? Will it outlast trends?",
  },
];

const auditVerdicts = [
  {
    v: "UNRATED",
    t: "Rate the five principles to reveal your object's design quality score.",
  },
  {
    v: "CRITICAL FAILURE",
    t: "This object is fighting its user at every turn. A textbook case study in what not to do.",
  },
  {
    v: "POOR DESIGN",
    t: "Several fundamental principles are being violated. The user's frustration is the designer's responsibility.",
  },
  {
    v: "MEDIOCRE",
    t: "Some consideration given, but key principles are missing. The object succeeds despite itself.",
  },
  {
    v: "COMPETENT",
    t: "Most principles are met. This is a functional, considered object — above average in today's market.",
  },
  {
    v: "EXCELLENT",
    t: "Near-perfect. This object communicates clearly, behaves predictably, and respects its user's intelligence.",
  },
];

let ratings = [0, 0, 0, 0, 0];

function renderAudit() {
  const el = document.getElementById("auditCriteria");
  el.innerHTML = auditCriteria
    .map(
      (c, ci) => `
          <div class="audit-row">
            <div class="audit-row-header">
              <span class="audit-row-name">${c.name}</span>
              <span class="audit-row-principle">${c.principle}</span>
            </div>
            <div class="audit-stars">
              ${[1, 2, 3, 4, 5]
                .map(
                  (s) => `
                <div class="audit-star ${ratings[ci] >= s ? "lit" : ""}"
                     onclick="setRating(${ci}, ${s})"
                     title="${c.desc}">
                  ${s}
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
    )
    .join("");
}

function setRating(ci, val) {
  ratings[ci] = ratings[ci] === val ? 0 : val;
  renderAudit();
  updateGauge();
}

function updateGauge() {
  const total = ratings.reduce((a, b) => a + b, 0);
  const pct = total / 25;
  const circumference = 376;
  const offset = circumference - pct * circumference;
  document.getElementById("gaugeFill").style.strokeDashoffset = offset;
  document.getElementById("gaugeVal").textContent = total;

  // Colour shift
  const hue = Math.round(pct * 120); // red → green
  document.getElementById("gaugeFill").style.stroke =
    total === 0 ? "#e8390e" : `hsl(${hue}, 80%, 50%)`;

  // Verdict
  const rated = ratings.filter((r) => r > 0).length;
  let vi = 0;
  if (rated === 0) vi = 0;
  else if (total <= 7) vi = 1;
  else if (total <= 12) vi = 2;
  else if (total <= 17) vi = 3;
  else if (total <= 22) vi = 4;
  else vi = 5;
  document.getElementById("auditVerdict").textContent = auditVerdicts[vi].v;
  document.getElementById("auditVerdictText").textContent = auditVerdicts[vi].t;
}

function resetAudit() {
  ratings = [0, 0, 0, 0, 0];
  renderAudit();
  updateGauge();
}

renderAudit();
updateGauge();
