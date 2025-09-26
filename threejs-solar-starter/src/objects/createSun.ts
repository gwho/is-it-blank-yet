import {
  Mesh,
  MeshStandardMaterial,
  PointLight,
  SphereGeometry,
  Group,
  Color
} from 'three';

/**
 * Builds the sun mesh and an attached light source.
 */
export function createSun(): Group {
  const sunGroup = new Group();

  const geometry = new SphereGeometry(3, 32, 32);
  const material = new MeshStandardMaterial({
    emissive: new Color(0xffcc33),
    emissiveIntensity: 2.5,
    color: new Color(0xffaa00)
  });
  const sunMesh = new Mesh(geometry, material);

  const light = new PointLight(0xffddaa, 2.5, 0, 2);
  light.castShadow = false;

  sunGroup.add(sunMesh, light);
  return sunGroup;
}
