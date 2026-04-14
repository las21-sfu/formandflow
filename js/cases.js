// ============ MAIN 3D HUB ============
const container = document.getElementById("hub3d-container");
const canvas = document.getElementById("hub3d-canvas");

let scene, camera, renderer;
let isDragging = false;
let lastX, lastY;
let rotY = 0,
  rotX = 0;
let targetRotY = 0,
  targetRotX = 0;
let currentPrinciple = "affordance";

// State variables for interactions
let switchToggle = false;
let lockRotation = 0;
let buttonPressed = false;
let buttonPressTime = 0;
let pumpPressed = false;
let pumpPressTime = 0;

// Rotary Dial State
let dialRotation = 0;
let isDialing = false;
let dialStartAngle = 0;
let dialCurrentRotation = 0;
let dialTargetRotation = 0;
const DIAL_STOP_ANGLE = 2.5; // Radians where the finger stop is
let selectedNumMesh = null;
let numMeshes = [];

// Scene objects
let switchGroup, lockGroup, dialGroup, buttonGroup, bottleGroup;
let switchToggleMesh, camMesh, buttonMesh, dialPlate, pumpMesh;
let mainLight, ambientLight;

function initHub() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    45,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 6;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // Lighting
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  mainLight = new THREE.PointLight(0xffffff, 1.5, 100);
  mainLight.position.set(8, 8, 8);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const backLight = new THREE.PointLight(0xffffff, 0.3, 100);
  backLight.position.set(-8, -8, -8);
  scene.add(backLight);

  createHubModels();
  animateHub();
}

