import './style.css';
import { AmbientLight } from 'three';
import { createCamera } from './core/createCamera';
import { createControls } from './core/createControls';
import { createRenderer } from './core/createRenderer';
import { createScene } from './core/createScene';
import { createStarField } from './objects/createStarField';
import { createSun } from './objects/createSun';
import { createPlanet } from './objects/createPlanet';
import { createAnimationLoop } from './systems/animationLoop';

const container = document.getElementById('app');

if (!container) {
  throw new Error('App container element not found.');
}

container.innerHTML = '';

const scene = createScene();
const camera = createCamera(container);
const renderer = createRenderer(container);
const controls = createControls(camera, renderer);

const ambientLight = new AmbientLight(0x555555);
scene.add(ambientLight);

const sun = createSun();
scene.add(sun);

const earth = createPlanet({
  radius: 1,
  distanceFromSun: 12,
  orbitalSpeed: 0.5,
  rotationSpeed: 1.5,
  color: 0x2266ff
});
scene.add(earth);

const starField = createStarField();
scene.add(starField);

const startAnimation = createAnimationLoop({
  renderer,
  scene,
  camera,
  controls,
  planetGroups: [earth]
});

startAnimation();

function handleResize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

handleResize();
window.addEventListener('resize', handleResize);
