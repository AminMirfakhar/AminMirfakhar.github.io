/* Real UR5e CAD-derived OBJ link meshes. Kin. tree follows MuJoCo Menagerie UR5e.
   Cube task is a website animation (not a collision-checked robotics simulation). */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.164.1/examples/jsm/loaders/OBJLoader.js';

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
  let mouseX=0,mouseY=0,hover=false;
  window.addEventListener('pointermove',e=>{
    if(touch)return;
    const r=holder.getBoundingClientRect();
    mouseX=THREE.MathUtils.clamp((e.clientX-r.left)/r.width*2-1,-1,1);
    mouseY=THREE.MathUtils.clamp((e.clientY-r.top)/r.height*2-1,-1,1);
    hover=e.clientY>=r.top&&e.clientY<=r.bottom;
  },{passive:true});
  function size(){const w=holder.clientWidth||960,h=holder.clientHeight||520;
    renderer.setSize(w,h,false); const aspect=w/h, hh=.70;
    camera.left=-hh*aspect;camera.right=hh*aspect;camera.top=hh;camera.bottom=-hh;
    camera.updateProjectionMatrix();}
  new ResizeObserver(size).observe(holder);size();
  const begin=performance.now();let last=begin;
  let interactive=rest.slice();
  function animate(now){const delta=Math.min((now-last)/1000,.05);last=now;
    const elapsed=reduced?12:(now-begin)/1000;
    if(elapsed<12) {setQ(poseAt(elapsed));updateItem(elapsed);}
    else{
      // Bounded, damped interaction with joint and wrist motion; never claims validated IK.
      const tx=hover?mouseX:0,ty=hover?mouseY:0;
      const desired=rest.slice();
      desired[0]+=.095*tx;desired[1]+=.045*ty;desired[2]-=.04*ty;
      desired[3]+=.035*ty;desired[4]+=.085*tx;desired[5]+=.065*tx;
      const alpha=1-Math.exp(-delta*3.4);
      interactive=interactive.map((v,i)=>v+(desired[i]-v)*alpha);
      setQ(interactive);cube.position.copy(placePoint);fingers(.039);
    }
    renderer.render(scene,camera);
    if(!document.hidden)requestAnimationFrame(animate);
    else setTimeout(()=>requestAnimationFrame(animate),150);
  }
  requestAnimationFrame(animate);
}