function createHubModels() {
  // 1. LIGHT SWITCH
  switchGroup = new THREE.Group();
  switchGroup.name = "affordance";

  const plateGeo = new THREE.BoxGeometry(1.2, 1.8, 0.15);
  const plateMat = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.4,
    metalness: 0.1,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.castShadow = true;
  plate.receiveShadow = true;
  switchGroup.add(plate);

  switchToggleMesh = new THREE.Group();
  const toggleGeo = new THREE.BoxGeometry(0.35, 0.7, 0.3);
  const toggleMat = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    roughness: 0.3,
    metalness: 0.2,
  });
  const toggle = new THREE.Mesh(toggleGeo, toggleMat);
  toggle.castShadow = true;
  toggle.receiveShadow = true;
  switchToggleMesh.add(toggle);
  switchToggleMesh.position.z = 0.15;
  switchGroup.add(switchToggleMesh);

  const hingeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16);
  const hingeMat = new THREE.MeshStandardMaterial({
    color: 0x555555,
    metalness: 0.8,
    roughness: 0.2,
  });
  const hinge = new THREE.Mesh(hingeGeo, hingeMat);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, 0, 0.15);
  hinge.castShadow = true;
  switchGroup.add(hinge);

  scene.add(switchGroup);

  // 2. CAM LOCK
  lockGroup = new THREE.Group();
  lockGroup.name = "constraint";

  const lockPlateGeo = new THREE.BoxGeometry(1, 1.5, 0.2);
  const lockPlateMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.5,
    metalness: 0.1,
  });
  const lockPlate = new THREE.Mesh(lockPlateGeo, lockPlateMat);
  lockPlate.castShadow = true;
  lockPlate.receiveShadow = true;
  lockGroup.add(lockPlate);

  const camBaseGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 32);
  const camBaseMat = new THREE.MeshStandardMaterial({
    color: 0x666666,
    metalness: 0.7,
    roughness: 0.3,
  });
  const camBase = new THREE.Mesh(camBaseGeo, camBaseMat);
  camBase.rotation.x = Math.PI / 2;
  camBase.position.z = 0.15;
  camBase.castShadow = true;
  lockGroup.add(camBase);

  camMesh = new THREE.Group();
  const camGeo = new THREE.BoxGeometry(0.25, 0.6, 0.1);
  const camMat = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    metalness: 0.8,
    roughness: 0.2,
  });
  const cam = new THREE.Mesh(camGeo, camMat);
  cam.castShadow = true;
  camMesh.add(cam);
  camMesh.position.set(0, 0, 0.2);
  lockGroup.add(camMesh);

  const latchGeo = new THREE.BoxGeometry(0.1, 0.3, 0.15);
  const latchMat = new THREE.MeshStandardMaterial({
    color: 0x444444,
    metalness: 0.6,
  });
  const latch = new THREE.Mesh(latchGeo, latchMat);
  latch.position.set(-0.3, 0, 0.2);
  latch.castShadow = true;
  lockGroup.add(latch);

  scene.add(lockGroup);

  // 3. ROTARY DIAL
  dialGroup = new THREE.Group();
  dialGroup.name = "mapping";

  // Base plate
  const baseDialGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 64);
  const baseDialMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.7,
  });
  const baseDialPlate = new THREE.Mesh(baseDialGeo, baseDialMat);
  baseDialPlate.rotation.x = Math.PI / 2;
  dialGroup.add(baseDialPlate);

  // Numbers on the base
  const numCanvas = document.createElement("canvas");
  numCanvas.width = 512;
  numCanvas.height = 512;
  const numCtx = numCanvas.getContext("2d");
  numCtx.clearRect(0, 0, 512, 512);
  numCtx.fillStyle = "white";
  numCtx.font = "bold 60px Arial";
  numCtx.textAlign = "center";
  numCtx.textBaseline = "middle";

  // Rotary phone numbers are usually 1-9, then 0
  // Positioned from approx 1 o'clock to 11 o'clock
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const startAngle = -Math.PI / 6; // 1 o'clock
  const stepAngle = Math.PI / 6;

  numbers.forEach((num, i) => {
    const angle = startAngle + i * stepAngle;
    // Invert Y for canvas coordinates
    const x = 256 + Math.cos(angle) * 180;
    const y = 256 - Math.sin(angle) * 180;
    numCtx.fillText(num.toString(), x, y);
  });

  // Create individual meshes for each number to allow lighting them up
  numMeshes = [];
  numbers.forEach((num, i) => {
    const angle = startAngle + i * stepAngle;
    const nCanvas = document.createElement("canvas");
    nCanvas.width = 128;
    nCanvas.height = 128;
    const nCtx = nCanvas.getContext("2d");
    nCtx.fillStyle = "white";
    nCtx.font = "bold 80px Arial";
    nCtx.textAlign = "center";
    nCtx.textBaseline = "middle";
    nCtx.fillText(num.toString(), 64, 64);

    const nTexture = new THREE.CanvasTexture(nCanvas);
    const nMat = new THREE.MeshStandardMaterial({
      map: nTexture,
      transparent: true,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 1,
    });
    const nGeo = new THREE.PlaneGeometry(0.4, 0.4);
    const nMesh = new THREE.Mesh(nGeo, nMat);
    nMesh.position.set(Math.cos(angle) * 1.0, Math.sin(angle) * 1.0, 0.06);
    nMesh.userData = { number: num };
    dialGroup.add(nMesh);
    numMeshes.push(nMesh);
  });

  // The rotating dial plate
  dialPlate = new THREE.Group();

  // Main wheel - using a RingGeometry to create actual holes
  // We'll create a custom shape with holes for the dial plate
  const shape = new THREE.Shape();
  shape.absarc(0, 0, 1.4, 0, Math.PI * 2, false);

  numbers.forEach((_, i) => {
    const angle = startAngle + i * stepAngle;
    const holePath = new THREE.Path();
    holePath.absarc(
      Math.cos(angle) * 1.0,
      Math.sin(angle) * 1.0,
      0.18,
      0,
      Math.PI * 2,
      true
    );
    shape.holes.push(holePath);
  });

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3,
  };
  const wheelGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const wheelMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.4,
    metalness: 0.2,
  });
  const wheel = new THREE.Mesh(wheelGeo, wheelMat);
  dialPlate.add(wheel);

  dialPlate.position.z = 0.15;
  dialGroup.add(dialPlate);

  // Finger stop
  const stopGeo = new THREE.BoxGeometry(0.1, 0.4, 0.2);
  const stopMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const stop = new THREE.Mesh(stopGeo, stopMat);
  // Position stop just after the '0'
  const stopAngle = startAngle + 10 * stepAngle;
  stop.position.set(Math.cos(stopAngle) * 1.1, Math.sin(stopAngle) * 1.1, 0.2);
  stop.rotation.z = stopAngle;
  dialGroup.add(stop);

  // Center cap
  const dialCapGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  const dialCapMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const dialCap = new THREE.Mesh(dialCapGeo, dialCapMat);
  dialCap.rotation.x = Math.PI / 2;
  dialCap.position.z = 0.25;
  dialGroup.add(dialCap);

  scene.add(dialGroup);

  // 4. FEEDBACK BUTTON
  buttonGroup = new THREE.Group();
  buttonGroup.name = "feedback";

  const boxGeo = new THREE.BoxGeometry(1.5, 1.5, 0.6);
  const boxMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5,
  });
  const box = new THREE.Mesh(boxGeo, boxMat);
  buttonGroup.add(box);

  buttonMesh = new THREE.Group();
  const btnGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32);
  const btnMat = new THREE.MeshStandardMaterial({
    color: 0x1e90ff,
    emissive: 0x000000,
  });
  const btn = new THREE.Mesh(btnGeo, btnMat);
  btn.rotation.x = Math.PI / 2;
  buttonMesh.add(btn);
  buttonMesh.position.z = 0.33;
  buttonGroup.add(buttonMesh);

  scene.add(buttonGroup);

  // 5. CONCEPTUAL MODEL (Soap Dispenser)
  bottleGroup = new THREE.Group();
  bottleGroup.name = "model";

  // Bottle Body
  const bodyGeo = new THREE.CylinderGeometry(0.7, 0.7, 1.8, 32);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.4,
    roughness: 0.1,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  bottleGroup.add(body);

  // Internal Tube
  const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.7, 16);
  const tubeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  tube.position.y = -0.05;
  bottleGroup.add(tube);

  // Pump Mechanism (Pressable)
  pumpMesh = new THREE.Group();

  // Pump Head
  const headGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
  const headMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const head = new THREE.Mesh(headGeo, headMat);
  pumpMesh.add(head);

  // Spout
  const spoutGeo = new THREE.BoxGeometry(0.5, 0.1, 0.15);
  const spout = new THREE.Mesh(spoutGeo, headMat);
  spout.position.set(0.3, 0, 0);
  pumpMesh.add(spout);

  // Pump Stem
  const stemGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16);
  const stem = new THREE.Mesh(stemGeo, headMat);
  stem.position.y = -0.3;
  pumpMesh.add(stem);

  pumpMesh.position.y = 1.2;
  bottleGroup.add(pumpMesh);

  // Bottle Cap
  const bottleCapGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.15, 32);
  const bottleCap = new THREE.Mesh(bottleCapGeo, headMat);
  bottleCap.position.y = 0.9;
  bottleGroup.add(bottleCap);

  scene.add(bottleGroup);

  // Hide all except current
  switchGroup.visible = true;
  lockGroup.visible = false;
  dialGroup.visible = false;
  buttonGroup.visible = false;
  bottleGroup.visible = false;
}

