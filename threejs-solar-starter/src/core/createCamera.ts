import { PerspectiveCamera } from 'three';

/**
 * Configures a perspective camera positioned to view the solar system.
 */
export function createCamera(container: HTMLElement): PerspectiveCamera {
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 20, 40);
  return camera;
}
