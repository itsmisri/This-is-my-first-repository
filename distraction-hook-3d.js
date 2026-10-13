/**
 * Distraction Hook — Interactive 360° 3D Artefact
 * Built with Three.js (WebGL)
 * Transparent background preserving the website's dark cyber-aesthetic
 */

(function () {
  'use strict';

  var container = document.getElementById('hook3dCanvasContainer');
  if (!container) return;

  // Verify THREE is available
  if (typeof THREE === 'undefined') {
    console.error('Three.js library is not loaded.');
    return;
  }

  // 1. Scene, Camera, Renderer Setup
  var scene = new THREE.Scene();

  var width = container.clientWidth || 560;
  var height = container.clientHeight || 640;

  var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  // Default camera angle: slightly elevated front-three-quarter view
  camera.position.set(2.4, 1.4, 4.2);

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); // 100% transparent background
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  container.appendChild(renderer.domElement);

  // 2. Orbit Controls
  var controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.enableZoom = true;
    controls.minDistance = 2.2;
    controls.maxDistance = 7.5;
    controls.minPolarAngle = Math.PI * 0.15; // 27 deg from top
    controls.maxPolarAngle = Math.PI * 0.82; // 148 deg from bottom
    controls.target.set(0, 0.5, 0);
  }

  // Pause auto-rotation and fade out drag hint when user interacts
  var autoRotateTimeout;
  var hintEl = document.getElementById('artefactHint');
  function pauseAutoRotate() {
    if (hintEl) hintEl.style.opacity = '0';
    if (!controls) return;
    controls.autoRotate = false;
    clearTimeout(autoRotateTimeout);
    autoRotateTimeout = setTimeout(function () {
      controls.autoRotate = true;
    }, 3800);
  }
  renderer.domElement.addEventListener('pointerdown', pauseAutoRotate);
  renderer.domElement.addEventListener('wheel', pauseAutoRotate, { passive: true });

  // 3. Materials
  // Matte black body material (satin finish 3D printed / CNC acrylic)
  var bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1b22,
    roughness: 0.40,
    metalness: 0.15,
  });

  // Brushed aluminum silver for ultrasonic sensor barrels
  var metalSilverMaterial = new THREE.MeshStandardMaterial({
    color: 0xdce2ec,
    metalness: 0.90,
    roughness: 0.22,
  });

  // Dark speaker mesh inside sensor eyes
  var sensorMeshMaterial = new THREE.MeshStandardMaterial({
    color: 0x111317,
    roughness: 0.85,
    metalness: 0.3,
  });

  // Glossy sensor mounting plate
  var sensorPlateMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f1014,
    roughness: 0.25,
    metalness: 0.35,
  });

  // LED materials (Translucent with vibrant emissive bloom)
  var ledRedMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3b30,
    emissive: 0xff1e10,
    emissiveIntensity: 1.4,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.95
  });

  var ledYellowMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb703,
    emissive: 0xffa000,
    emissiveIntensity: 1.4,
    roughness: 0.15,
    metalness: 0.05,
    transparent: true,
    opacity: 0.95
  });

  var ledBezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x33353e,
    metalness: 0.8,
    roughness: 0.3
  });

  // Lamp shade material (matte industrial black)
  var shadeMaterial = new THREE.MeshStandardMaterial({
    color: 0x141519,
    roughness: 0.5,
    metalness: 0.25,
    side: THREE.DoubleSide
  });

  // Bulb glow material
  var bulbMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff6dd,
    emissive: 0xffeed0,
    emissiveIntensity: 2.5,
    roughness: 0.1
  });

  // 4. Artefact Assembly Group (can rotate together)
  var artefactGroup = new THREE.Group();
  scene.add(artefactGroup);

  // --- A. Main Stand Body ---
  var profileShape = new THREE.Shape();
  // Profile in (shapeX: Z-depth, shapeY: Y-height)
  // Back wall:
  profileShape.moveTo(-0.75, -1.25);
  profileShape.lineTo(-0.75, 1.25);
  // Top flat surface:
  profileShape.lineTo(-0.30, 1.25);
  // Front slanted face:
  profileShape.lineTo(0.50, -0.75);
  // Phone cradle shelf groove:
  profileShape.quadraticCurveTo(0.64, -0.88, 0.74, -0.78);
  // Upturned front lip:
  profileShape.quadraticCurveTo(0.88, -0.62, 0.91, -0.66);
  // Lip rounded nose:
  profileShape.quadraticCurveTo(0.94, -0.76, 0.86, -1.05);
  // Bottom-front corner:
  profileShape.lineTo(0.68, -1.25);
  // Base bottom back to start:
  profileShape.lineTo(-0.75, -1.25);

  var extrudeSettings = {
    steps: 2,
    depth: 1.85,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.025,
    bevelOffset: 0,
    bevelSegments: 4
  };

  var standGeometry = new THREE.ExtrudeGeometry(profileShape, extrudeSettings);
  standGeometry.center();
  // Rotate so extrusion is along X, front lip is at +Z
  standGeometry.rotateY(-Math.PI / 2);

  var standMesh = new THREE.Mesh(standGeometry, bodyMaterial);
  standMesh.castShadow = true;
  standMesh.receiveShadow = true;
  artefactGroup.add(standMesh);

  // --- B. Slanted Face Features & Ultrasonic Sensor ---
  // Midpoint of slanted face: Z = 0.015, Y = 0.25. Slant angle theta ≈ 21.8 deg.
  var theta = Math.atan(0.40); // 0.3805 rad
  var faceGroup = new THREE.Group();
  faceGroup.position.set(0, 0.25, 0.015);
  faceGroup.rotation.x = -theta;
  artefactGroup.add(faceGroup);

  // Horizontal panel seam divider lines (giving the authentic layered design)
  var seamMaterial = new THREE.MeshStandardMaterial({
    color: 0x090a0d,
    roughness: 0.8,
    metalness: 0.1
  });
  [-0.48, 0.48].forEach(function (yOffset) {
    var seam = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 0.022, 0.018),
      seamMaterial
    );
    seam.position.set(0, yOffset, 0.01);
    faceGroup.add(seam);
  });

  // Ultrasonic sensor mounting backing plate
  var sensorPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 0.44, 0.04),
    sensorPlateMaterial
  );
  sensorPlate.position.set(0, 0, 0.02);
  faceGroup.add(sensorPlate);

  // Two ultrasonic sensor cylinders ("eyes")
  var eyeRadius = 0.165;
  var eyeLength = 0.16;

  [-0.26, 0.26].forEach(function (xPos) {
    var eyeGroup = new THREE.Group();
    eyeGroup.position.set(xPos, 0, 0.04);

    // Cylindrical barrel
    var barrelGeom = new THREE.CylinderGeometry(eyeRadius, eyeRadius, eyeLength, 32);
    barrelGeom.rotateX(Math.PI / 2);
    var barrel = new THREE.Mesh(barrelGeom, metalSilverMaterial);
    barrel.position.z = eyeLength / 2;
    barrel.castShadow = true;
    eyeGroup.add(barrel);

    // Outer chamfer ring
    var rimGeom = new THREE.TorusGeometry(eyeRadius, 0.018, 16, 32);
    var rim = new THREE.Mesh(rimGeom, metalSilverMaterial);
    rim.position.z = eyeLength;
    eyeGroup.add(rim);

    // Dark speaker mesh interior
    var meshGeom = new THREE.CircleGeometry(eyeRadius * 0.88, 32);
    var meshDisc = new THREE.Mesh(meshGeom, sensorMeshMaterial);
    meshDisc.position.z = eyeLength + 0.002;
    eyeGroup.add(meshDisc);

    // Center transducer electrode
    var centerGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    centerGeom.rotateX(Math.PI / 2);
    var centerDot = new THREE.Mesh(centerGeom, new THREE.MeshStandardMaterial({
      color: 0x1f2025,
      roughness: 0.3
    }));
    centerDot.position.z = eyeLength + 0.01;
    eyeGroup.add(centerDot);

    faceGroup.add(eyeGroup);
  });

  // --- C. Top Indicator LEDs ---
  var topY = 1.255;
  var topZ = -0.61;
  var ledPositions = [
    { x: -0.45, mat: ledRedMaterial, color: 0xff3b30 },
    { x: -0.15, mat: ledYellowMaterial, color: 0xffb703 },
    { x: 0.15, mat: ledYellowMaterial, color: 0xffb703 },
    { x: 0.45, mat: ledRedMaterial, color: 0xff3b30 }
  ];

  var ledLights = [];

  ledPositions.forEach(function (led) {
    var ledGroup = new THREE.Group();
    ledGroup.position.set(led.x, topY, topZ);

    // Base collar
    var collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.054, 0.03, 16),
      ledBezelMaterial
    );
    collar.position.y = 0.015;
    ledGroup.add(collar);

    // LED bulb body (cylinder + rounded dome top)
    var bulbCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.065, 16),
      led.mat
    );
    bulbCylinder.position.y = 0.06;
    ledGroup.add(bulbCylinder);

    var bulbDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      led.mat
    );
    bulbDome.position.y = 0.092;
    ledGroup.add(bulbDome);

    // Local point light for colored bounce
    var pLight = new THREE.PointLight(led.color, 0.7, 0.85);
    pLight.position.y = 0.14;
    ledGroup.add(pLight);
    ledLights.push(pLight);

    artefactGroup.add(ledGroup);
  });

  // --- D. Overhead Hanging Lamp & Dramatic Volumetric Beam ---
  var lampY = 2.62;
  var lampZ = -0.61;
  var lampGroup = new THREE.Group();
  lampGroup.position.set(0, lampY, lampZ);
  artefactGroup.add(lampGroup);

  // Suspension Cord extending upwards
  var cord = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.01, 2.8, 12),
    new THREE.MeshStandardMaterial({ color: 0x0f1013, roughness: 0.6 })
  );
  cord.position.y = 1.4;
  lampGroup.add(cord);

  // Conical Lamp Shade
  var shadeGeom = new THREE.CylinderGeometry(0.07, 0.42, 0.28, 32, 1, true);
  var shade = new THREE.Mesh(shadeGeom, shadeMaterial);
  shade.position.y = 0;
  lampGroup.add(shade);

  // Top finial ring on shade
  var finial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0x22242b, roughness: 0.3 })
  );
  finial.position.y = 0.14;
  lampGroup.add(finial);

  // Glowing bulb inside shade
  var bulb = new THREE.Mesh(
    new THREE.SphereGeometry(0.088, 24, 24),
    bulbMaterial
  );
  bulb.position.y = -0.06;
  lampGroup.add(bulb);

  // Downward warm spotlight illuminating the device
  var spotLight = new THREE.SpotLight(0xfffaec, 2.6, 10, Math.PI / 4.4, 0.38, 1.1);
  spotLight.position.set(0, -0.06, 0);
  spotLight.target.position.set(0, -2.0, 0.15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 0.2;
  spotLight.shadow.camera.far = 8;
  spotLight.shadow.bias = -0.001;
  lampGroup.add(spotLight);
  lampGroup.add(spotLight.target);

  // Volumetric Light Ray Cone Mesh (matches p01_img1.png atmospheric cone beam)
  var coneBeamGeom = new THREE.ConeGeometry(0.85, 1.8, 32, 1, true);
  coneBeamGeom.rotateX(Math.PI); // Open end downwards
  coneBeamGeom.translate(0, -0.9, 0);

  var coneBeamMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe699,
    transparent: true,
    opacity: 0.13,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  var coneBeam = new THREE.Mesh(coneBeamGeom, coneBeamMaterial);
  lampGroup.add(coneBeam);

  // --- E. Ambient & Studio Lighting ---
  var ambLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambLight);

  // Cyan rim light from front-left (complements website theme)
  var cyanRim = new THREE.DirectionalLight(0x00e5ff, 0.65);
  cyanRim.position.set(-3.5, 2.0, 2.5);
  scene.add(cyanRim);

  // Soft purple backlight for subtle depth contrast
  var purpleFill = new THREE.DirectionalLight(0x7b2fff, 0.35);
  purpleFill.position.set(2.5, 1.5, -3.0);
  scene.add(purpleFill);

  // Key light from top right for crisp chamfer highlights
  var keyLight = new THREE.DirectionalLight(0xffffff, 0.55);
  keyLight.position.set(3.0, 4.0, 3.5);
  scene.add(keyLight);

  // Subtle ground shadow plane to ground the artefact
  var shadowPlaneGeom = new THREE.PlaneGeometry(3.5, 3.5);
  var shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 128;
  var sCtx = shadowCanvas.getContext('2d');
  var sGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
  sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
  sGrad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
  sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 128, 128);

  var shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  var shadowMesh = new THREE.Mesh(
    shadowPlaneGeom,
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    })
  );
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -1.26;
  artefactGroup.add(shadowMesh);

  // 5. Interactive UI Toolbar Actions
  var btnReset = document.getElementById('btnResetView');
  if (btnReset) {
    btnReset.addEventListener('click', function () {
      if (controls) {
        controls.reset();
        camera.position.set(2.4, 1.4, 4.2);
        controls.target.set(0, 0.5, 0);
        controls.update();
        controls.autoRotate = true;
      }
    });
  }

  var btnLamp = document.getElementById('btnToggleLamp');
  if (btnLamp) {
    var lampOn = true;
    btnLamp.addEventListener('click', function () {
      lampOn = !lampOn;
      spotLight.visible = lampOn;
      coneBeam.visible = lampOn;
      bulbMaterial.emissiveIntensity = lampOn ? 2.5 : 0.2;
      btnLamp.classList.toggle('active', lampOn);
    });
  }

  var btnAlert = document.getElementById('btnTriggerLed');
  if (btnAlert) {
    btnAlert.addEventListener('click', function () {
      triggerLedAlert();
    });
  }

  var alertAnimationActive = false;
  function triggerLedAlert() {
    if (alertAnimationActive) return;
    alertAnimationActive = true;
    var startTime = performance.now();
    var origRedInt = ledRedMaterial.emissiveIntensity;
    var origYelInt = ledYellowMaterial.emissiveIntensity;

    function flashLoop(now) {
      var elapsed = now - startTime;
      if (elapsed > 2400) {
        ledRedMaterial.emissiveIntensity = origRedInt;
        ledYellowMaterial.emissiveIntensity = origYelInt;
        ledLights.forEach(function (l) { l.intensity = 0.7; });
        alertAnimationActive = false;
        return;
      }
      var pulse = (Math.sin(elapsed * 0.02) + 1) / 2;
      ledRedMaterial.emissiveIntensity = 0.5 + pulse * 2.8;
      ledYellowMaterial.emissiveIntensity = 0.5 + (1 - pulse) * 2.8;
      ledLights.forEach(function (l, idx) {
        l.intensity = idx % 2 === 0 ? 0.3 + pulse * 1.5 : 0.3 + (1 - pulse) * 1.5;
      });
      requestAnimationFrame(flashLoop);
    }
    requestAnimationFrame(flashLoop);
  }

  // 6. Responsive Resize Handling
  function onResize() {
    if (!container) return;
    var newW = container.clientWidth;
    var newH = container.clientHeight;
    if (newW === 0 || newH === 0) return;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  }

  window.addEventListener('resize', onResize);
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(onResize);
    ro.observe(container);
  }

  // 7. Animation Loop
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();
    var time = clock.getElapsedTime();

    // Subtle gentle breathing pulse on the indicator LEDs when idle
    if (!alertAnimationActive) {
      var subtlePulse = Math.sin(time * 2.2) * 0.25;
      ledRedMaterial.emissiveIntensity = 1.35 + subtlePulse;
      ledYellowMaterial.emissiveIntensity = 1.35 + subtlePulse;
    }

    // Subtle atmospheric shimmer on the volumetric cone
    if (coneBeam && coneBeam.visible) {
      coneBeamMaterial.opacity = 0.12 + Math.sin(time * 1.6) * 0.025;
    }

    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  animate();

})();
