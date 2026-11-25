/* Real UR5e CAD-derived OBJ link meshes. Kin. tree follows MuJoCo Menagerie UR5e.
   Cube task is a website animation (not a collision-checked robotics simulation). */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/OBJLoader.js';

// AM_CURSOR_IK_V1: Edit these settings to tune position and tool-Z aiming separately.
const CURSOR_IK_TUNING = {
  positionSensitivity: 0.30,    // TCP translation in meters, per normalized cursor movement (try 0.05–0.17)
  orientationSensitivity: 1.0, // Tool-Z tilt intensity (try 0.25–1.2)
  responseSpeed: 5.5,           // Higher = faster tracking (try 3–9)
  maxJointOffset: 0.95,         // Radians from initial idle pose, to limit extreme configurations
  solverIterations: 5,
  damping: 0.10,
  robotZoom: 1.3               // Camera zoom; does not change page width
};

const holder = document.querySelector('[data-am-robot-canvas]');
if (holder && !holder.dataset.amInitialized) {
  holder.dataset.amInitialized = 'true';
  init().catch(err => { console.error('[UR5e Hero]',err); holder.dataset.error = 'true'; });
}

async function init() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const scene = new THREE.Scene();
  const root = new THREE.Group(); scene.add(root);
  // MuJoCo base uses 180-degree yaw, matching the actual UR link coordinate frames.
  root.quaternion.set(0,0,-1,0);
  root.position.set(0.10,0,0);
  const materials = {
    black: new THREE.MeshStandardMaterial({color:0x20252a,roughness:.55,metalness:.25}),
    jointgray: new THREE.MeshStandardMaterial({color:0x666d73,roughness:.52,metalness:.25}),
    linkgray: new THREE.MeshStandardMaterial({color:0xd8dddf,roughness:.43,metalness:.17}),
    urblue: new THREE.MeshStandardMaterial({color:0x7aadc9,roughness:.42,metalness:.22})
  };
  const descriptors = [
    ['base',null,[0,0,0],null,[["base_0",'black'],["base_1",'jointgray']],null],
    ['shoulder','base',[0,0,.163],null,[["shoulder_0",'urblue'],["shoulder_1",'black'],["shoulder_2",'jointgray']],[0,0,1]],
    ['upper','shoulder',[0,.138,0],[1,0,1,0],[["upperarm_0",'linkgray'],["upperarm_1",'black'],["upperarm_2",'jointgray'],["upperarm_3",'urblue']],[0,1,0]],
    ['forearm','upper',[0,-.131,.425],null,[["forearm_0",'urblue'],["forearm_1",'linkgray'],["forearm_2",'black'],["forearm_3",'jointgray']],[0,1,0]],
    ['wrist1','forearm',[0,0,.392],[1,0,1,0],[["wrist1_0",'black'],["wrist1_1",'urblue'],["wrist1_2",'jointgray']],[0,1,0]],
    ['wrist2','wrist1',[0,.127,0],null,[["wrist2_0",'black'],["wrist2_1",'urblue'],["wrist2_2",'jointgray']],[0,0,1]],
    ['wrist3','wrist2',[0,0,.1],null,[["wrist3",'linkgray']],[0,1,0]]
  ];
  const parts = {};
  for (const [name,parent,pos,q] of descriptors) {
    const group = new THREE.Group();
    group.name = name;
    group.position.fromArray(pos);
    if(q) group.quaternion.set(q[1],q[2],q[3],q[0]).normalize();
    (parent ? parts[parent] : root).add(group);
    parts[name] = group;
  }
  const loader = new OBJLoader();
  const base = holder.dataset.meshBase;
  const meshes = descriptors.flatMap(d => d[4].map(m => [d[0],...m]));
  // Fail visibly rather than falling back to an inaccurate procedural robot.
  await Promise.all(meshes.map(async ([part,name,mat]) => {
    const obj = await loader.loadAsync(`${base}${name}.obj`);
    obj.traverse(c => {
      if(c.isMesh) { c.material = materials[mat]; c.castShadow = false; c.receiveShadow = true; }
    });
    parts[part].add(obj);
  }));

  // Tool mounting frame as specified by Menagerie's UR5e attachment_site.
  const flange = new THREE.Group(); flange.position.set(0,.1,0);
  flange.quaternion.set(1,0,0,-1).normalize(); parts.wrist3.add(flange);
  const steel = new THREE.MeshStandardMaterial({color:0x404a53,metalness:.63,roughness:.3});
  const grip = new THREE.Group(); flange.add(grip);
  const addBox = (parent,w,h,d,x,y,z,material) => {
    const box = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
    box.position.set(x,y,z);parent.add(box);return box;
  };
  // +Z of flange is outward through the robot tool frame; no arbitrary 90-degree wrist hacks.
  addBox(grip,.075,.055,.025,0,0,.018,steel);
  const fingerL = new THREE.Group(),fingerR=new THREE.Group();grip.add(fingerL,fingerR);
  addBox(fingerL,.012,.019,.10,0,0,.083,steel);
  addBox(fingerR,.012,.019,.10,0,0,.083,steel);
  const cubeMat=new THREE.MeshStandardMaterial({color:0xf28053,roughness:.46,metalness:.13});
  const cube=new THREE.Mesh(new THREE.BoxGeometry(.047,.047,.047),cubeMat);scene.add(cube);
  const tcp = new THREE.Object3D();tcp.position.set(0,0,.11);flange.add(tcp);

  const camera=new THREE.OrthographicCamera(-.95,.95,.67,-.67,.1,20);
  camera.position.set(1.55,-2.25,1.35);camera.up.set(0,0,1);
  camera.lookAt(.05,0,.33);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  holder.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8293a3,2.3));
  const keyLight=new THREE.DirectionalLight(0xffffff,2);keyLight.position.set(1,-1,3);scene.add(keyLight);
  const softLight=new THREE.DirectionalLight(0xd6e8ff,.85);softLight.position.set(-2,1,2);scene.add(softLight);
  const jointParts=['shoulder','upper','forearm','wrist1','wrist2','wrist3'];
  const axes=[[0,0,1],[0,1,0],[0,1,0],[0,1,0],[0,0,1],[0,1,0]];
  const home=[-1.5708,-1.5708,1.5708,-1.5708,-1.5708,0];
  // UR joint frames from Menagerie's pose hierarchy. Poses stay within a modest demonstration envelope.
  const pickup=[-.7,-1.18,1.69,-1.85,-1.4,.12];
  const raised=[-.7,-.88,1.2,-1.35,-1.4,.12];
  const carry=[.7,-.86,1.17,-1.33,-1.35,.2];
  const place=[.7,-1.18,1.69,-1.85,-1.4,.2];
  const rest=[.12,-1.23,1.37,-1.55,-1.52,.18];
  let q=home.slice();
  function setQ(v) {q=v.slice();jointParts.forEach((name,i)=>{const ax=axes[i];
    // Resting orientation from the parent group is kept; joint spins around its local axis.
    const p=parts[name]; const orig=p.userData.restQ || p.quaternion.clone();p.userData.restQ=orig;
    p.quaternion.copy(orig).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(...ax),v[i]));
  });}
  function toolWorld(){scene.updateMatrixWorld(true);const pos=new THREE.Vector3();tcp.getWorldPosition(pos);return pos;}
  // Anchor the cube directly under the tool's closing jaws in pickup / placement poses.
  const cubeAt = v=>{setQ(v);return toolWorld();};
  const pickPoint=cubeAt(pickup).clone();
  const placePoint=cubeAt(place).clone();
  cube.position.copy(pickPoint);
  let captured=false,closed=false;
  function fingers(s) {fingerL.position.x=-s;fingerR.position.x=s;}
  fingers(.039);setQ(home);
  const frames=[
    [0,home],[1.65,raised],[3.5,pickup],[4.15,pickup],[5.65,raised],
    [8.0,carry],[9.5,place],[10.25,place],[12,rest]
  ];
  const smooth=t=>t*t*(3-2*t);
  function poseAt(t){for(let i=0;i<frames.length-1;i++){const a=frames[i],b=frames[i+1];if(t<=b[0]){
    const s=smooth(Math.max(0,Math.min(1,(t-a[0])/(b[0]-a[0]))));
    return a[1].map((v,j)=>v+(b[1][j]-v)*s);
  }}return frames[frames.length-1][1].slice();}
  function updateItem(t){
    closed=t>=3.85&&t<10.03;
    captured=t>=3.95&&t<10.03;
    fingers(closed?.024:.039);
    if(captured)cube.position.copy(toolWorld());
    else cube.position.copy(t<3.95?pickPoint:placePoint);
  }
  // AM_CURSOR_IK_V1: local +Z of the TCP is the direction the gripper should aim.
  const localZ = new THREE.Vector3(0,0,1);
  function tcpState(joints) {
    setQ(joints);
    scene.updateMatrixWorld(true);
    const p=new THREE.Vector3();
    const quat=new THREE.Quaternion();
    tcp.getWorldPosition(p); tcp.getWorldQuaternion(quat);
    return {p,z:localZ.clone().applyQuaternion(quat).normalize()};
  }
  // Gaussian elimination for a small damped 6x6 normal-equation system.
  function solve6(a,b) {
    const n=6,m=a.map((r,i)=>[...r,b[i]]);
    for(let i=0;i<n;i++) {
      let k=i;
      for(let j=i+1;j<n;j++) if(Math.abs(m[j][i])>Math.abs(m[k][i]))k=j;
      if(Math.abs(m[k][i])<1e-10)return new Array(6).fill(0);
      [m[i],m[k]]=[m[k],m[i]];
      const inv=1/m[i][i];
      for(let c=i;c<=n;c++)m[i][c]*=inv;
      for(let j=0;j<n;j++)if(j!==i) {
        const f=m[j][i];
        for(let c=i;c<=n;c++)m[j][c]-=f*m[i][c];
      }
    }
    return m.map(row=>row[n]);
  }
  const idleState=tcpState(rest);
  const idlePos=idleState.p.clone();
  const idleZ=idleState.z.clone();
  const cameraRight=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);
  const cameraUp=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
  // The cursor lies on an imaginary plane normal to the *idle* tool Z axis;
  // thus center cursor preserves the original pointing direction.
  function desiredToolState(mx,my) {
    const px=mx*CURSOR_IK_TUNING.positionSensitivity;
    const py=-my*CURSOR_IK_TUNING.positionSensitivity;
    const pos=idlePos.clone().addScaledVector(cameraRight,px)
      .addScaledVector(cameraUp,py*.72);
    const aimPoint=idlePos.clone().addScaledVector(idleZ,.54)
      .addScaledVector(cameraRight,mx*.42*CURSOR_IK_TUNING.orientationSensitivity)
      .addScaledVector(cameraUp,-my*.34*CURSOR_IK_TUNING.orientationSensitivity);
    const axis=aimPoint.sub(pos).normalize();
    return {p:pos,z:axis};
  }
  const lower=[.6,.6,.6,1.05,1.05,1.25];
  function aimSolve(previous,target) {
    const angles=previous.slice(), step=.0006;
    const orientWeight=.65;
    for(let iteration=0;iteration<CURSOR_IK_TUNING.solverIterations;iteration++) {
      const state=tcpState(angles);
      const err=[
        (target.p.x-state.p.x), (target.p.y-state.p.y), (target.p.z-state.p.z),
        (target.z.x-state.z.x)*orientWeight,
        (target.z.y-state.z.y)*orientWeight,
        (target.z.z-state.z.z)*orientWeight
      ];
      const J=Array.from({length:6},()=>new Array(6).fill(0));
      for(let c=0;c<6;c++) {
        const perturbed=angles.slice();perturbed[c]+=step;
        const s=tcpState(perturbed);
        const dP=s.p.clone().sub(state.p).multiplyScalar(1/step);
        const dZ=s.z.clone().sub(state.z).multiplyScalar(orientWeight/step);
        [dP.x,dP.y,dP.z,dZ.x,dZ.y,dZ.z].forEach((v,r)=>J[r][c]=v);
      }
      const a=Array.from({length:6},()=>new Array(6).fill(0));
      const b=new Array(6).fill(0);
      for(let i=0;i<6;i++){
        for(let r=0;r<6;r++)b[i]+=J[r][i]*err[r];
        for(let k=0;k<6;k++){
          for(let r=0;r<6;r++)a[i][k]+=J[r][i]*J[r][k];
        }
        a[i][i]+=CURSOR_IK_TUNING.damping**2;
        // Gentle regularization against drifting far from the idle pose.
        b[i]-=.005*(angles[i]-rest[i]);
      }
      const dq=solve6(a,b);
      for(let i=0;i<6;i++){
        const d=THREE.MathUtils.clamp(dq[i],-.11,.11);
        const bound=Math.min(CURSOR_IK_TUNING.maxJointOffset,lower[i]);
        angles[i]=THREE.MathUtils.clamp(angles[i]+d,rest[i]-bound,rest[i]+bound);
      }
    }
    setQ(previous); // Prevent numerical probing from moving the visible robot mid-frame.
    return angles;
  }
  let mouseX=0,mouseY=0,hover=false;
  window.addEventListener('pointermove',e=>{
    if(touch)return;
    const r=holder.getBoundingClientRect();
    mouseX=THREE.MathUtils.clamp((e.clientX-r.left)/r.width*2-1,-1,1);
    mouseY=THREE.MathUtils.clamp((e.clientY-r.top)/r.height*2-1,-1,1);
    hover=e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
  },{passive:true});
  function size(){const w=holder.clientWidth||960,h=holder.clientHeight||520;
    renderer.setSize(w,h,false); const aspect=w/h, hh=.70 / CURSOR_IK_TUNING.robotZoom;
    camera.left=-hh*aspect;camera.right=hh*aspect;camera.top=hh;camera.bottom=-hh;
    camera.updateProjectionMatrix();}
  new ResizeObserver(size).observe(holder);size();
  const begin=performance.now();let last=begin;
  let interactive=rest.slice();
  function animate(now){const delta=Math.min((now-last)/1000,.05);last=now;
    const elapsed=reduced?12:(now-begin)/1000;
    if(elapsed<12) {setQ(poseAt(elapsed));updateItem(elapsed);}
    else {
      const tx=hover?mouseX:0,ty=hover?mouseY:0;
      const target=desiredToolState(tx,ty);
      const solved=aimSolve(interactive,target);
      const alpha=1-Math.exp(-delta*CURSOR_IK_TUNING.responseSpeed);
      interactive=interactive.map((v,i)=>v+(solved[i]-v)*alpha);
      setQ(interactive);
      cube.position.copy(placePoint);fingers(.039);
    }
    renderer.render(scene,camera);
    if(!document.hidden)requestAnimationFrame(animate);
    else setTimeout(()=>requestAnimationFrame(animate),150);
  }
  requestAnimationFrame(animate);
}
