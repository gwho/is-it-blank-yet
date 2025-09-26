import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PerspectiveCamera, WebGLRenderer } from 'three';

/**
 * Builds orbit controls to allow the camera to rotate around the scene.
 */
export function createControls(
  camera: PerspectiveCamera,
  renderer: WebGLRenderer
): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 10;
  controls.maxDistance = 200;
  controls.maxPolarAngle = Math.PI * 0.95;
  return controls;
}
