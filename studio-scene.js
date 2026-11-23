import * as THREE from './three.module.js';

const host = document.querySelector('.studio-scene');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
try {
  if (host && !reduced.matches) mount();
} catch (error) {
  host?.classList.remove('has-scene');
}

function mount() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 60);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const stack = new THREE.Group();
  const lime = new THREE.MeshBasicMaterial({ color: 0xd4fa69 });
  const ink = new THREE.MeshBasicMaterial({ color: 0x17382e });
  const frame = new THREE.LineBasicMaterial({ color: 0x9cd349 });
  for (let i = 0; i < 4; i++) {
    const page = new THREE.Group();
    const geometry = new THREE.BoxGeometry(4.5, 2.8, .07);
    page.add(new THREE.Mesh(geometry, ink));
    page.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry), frame));
    for (const [w, h, x, y] of [[4.4,.18,0,1.24],[1.7,1.54,.99,-.15],[1.48,.12,-1.05,.55],[1.1,.08,-1.23,.25],[.8,.08,-1.38,.04]]) {
      const mark = new THREE.Mesh(new THREE.PlaneGeometry(w,h), lime);
      mark.position.set(x,y,.04);
      page.add(mark);
    }
    page.position.set(i*.48-.8,i*.32-.55,-i*.68);
    stack.add(page);
  }
  scene.add(stack);
  host.append(renderer.domElement);
  const resize = () => {
    const {width,height} = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
    renderer.setSize(width,height,false);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(host);
  resize();
  renderer.domElement.addEventListener('webglcontextlost', () => {
    renderer.setAnimationLoop(null);
    host.classList.remove('has-scene');
    renderer.domElement.hidden = true;
  });
  renderer.setAnimationLoop(time => {
    const bounds = host.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
    const progress = Math.min(1, scrollY / innerHeight);
    const distance = camera.aspect < 1 ? 12 : 9;
    camera.position.set(4 - progress*8, 2.4 - progress*2, distance);
    camera.lookAt(0,0,-1);
    stack.rotation.z = -.14 + Math.sin(time/1800)*.035;
    renderer.render(scene,camera);
    host.classList.add('has-scene');
  });
}
