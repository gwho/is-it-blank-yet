import { Color, Scene, FogExp2 } from 'three';

/**
 * Creates and configures the main three.js scene.
 */
export function createScene(): Scene {
  const scene = new Scene();
  scene.background = new Color(0x000000);
  scene.fog = new FogExp2(0x000000, 0.0025);
  return scene;
}
