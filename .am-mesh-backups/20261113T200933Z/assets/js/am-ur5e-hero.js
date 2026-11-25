/**
 * Solid UR5e-inspired procedural 6-axis robot. No copyrighted UR CAD meshes.
 * Uses Three.js ES module from jsDelivr (network needed for 3D; graceful CSS fallback).
 * State machine: home -> pickup -> grasp -> lift -> transfer -> place -> release -> idle mouse-follow.
 */
const host = document.querySelector('[data-am-robot]');
if (host) {
  import('https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js')
    .then((THREE) => boot(THREE, host))
    .catch((err) => console.warn('Robot background unavailable; static fallback shown.', err));
}

function boot(T, host) {
  const mount = host.querySelector('[data-am-robot-canvas]');
  if (!mount) return;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (err) {
    console.warn('WebGL not available; keeping static background.', err);
    return;
  }
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(35, 1, .1, 40);
  camera.position.set(3.55, 2.75, 5.8);
  camera.lookAt(.1, 1.05, 0);
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = false;
  mount.appendChild(renderer.domElement);
  scene.add(new T.HemisphereLight(0xffffff, 0x698598, 2.1));
  const keyLight = new T.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(-2, 5, 4); scene.add(keyLight);
  const rim = new T.DirectionalLight(0x68aed6, 1.15);
  rim.position.set(3, 3, -2); scene.add(rim);

  const matWhite = new T.MeshStandardMaterial({ color: 0xdce7eb, metalness: .35, roughness: .31 });
  const matBlue = new T.MeshStandardMaterial({ color: 0x2788b6, metalness: .42, roughness: .32 });
  const matJoint = new T.MeshStandardMaterial({ color: 0x3f5668, metalness: .55, roughness: .33 });
  const matDark = new T.MeshStandardMaterial({ color: 0x223849, metalness: .45, roughness: .4 });
  const matCube = new T.MeshStandardMaterial({ color: 0xee8654, metalness: .18, roughness: .4 });
  const matPad = new T.MeshStandardMaterial({ color: 0x9cb9c7, metalness: .35, roughness: .55 });
  const matGround = new T.MeshStandardMaterial({ color: 0xbacbd3, transparent: true, opacity: .17, roughness: 1 });

  const cyl = (parent, radiusTop, radiusBottom, h, material, y = 0, radial = 30) => {
    const mesh = new T.Mesh(new T.CylinderGeometry(radiusTop, radiusBottom, h, radial), material);
    mesh.position.y = y; parent.add(mesh); return mesh;
  };
  const sphere = (parent, radius, material, y = 0) => {
    const mesh = new T.Mesh(new T.SphereGeometry(radius, 24, 16), material);
    mesh.position.y = y; parent.add(mesh); return mesh;
  };
  const armRoot = new T.Group();
  scene.add(armRoot);
  cyl(armRoot, .27, .31, .12, matDark, .06);
  cyl(armRoot, .21, .24, .29, matWhite, .25);
  const axes = [];
  const base = new T.Group(); base.position.y = .4; armRoot.add(base); axes.push(base);
  cyl(base, .20, .20, .14, matBlue, .03);
  const shoulder = new T.Group(); shoulder.position.y = .16; base.add(shoulder); axes.push(shoulder);
  sphere(shoulder, .18, matJoint);
  cyl(shoulder, .105, .115, .80, matWhite, .40);
  cyl(shoulder, .115, .115, .05, matBlue, .77);
  const elbow = new T.Group(); elbow.position.y = .8; shoulder.add(elbow); axes.push(elbow);
  sphere(elbow, .15, matJoint);
  cyl(elbow, .087, .093, .66, matWhite, .33);
  cyl(elbow, .10, .10, .06, matBlue, .63);
  const wrist1 = new T.Group(); wrist1.position.y = .66; elbow.add(wrist1); axes.push(wrist1);
  sphere(wrist1, .115, matJoint);
  cyl(wrist1, .088, .095, .21, matBlue, .1);
  const wrist2 = new T.Group(); wrist2.position.y = .2; wrist1.add(wrist2); axes.push(wrist2);
  sphere(wrist2, .105, matJoint);
  cyl(wrist2, .075, .075, .13, matWhite, .07);
  const wrist3 = new T.Group(); wrist3.position.y = .14; wrist2.add(wrist3); axes.push(wrist3);
  cyl(wrist3, .085, .085, .085, matBlue, .045);
  const gripper = new T.Group(); gripper.position.y = .1; wrist3.add(gripper);
  cyl(gripper, .073, .073, .12, matDark, -.06);
  const f1 = new T.Mesh(new T.BoxGeometry(.035,.20,.052), matDark); f1.position.set(-.105,-.20,0); gripper.add(f1);
  const f2 = f1.clone(); f2.position.x = .105; gripper.add(f2);
  const tipLocal = new T.Vector3(0, -.205, 0);
  const cubeSize = .135;
  const cube = new T.Mesh(new T.BoxGeometry(cubeSize, cubeSize, cubeSize), matCube);
  const edges = new T.LineSegments(new T.EdgesGeometry(cube.geometry), new T.LineBasicMaterial({ color: 0xb85837 }));
  cube.add(edges); scene.add(cube);
  const ground = new T.Mesh(new T.PlaneGeometry(7, 7), matGround);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -.07; scene.add(ground);

  const poses = {
    home: [.16,-.62,1.12,-.57,.08,.10],
    approach: [-.48,-.78,1.40,-.60,.12,.08],
    pickup: [-.48,-1.02,1.75,-.71,.12,.08],
    lift: [-.48,-.76,1.42,-.64,.12,.08],
    transport: [.66,-.66,1.28,-.62,-.08,.20],
    beforePlace: [1.22,-.79,1.40,-.62,-.10,.23],
    place: [1.22,-1.02,1.73,-.72,-.10,.23],
    retreat: [1.22,-.76,1.42,-.62,-.10,.23],
    idle: [.53,-.65,1.17,-.57,.05,.10]
  };
  const current = [...poses.home];
  function setJoints(pose) {
    base.rotation.y = pose[0];
    shoulder.rotation.z = pose[1];
    elbow.rotation.z = pose[2];
    wrist1.rotation.z = pose[3];
    wrist2.rotation.x = pose[4];
    wrist3.rotation.y = pose[5];
  }
  function tipAt(pose) {
    setJoints(pose); scene.updateMatrixWorld(true);
    return gripper.localToWorld(tipLocal.clone());
  }
  const pickupPt = tipAt(poses.pickup);
  const placePt = tipAt(poses.place);
  function platform(point) {
    const top = point.y - cubeSize / 2;
    const h = Math.max(.06, top + .07);
    const m = new T.Mesh(new T.CylinderGeometry(.24,.28,h,32), matPad);
    m.position.set(point.x, -.07 + h / 2, point.z);
    scene.add(m);
    return m;
  }
  platform(pickupPt); platform(placePt);
  cube.position.copy(pickupPt);
  setJoints(current);

  // A fixed-length event timeline avoids a per-frame IK dependency and makes the demo deterministic.
  const steps = [
    ['approach',1.8],['pickup',1.35],['GRASP',.35],
    ['lift',1.25],['transport',2.1],['beforePlace',1.0],
    ['place',1.2],['RELEASE',.4],['retreat',1.15],['idle',1.6]
  ];
  let phase = 0, phaseStart = performance.now(), from = [...current];
  let attached = false, interactive = false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchOnly = window.matchMedia('(hover: none)').matches;
  const mouse = { x:0, y:0, smoothX:0, smoothY:0 };
  const hero = host.closest('.am-hero');
  const onPointer = (ev) => {
    if (!interactive || !hero) return;
    const r = hero.getBoundingClientRect();
    const x = (ev.clientX - r.left) / Math.max(1, r.width);
    const y = (ev.clientY - r.top) / Math.max(1, r.height);
    mouse.x = T.MathUtils.clamp((x - .5)*2, -1, 1);
    mouse.y = T.MathUtils.clamp((y - .5)*2, -1, 1);
  };
  if (hero) hero.addEventListener('pointermove', onPointer, { passive: true });
  function attachCube() {
    // Reparent keeping the cube visually aligned with the tool center point.
    gripper.attach(cube);
    cube.position.copy(tipLocal);
    attached = true;
  }
  function releaseCube() {
    scene.attach(cube);
    cube.position.copy(placePt);
    attached = false;
  }
  function advance(now) {
    if (reduceMotion) {
      setJoints(poses.idle);
      cube.position.copy(placePt);
      return;
    }
    if (interactive) {
      mouse.smoothX += (mouse.x - mouse.smoothX) * .035;
      mouse.smoothY += (mouse.y - mouse.smoothY) * .035;
      const p = [...poses.idle];
      if (!touchOnly) {
        p[0] += mouse.smoothX * .14;
        p[1] -= mouse.smoothY * .06;
        p[2] += mouse.smoothY * .05;
        p[4] += mouse.smoothX * .10;
        p[5] += mouse.smoothX * .14;
      }
      setJoints(p);
      return;
    }
    const [name, seconds] = steps[phase] || ['idle',1];
    const duration = seconds * 1000;
    const t = Math.min(1, (now - phaseStart) / duration);
    const smooth = t*t*(3 - 2*t);
    const target = poses[name] || from;
    const p = from.map((angle, i) => angle + (target[i] - angle) * smooth);
    setJoints(p);
    if (t >= 1) {
      if (name === 'GRASP' && !attached) attachCube();
      if (name === 'RELEASE' && attached) releaseCube();
      from = [...p]; phase += 1; phaseStart = now;
      if (phase >= steps.length) interactive = true;
    }
  }

  let visible = true;
  const watcher = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? true; }, { threshold: .02 });
  watcher.observe(host);
  function resize() {
    const w = Math.max(1,mount.clientWidth), h = Math.max(1,mount.clientHeight);
    camera.aspect = w/h;
    // Keep the robot centered toward the middle-right of the composition.
    camera.position.set(3.7,2.85,6.5);
    camera.lookAt(.05,1.05,0);
    camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
  }
  const ro = new ResizeObserver(resize); ro.observe(mount); resize();
  let running = true;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (!visible || document.hidden) return;
    advance(now);
    renderer.render(scene,camera);
  }
  if (reduceMotion) { advance(performance.now()); renderer.render(scene,camera); }
  else requestAnimationFrame(frame);
  window.addEventListener('pagehide', () => {
    running = false; ro.disconnect(); watcher.disconnect();
    if (hero) hero.removeEventListener('pointermove', onPointer);
    renderer.dispose();
  }, { once:true });
}
