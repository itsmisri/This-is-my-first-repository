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

  var camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
  // Default camera angle: slightly elevated front-three-quarter view with generous clearance
  camera.position.set(2.1, 0.7, 3.8);

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

  // 2. Orbit Controls — Full 360° Rotation
  var controls;
  if (typeof THREE.OrbitControls !== 'undefined') {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.85;
    controls.enableZoom = false; // No zoom — rotate only
    controls.enablePan = false; // Keeps the model centered when orbiting
    controls.minPolarAngle = Math.PI * 0.12; // Allows top-down inspection
    controls.maxPolarAngle = Math.PI * 0.85; // Allows looking from below
    controls.target.set(0, 0, 0); // Center of scaled model
  }

  // Pause auto-rotation when user moves or touches the model, resuming after idle
  var autoRotateTimeout;
  function pauseAutoRotate() {
    if (!controls) return;
    controls.autoRotate = false;
    clearTimeout(autoRotateTimeout);
    autoRotateTimeout = setTimeout(function () {
      controls.autoRotate = true;
    }, 4000);
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

  // LED metallic bezels/collars
  var ledBezelMaterial = new THREE.MeshStandardMaterial({
    color: 0x33353e,
    metalness: 0.8,
    roughness: 0.3
  });

  // 4. Artefact Assembly Group
  var artefactGroup = new THREE.Group();
  artefactGroup.scale.set(0.72, 0.72, 0.72);
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
  var theta = Math.atan(0.40); // Slant angle ≈ 21.8 deg
  var faceGroup = new THREE.Group();
  faceGroup.position.set(0, 0.25, 0.015);
  faceGroup.rotation.x = -theta;
  artefactGroup.add(faceGroup);

  // Horizontal panel seam divider lines
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

  // --- C. Top Indicator Flickering LEDs ---
  var topY = 1.255;
  var topZ = -0.61;

  var ledConfigs = [
    { x: -0.45, color: 0xff3b30, emissive: 0xff2010, phase: 0.0, speed: 1.0 },
    { x: -0.15, color: 0xffb703, emissive: 0xff9900, phase: 1.8, speed: 1.15 },
    { x:  0.15, color: 0xffb703, emissive: 0xff9900, phase: 3.5, speed: 0.92 },
    { x:  0.45, color: 0xff3b30, emissive: 0xff2010, phase: 5.2, speed: 1.08 }
  ];

  var activeLeds = [];

  ledConfigs.forEach(function (cfg) {
    var ledGroup = new THREE.Group();
    ledGroup.position.set(cfg.x, topY, topZ);

    // Base collar
    var collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.054, 0.03, 16),
      ledBezelMaterial
    );
    collar.position.y = 0.015;
    ledGroup.add(collar);

    // Individual standard material so each LED flickers dynamically
    var ledMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      emissive: cfg.emissive,
      emissiveIntensity: 1.6,
      roughness: 0.15,
      metalness: 0.05,
      transparent: true,
      opacity: 0.95
    });

    // LED bulb body (cylinder + rounded dome top)
    var bulbCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.042, 0.042, 0.065, 16),
      ledMat
    );
    bulbCylinder.position.y = 0.06;
    ledGroup.add(bulbCylinder);

    var bulbDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      ledMat
    );
    bulbDome.position.y = 0.092;
    ledGroup.add(bulbDome);

    // Local point light for dynamic colored bounce onto the stand top
    var pLight = new THREE.PointLight(cfg.color, 0.85, 1.0);
    pLight.position.y = 0.14;
    ledGroup.add(pLight);

    activeLeds.push({
      material: ledMat,
      pointLight: pLight,
      phase: cfg.phase,
      speed: cfg.speed
    });

    artefactGroup.add(ledGroup);
  });

  // --- D. Studio Lighting Setup (Spotlight removed, clean high-end studio lighting) ---
  var ambLight = new THREE.AmbientLight(0xffffff, 0.72);
  scene.add(ambLight);

  // Key directional light from top right front for sharp chamfers and depth
  var keyLight = new THREE.DirectionalLight(0xffffff, 1.15);
  keyLight.position.set(3.0, 4.0, 3.5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 10;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Soft fill light from front left to illuminate shadows
  var fillLight = new THREE.DirectionalLight(0xdde8f8, 0.55);
  fillLight.position.set(-3.0, 2.0, 2.5);
  scene.add(fillLight);

  // Cyan theme rim accent light
  var cyanRim = new THREE.DirectionalLight(0x00e5ff, 0.6);
  cyanRim.position.set(-3.2, 2.2, -2.0);
  scene.add(cyanRim);

  // Purple rim accent light
  var purpleRim = new THREE.DirectionalLight(0x7b2fff, 0.4);
  purpleRim.position.set(2.8, 1.8, -2.5);
  scene.add(purpleRim);

  // Soft top overhead light for the top plate bevels
  var topLight = new THREE.DirectionalLight(0xffffff, 0.45);
  topLight.position.set(0, 4.2, 0.4);
  scene.add(topLight);

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

  // --- E. Dynamic Flickering Light Algorithm ---
  function calculateFlicker(time, phaseOffset, speed) {
    var t = time * speed * 2.6 + phaseOffset;

    // 1. Rapid diode micro-jitter (electrical frequency fluctuations)
    var jitter1 = Math.sin(t * 19.3);
    var jitter2 = Math.sin(t * 37.7);
    var jitter3 = Math.cos(t * 7.1);
    var microJitter = jitter1 * 0.4 + jitter2 * 0.35 + jitter3 * 0.25;

    // 2. Notification alert burst cycle (~2.2s periodicity)
    var cycle = (t * 0.8) % (Math.PI * 2);
    var burst = 0;

    if (cycle < 0.7) {
      // Rapid staccato double/triple flash pattern
      var flash = Math.sin(cycle * (Math.PI / 0.7) * 3);
      burst = flash > 0 ? flash * 1.7 : -0.25;
    } else if (cycle > 1.8 && cycle < 2.3) {
      // Quick irregular tremor / alert stutter
      var stutter = Math.sin((cycle - 1.8) * 24.0);
      burst = stutter > 0.2 ? 0.95 : -0.4;
    } else if (cycle > 3.8 && cycle < 4.2) {
      // Intense alert ping flare
      burst = Math.sin((cycle - 3.8) * (Math.PI / 0.4)) * 1.4;
    }

    // 3. Occasional spontaneous micro-spark
    var spark = Math.sin(t * 43.0) > 0.88 ? (Math.random() * 0.7 - 0.2) : 0;

    // Base brightness oscillates between dim flicker (0.25) and intense flare (3.4)
    var intensity = 1.35 + microJitter * 0.6 + burst + spark;
    return Math.max(0.2, Math.min(3.4, intensity));
  }

  // 5. Responsive Resize Handling
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

  // 6. Animation Loop
  var clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    var time = clock.getElapsedTime();

    // Dynamically flicker all indicator lights and their bounce illumination
    for (var i = 0; i < activeLeds.length; i++) {
      var led = activeLeds[i];
      var intensity = calculateFlicker(time, led.phase, led.speed);
      led.material.emissiveIntensity = intensity;
      led.pointLight.intensity = intensity * 0.65;
    }

    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  animate();

})();