function animateHub() {
  requestAnimationFrame(animateHub);

  // Smooth rotation for the whole group based on mouse drag
  const targetGroup = scene.children.find((c) => c.name === currentPrinciple);
  if (targetGroup) {
    rotY += (targetRotY - rotY) * 0.1;
    rotX += (targetRotX - rotX) * 0.1;
    targetGroup.rotation.y = rotY;
    targetGroup.rotation.x = rotX;
  }

  // Interaction animations
  if (switchToggleMesh) {
    const targetRot = switchToggle ? -Math.PI / 4 : Math.PI / 4;
    switchToggleMesh.rotation.x +=
      (targetRot - switchToggleMesh.rotation.x) * 0.1;
    container.style.backgroundColor = switchToggle ? "#1a1a00" : "#000";
    ambientLight.intensity = switchToggle ? 0.8 : 0.5;
    mainLight.intensity = switchToggle ? 2.0 : 1.5;
  }

  if (camMesh) {
    camMesh.rotation.z += (lockRotation - camMesh.rotation.z) * 0.1;
  }

  // Rotary Dial Animation
  if (dialPlate) {
    if (isDialing) {
      dialPlate.rotation.z = dialCurrentRotation;
    } else {
      // Spring back to 0
      dialPlate.rotation.z += (0 - dialPlate.rotation.z) * 0.1;
      if (Math.abs(dialPlate.rotation.z) < 0.01) dialPlate.rotation.z = 0;
    }
  }

  if (buttonMesh && buttonPressed) {
    const timeSincePress = Date.now() - buttonPressTime;
    if (timeSincePress < 300) {
      buttonMesh.position.z = 0.28;
      buttonMesh.children[0].material.emissive.setHex(0xff69b4);
    } else {
      buttonPressed = false;
      buttonMesh.position.z = 0.33;
      buttonMesh.children[0].material.emissive.setHex(0x000000);
    }
  }

  if (pumpMesh && pumpPressed) {
    const timeSincePress = Date.now() - pumpPressTime;
    if (timeSincePress < 300) {
      pumpMesh.position.y = 1.05;
    } else {
      pumpPressed = false;
      pumpMesh.position.y = 1.2;
    }
  }

  document.getElementById("hib-rotation").textContent =
    Math.round(((((rotY * 180) / Math.PI) % 360) + 360) % 360) + "°";

  renderer.render(scene, camera);
}

