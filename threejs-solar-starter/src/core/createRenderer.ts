import { WebGLRenderer, sRGBEncoding } from 'three';

/**
 * Creates the WebGL renderer and attaches it to the container.
 */
export function createRenderer(container: HTMLElement): WebGLRenderer {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.outputEncoding = sRGBEncoding;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}
