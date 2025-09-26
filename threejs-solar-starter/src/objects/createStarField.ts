import { BufferAttribute, BufferGeometry, Color, Points, PointsMaterial } from 'three';

/**
 * Generates a simple star field by scattering points in a sphere.
 */
export function createStarField(count = 1000, radius = 200): Points {
  const geometry = new BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const index = i * 3;
    const direction = randomPointInSphere();
    positions[index] = direction.x * radius;
    positions[index + 1] = direction.y * radius;
    positions[index + 2] = direction.z * radius;
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));

  const material = new PointsMaterial({
    color: new Color(0xffffff),
    size: 0.7,
    sizeAttenuation: true
  });

  return new Points(geometry, material);
}

function randomPointInSphere() {
  let x = 0;
  let y = 0;
  let z = 0;
  let lengthSq = 0;

  do {
    x = Math.random() * 2 - 1;
    y = Math.random() * 2 - 1;
    z = Math.random() * 2 - 1;
    lengthSq = x * x + y * y + z * z;
  } while (lengthSq > 1 || lengthSq === 0);

  const length = Math.sqrt(lengthSq);
  return { x: x / length, y: y / length, z: z / length };
}