function activatePrinciple(name, btn) {
  currentPrinciple = name;
  rotY = 0;
  rotX = 0;
  targetRotY = 0;
  targetRotX = 0;

  document
    .querySelectorAll(".hub-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const principles = {
    affordance: {
      title: "AFFORDANCES",
      desc: "Affordances are the properties of an object that suggest how it can be used. This light switch has a clear handle that invites you to pull it up or down. The shape and texture of the switch communicate its function without needing additional instructions. Good affordances make products intuitive and easy to use at a glance.",
      hint: "→ Click the switch to toggle the light",
      interaction: "Click to toggle switch",
    },
    constraint: {
      title: "CONSTRAINTS",
      desc: "Constraints are the guardrails of design that narrow your choices to only the correct ones. This lock utilizes a physical barrier to ensure the latch can only exist in two states: open or closed. The way to make a product easy to use is to make it physically impossible to do the wrong thing.",
      hint: "→ Click the lock to rotate the cam",
      interaction: "Click to rotate cam",
    },
    mapping: {
      title: "MAPPING",
      desc: "Mapping is the  relationship between a control—like this wheel—and the result it produces in the world. This rotary dial uses a spatial analogy where each hole corresponds to a specific digit, creating a mental link for the user. As you rotate the wheel against the spring tension toward the mechanical stop, the physical motion mimics the procedural step of entering a number. When the wheel returns to its home position, it provides a natural sequence that makes the interaction feel like a continuous, understandable story. Natural mapping ensures that your intentions lead directly to the desired actions without any confusing detours.",
      hint: "→ Drag a hole clockwise to the stop to pick a number",
      interaction: "Drag to dial",
    },
    feedback: {
      title: "FEEDBACK",
      desc: " Feedback is the confirmation that your action has been received by the product, removing any doubt from the user's mind. When you press this button, it shifts from blue to a bright glow. Without this signal, users might repeat the action or wonder if the machine has stopped working altogether. Effective feedback must be both immediate and obvious.",
      hint: "→ Click the button to see it light up",
      interaction: "Click the button",
    },
    model: {
      title: "CONCEPTUAL MODELS",
      desc: "A conceptual model is the mental map you form to predict how a device will behave based on its visible image. By revealing the internal tube and pump mechanism through this blueprint view, the soap bottle explains its own internal logic.  You can see exactly how the pressure from your hand will force the liquid up the tube, turning a mystery into a simple mechanical story. When a product provides a coherent model, you can figure out what to do even when something goes slightly wrong.",
      hint: "→ Click the pump to dispense soap",
      interaction: "Click to pump",
    },
  };

  const p = principles[name];
  document.getElementById("pp-title").textContent = p.title;
  document.getElementById("pp-desc").textContent = p.desc;
  document.getElementById("pp-hint").textContent = p.hint;
  document.getElementById("hib-principle").textContent = p.title;
  document.getElementById("hib-interaction").textContent = p.interaction;

  switchGroup.visible = name === "affordance";
  lockGroup.visible = name === "constraint";
  dialGroup.visible = name === "mapping";
  buttonGroup.visible = name === "feedback";
  bottleGroup.visible = name === "model";

  switchToggle = false;
  lockRotation = 0;
  buttonPressed = false;
  dialPlate.rotation.z = 0;
  isDialing = false;

  ambientLight.intensity = 0.5;
  mainLight.intensity = 1.5;
  container.style.backgroundColor = "#000";
}

