import type { Group, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface AnimationLoopOptions {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
  controls: OrbitControls;
  planetGroups: Group[];
}

const PLANET_ROTATION_KEY = 'rotationSpeed';
const PLANET_ORBIT_KEY = 'orbitalSpeed';
const PLANET_DISTANCE_KEY = 'distanceFromSun';
const PLANET_ANGLE_KEY = 'currentAngle';

/**
 * Creates an animation loop that updates planet positions and renders the scene.
 */
export function createAnimationLoop({
  renderer,
  scene,
  camera,
  controls,
  planetGroups
}: AnimationLoopOptions) {
  let lastTime = 0;

  function animate(time: number) {
    const delta = (time - lastTime) / 1000 || 0;
    lastTime = time;

    for (const group of planetGroups) {
      const data = group.userData as Record<string, number>;
      const angle = data[PLANET_ANGLE_KEY] ?? 0;
      const newAngle = angle + delta * data[PLANET_ORBIT_KEY];
      data[PLANET_ANGLE_KEY] = newAngle;

      const distance = data[PLANET_DISTANCE_KEY];
      const x = Math.cos(newAngle) * distance;
      const z = Math.sin(newAngle) * distance;

      if (group.children[0]) {
        const planetMesh = group.children[0];
        planetMesh.position.set(x, 0, z);
        planetMesh.rotation.y += delta * data[PLANET_ROTATION_KEY];
      }
    }

    controls.update();
    renderer.render(scene, camera);
  }

  return () => {
    lastTime = performance.now();
    renderer.setAnimationLoop(animate);
  };
}
