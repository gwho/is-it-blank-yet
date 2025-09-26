import {
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TextureLoader,
  Color
} from 'three';

export interface PlanetOptions {
  radius: number;
  distanceFromSun: number;
  orbitalSpeed: number;
  rotationSpeed: number;
  color: number;
  textureUrl?: string;
}

/**
 * Creates a planet group containing a mesh and stores configuration data.
 */
export function createPlanet(options: PlanetOptions): Group {
  const planetGroup = new Group();
  planetGroup.userData = { ...options, currentAngle: 0 };

  const geometry = new SphereGeometry(options.radius, 32, 32);
  const material = new MeshStandardMaterial({
    color: new Color(options.color)
  });

  if (options.textureUrl) {
    const textureLoader = new TextureLoader();
    material.map = textureLoader.load(options.textureUrl);
  }

  const planetMesh = new Mesh(geometry, material);
  planetMesh.position.set(options.distanceFromSun, 0, 0);

  planetGroup.add(planetMesh);
  return planetGroup;
}