// Interaction
container.addEventListener("mousedown", (e) => {
  if (currentPrinciple === "mapping") {
    // Check if we clicked near a hole
    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
    const intersects = raycaster.intersectObject(dialPlate, true);

    if (intersects.length > 0) {
      isDialing = true;
      // Calculate start angle relative to dial center
      const point = intersects[0].point;
      dialStartAngle = Math.atan2(point.y, point.x);
      dialCurrentRotation = dialPlate.rotation.z;
      return;
    }
  }

  isDragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener("mousemove", (e) => {
  if (isDialing) {
    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

    // Project mouse onto the plane of the dial
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -0.15);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    const currentAngle = Math.atan2(intersectPoint.y, intersectPoint.x);
    let delta = currentAngle - dialStartAngle;

    // Normalize delta
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;

    // Only allow clockwise rotation (negative in Three.js standard)
    if (delta < 0) {
      dialCurrentRotation = delta;
      // Limit rotation to the stop (approx 300 degrees)
      if (dialCurrentRotation < -5.2) dialCurrentRotation = -5.2;
    }
    return;
  }

  if (!isDragging) return;
  const deltaX = e.clientX - lastX;
  const deltaY = e.clientY - lastY;
  targetRotY += deltaX * 0.01;
  targetRotX += deltaY * 0.01;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener("mouseup", () => {
  if (isDialing) {
    // Determine which number was dialed based on rotation
    const step = Math.PI / 6;
    const rotationDegrees = Math.abs(dialCurrentRotation);
    const numIndex = Math.round(rotationDegrees / step);
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const dialed =
      numbers[numIndex - 1] !== undefined ? numbers[numIndex - 1] : null;

    if (dialed !== null) {
      document.getElementById(
        "hib-interaction"
      ).textContent = `Dialed: ${dialed}`;

      // Light up the selected number
      numMeshes.forEach((mesh) => {
        if (mesh.userData.number === dialed) {
          mesh.material.emissive.setHex(0x1e90ff);
          mesh.material.color.setHex(0x1e90ff);
          // Reset after a delay
          setTimeout(() => {
            mesh.material.emissive.setHex(0x000000);
            mesh.material.color.setHex(0xffffff);
          }, 1500);
        }
      });
    }
  }
  isDragging = false;
  isDialing = false;
});

container.addEventListener("click", (e) => {
  if (isDragging || isDialing) return;

  if (currentPrinciple === "affordance") {
    switchToggle = !switchToggle;
    document.getElementById("hib-interaction").textContent = switchToggle
      ? "Switch ON — Light activated!"
      : "Switch OFF";
  } else if (currentPrinciple === "constraint") {
    lockRotation = lockRotation === 0 ? Math.PI / 2 : 0;
    document.getElementById("hib-interaction").textContent =
      lockRotation === 0 ? "Lock CLOSED" : "Lock OPEN";
  } else if (currentPrinciple === "feedback") {
    buttonPressed = true;
    buttonPressTime = Date.now();
    document.getElementById("hib-interaction").textContent =
      "Button PRESSED — Feedback confirmed!";
  } else if (currentPrinciple === "model") {
    pumpPressed = true;
    pumpPressTime = Date.now();
    document.getElementById("hib-interaction").textContent =
      "Pump PRESSED — Soap dispensed!";
  }
});

window.addEventListener("resize", () => {
  camera.aspect = container.offsetWidth / container.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.offsetWidth, container.offsetHeight);
});

initHub();

// ============ ANATOMY 3D SCENES ============
const anatomyScenes = [];

function initAnatomyScene(canvasId, sceneType) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.offsetWidth / canvas.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 50);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  let group = new THREE.Group();

  if (sceneType === 0) {
    const screenGeo = new THREE.BoxGeometry(1.5, 2, 0.1);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      roughness: 0.9,
      metalness: 0.1,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    group.add(screen);

    const touchGeo = new THREE.BoxGeometry(0.8, 0.8, 0.12);
    const touchMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0x000000,
    });
    const touch = new THREE.Mesh(touchGeo, touchMat);
    touch.position.z = 0.1;
    group.add(touch);
  } else if (sceneType === 1) {
    const sliderGeo = new THREE.BoxGeometry(0.3, 1.5, 0.15);
    const sliderMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      metalness: 0.7,
    });
    const slider = new THREE.Mesh(sliderGeo, sliderMat);
    slider.position.x = -0.8;
    group.add(slider);

    const thumbGeo = new THREE.BoxGeometry(0.4, 0.15, 0.2);
    const thumbMat = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      metalness: 0.8,
    });
    const thumb = new THREE.Mesh(thumbGeo, thumbMat);
    thumb.position.x = -0.8;
    thumb.position.y = 0.3;
    thumb.position.z = 0.1;
    group.add(thumb);

    const indicatorGeo = new THREE.BoxGeometry(1.2, 0.1, 0.15);
    const indicatorMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      metalness: 0.6,
    });
    const indicator = new THREE.Mesh(indicatorGeo, indicatorMat);
    indicator.position.x = 0.3;
    indicator.position.y = -0.5;
    group.add(indicator);

    const barGeo = new THREE.BoxGeometry(0.3, 0.08, 0.1);
    const barMat = new THREE.MeshStandardMaterial({
      color: 0x1e90ff,
      metalness: 0.7,
    });
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.x = 0.3;
    bar.position.y = -0.5;
    bar.position.z = 0.1;
    group.add(bar);
  } else if (sceneType === 2) {
    const deviceGeo = new THREE.BoxGeometry(1.2, 1.8, 0.2);
    const deviceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      metalness: 0.3,
    });
    const device = new THREE.Mesh(deviceGeo, deviceMat);
    group.add(device);

    for (let i = 0; i < 5; i++) {
      const smudgeGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const smudgeMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        transparent: true,
        opacity: 0.4,
      });
      const smudge = new THREE.Mesh(smudgeGeo, smudgeMat);
      smudge.position.set(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.2,
        0.15
      );
      smudge.scale.set(1, 0.3, 0.3);
      group.add(smudge);
    }
  } else if (sceneType === 3) {
    const deviceGeo = new THREE.BoxGeometry(1.2, 1.8, 0.2);
    const deviceMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.5,
    });
    const device = new THREE.Mesh(deviceGeo, deviceMat);
    group.add(device);

    const screenGeo = new THREE.BoxGeometry(1, 1.5, 0.12);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x000000,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.15;
    group.add(screen);
  }

  scene.add(group);

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  animate();
  anatomyScenes.push({ scene, camera, renderer });
}

for (let i = 0; i < 4; i++) {
  initAnatomyScene(`anatomy-canvas-${i}`, i);
}

const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
