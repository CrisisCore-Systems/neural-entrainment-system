/**
 * Sacred Geometry Generators
 * Mathematical patterns found in nature, consciousness, and the universe
 */

import * as THREE from 'three';

export interface GeometryPattern {
  vertices: THREE.Vector3[];
  indices?: number[];
  colors?: THREE.Color[];
}

/**
 * Flower of Life - Ancient symbol of creation
 * Overlapping circles forming a flower-like pattern
 */
export function generateFlowerOfLife(rings: number = 3, radius: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  
  // Center circle
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
    colors.push(new THREE.Color().setHSL(i / segments, 0.8, 0.6));
  }
  
  // Surrounding circles in hexagonal pattern
  for (let ring = 1; ring <= rings; ring++) {
    const circlesInRing = ring * 6;
    for (let i = 0; i < circlesInRing; i++) {
      const angle = (i / circlesInRing) * Math.PI * 2;
      const centerX = Math.cos(angle) * radius * ring * Math.sqrt(3);
      const centerY = Math.sin(angle) * radius * ring * Math.sqrt(3);
      
      for (let j = 0; j <= segments; j++) {
        const circleAngle = (j / segments) * Math.PI * 2;
        vertices.push(new THREE.Vector3(
          centerX + Math.cos(circleAngle) * radius,
          centerY + Math.sin(circleAngle) * radius,
          0
        ));
        colors.push(new THREE.Color().setHSL((i / circlesInRing + ring / rings) % 1, 0.8, 0.6));
      }
    }
  }
  
  return { vertices, colors };
}

/**
 * Metatron's Cube - Contains all 5 Platonic solids
 * 13 circles with connecting lines forming sacred patterns
 */
export function generateMetatronsCube(radius: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  
  // 13 circle centers (1 center + 6 inner + 6 outer)
  const centers: THREE.Vector3[] = [
    new THREE.Vector3(0, 0, 0), // Center
  ];
  
  // 6 inner circles (hexagon)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    centers.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
  }
  
  // 6 outer circles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + Math.PI / 6;
    centers.push(new THREE.Vector3(
      Math.cos(angle) * radius * 2,
      Math.sin(angle) * radius * 2,
      0
    ));
  }
  
  // Connect all circles to all other circles
  for (let i = 0; i < centers.length; i++) {
    for (let j = i + 1; j < centers.length; j++) {
      vertices.push(centers[i].clone());
      vertices.push(centers[j].clone());
      
      const hue = (i + j) / (centers.length * 2);
      colors.push(new THREE.Color().setHSL(hue, 0.9, 0.6));
      colors.push(new THREE.Color().setHSL(hue, 0.9, 0.6));
    }
  }
  
  return { vertices, colors };
}

/**
 * Sri Yantra - Sacred Hindu mandala of cosmic energy
 * 9 interlocking triangles around a central point
 */
export function generateSriYantra(size: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  
  // 9 triangles (4 upward, 5 downward)
  const triangleCount = 9;
  
  for (let i = 0; i < triangleCount; i++) {
    const isUpward = i < 4;
    const scale = 1 - (i / triangleCount) * 0.3;
    const rotation = (i / triangleCount) * Math.PI * 2;
    
    // Triangle vertices
    const height = size * scale * (isUpward ? 1 : -1);
    const baseWidth = size * scale * 0.866; // sqrt(3)/2
    
    const v1 = new THREE.Vector3(0, height * 0.666, 0);
    const v2 = new THREE.Vector3(-baseWidth, -height * 0.333, 0);
    const v3 = new THREE.Vector3(baseWidth, -height * 0.333, 0);
    
    // Rotate around center
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    [v1, v2, v3].forEach(v => {
      const x = v.x * cos - v.y * sin;
      const y = v.x * sin + v.y * cos;
      v.x = x;
      v.y = y;
    });
    
    // Add triangle lines
    vertices.push(v1, v2, v2, v3, v3, v1);
    
    const color = new THREE.Color().setHSL(i / triangleCount, 1.0, 0.5);
    for (let j = 0; j < 6; j++) {
      colors.push(color.clone());
    }
  }
  
  return { vertices, colors };
}

/**
 * Fibonacci Spiral - Golden ratio spiral found throughout nature
 */
export function generateFibonacciSpiral(turns: number = 3, segments: number = 100): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  const PHI = 1.618033988749895; // Golden ratio
  
  for (let i = 0; i <= segments * turns; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const radius = Math.pow(PHI, t * 2 / Math.PI);
    
    vertices.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
    
    colors.push(new THREE.Color().setHSL(t / turns, 0.8, 0.5));
  }
  
  return { vertices, colors };
}

/**
 * Platonic Solids - The 5 perfect geometric forms
 */
export function generatePlatonicSolid(type: 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron', size: number = 1): THREE.BufferGeometry {
  switch (type) {
    case 'tetrahedron':
      return new THREE.TetrahedronGeometry(size);
    case 'cube':
      return new THREE.BoxGeometry(size, size, size);
    case 'octahedron':
      return new THREE.OctahedronGeometry(size);
    case 'dodecahedron':
      return new THREE.DodecahedronGeometry(size);
    case 'icosahedron':
      return new THREE.IcosahedronGeometry(size);
  }
}

/**
 * Torus (Doughnut) - Symbol of infinity and energy flow
 */
export function generateTorusKnot(p: number = 2, q: number = 3, size: number = 1): THREE.BufferGeometry {
  return new THREE.TorusKnotGeometry(size, size * 0.3, 128, 16, p, q);
}

/**
 * Merkaba - Star tetrahedron, vehicle of light
 * Two interlocking tetrahedrons
 */
export function generateMerkaba(size: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  
  // Upward tetrahedron
  const upward = [
    new THREE.Vector3(0, size, 0),
    new THREE.Vector3(-size, -size * 0.5, size),
    new THREE.Vector3(size, -size * 0.5, size),
    new THREE.Vector3(0, -size * 0.5, -size * 1.5),
  ];
  
  // Downward tetrahedron (rotated 60 degrees)
  const downward = [
    new THREE.Vector3(0, -size, 0),
    new THREE.Vector3(-size, size * 0.5, -size),
    new THREE.Vector3(size, size * 0.5, -size),
    new THREE.Vector3(0, size * 0.5, size * 1.5),
  ];
  
  // Connect upward tetrahedron
  const upwardEdges = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];
  upwardEdges.forEach(([i, j]) => {
    vertices.push(upward[i], upward[j]);
    colors.push(
      new THREE.Color(0.3, 0.8, 1.0),
      new THREE.Color(0.3, 0.8, 1.0)
    );
  });
  
  // Connect downward tetrahedron
  const downwardEdges = [[0,1], [0,2], [0,3], [1,2], [1,3], [2,3]];
  downwardEdges.forEach(([i, j]) => {
    vertices.push(downward[i], downward[j]);
    colors.push(
      new THREE.Color(1.0, 0.5, 0.8),
      new THREE.Color(1.0, 0.5, 0.8)
    );
  });
  
  return { vertices, colors };
}

/**
 * Seed of Life - 7 overlapping circles
 * First step in creating the Flower of Life
 */
export function generateSeedOfLife(radius: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  const segments = 64;
  
  // Center circle
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
    colors.push(new THREE.Color().setHSL(0.5, 0.8, 0.6));
  }
  
  // 6 surrounding circles
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const centerX = Math.cos(angle) * radius;
    const centerY = Math.sin(angle) * radius;
    
    for (let j = 0; j <= segments; j++) {
      const circleAngle = (j / segments) * Math.PI * 2;
      vertices.push(new THREE.Vector3(
        centerX + Math.cos(circleAngle) * radius,
        centerY + Math.sin(circleAngle) * radius,
        0
      ));
      colors.push(new THREE.Color().setHSL(i / 6, 0.8, 0.6));
    }
  }
  
  return { vertices, colors };
}

/**
 * Vesica Piscis - Two overlapping circles, symbol of creation
 */
export function generateVesicaPiscis(radius: number = 1): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  const segments = 64;
  const offset = radius * 0.866; // sqrt(3)/2
  
  // Left circle
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(new THREE.Vector3(
      -offset + Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
    colors.push(new THREE.Color().setHSL(0.6, 0.8, 0.6));
  }
  
  // Right circle
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push(new THREE.Vector3(
      offset + Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0
    ));
    colors.push(new THREE.Color().setHSL(0.8, 0.8, 0.6));
  }
  
  return { vertices, colors };
}

/**
 * Generate a fractal pattern using L-System
 */
export function generateLSystemFractal(
  axiom: string,
  rules: Record<string, string>,
  iterations: number,
  angle: number = 25,
  length: number = 1
): GeometryPattern {
  const vertices: THREE.Vector3[] = [];
  const colors: THREE.Color[] = [];
  
  // Generate L-System string
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    let next = '';
    for (const char of current) {
      next += rules[char] || char;
    }
    current = next;
  }
  
  // Turtle graphics interpretation
  const stack: Array<{pos: THREE.Vector3, dir: number}> = [];
  let pos = new THREE.Vector3(0, 0, 0);
  let dir = Math.PI / 2; // Start pointing up
  let colorIndex = 0;
  
  for (const char of current) {
    switch (char) {
      case 'F': { // Move forward and draw
        const newPos = new THREE.Vector3(
          pos.x + Math.cos(dir) * length,
          pos.y + Math.sin(dir) * length,
          0
        );
        vertices.push(pos.clone(), newPos);
        colors.push(
          new THREE.Color().setHSL(colorIndex / current.length, 0.8, 0.5),
          new THREE.Color().setHSL(colorIndex / current.length, 0.8, 0.5)
        );
        pos = newPos;
        colorIndex++;
        break;
      }
      case '+': // Turn right
        dir -= angle * Math.PI / 180;
        break;
      case '-': // Turn left
        dir += angle * Math.PI / 180;
        break;
      case '[': // Push state
        stack.push({ pos: pos.clone(), dir });
        break;
      case ']': { // Pop state
        const state = stack.pop();
        if (state) {
          pos = state.pos;
          dir = state.dir;
        }
        break;
      }
    }
  }
  
  return { vertices, colors };
}

/**
 * Predefined L-System fractals
 */
export const FRACTAL_PRESETS = {
  tree: {
    axiom: 'F',
    rules: { 'F': 'FF+[+F-F-F]-[-F+F+F]' },
    angle: 25,
    iterations: 4,
  },
  dragon: {
    axiom: 'FX',
    rules: { 'X': 'X+YF+', 'Y': '-FX-Y' },
    angle: 90,
    iterations: 10,
  },
  sierpinski: {
    axiom: 'F-G-G',
    rules: { 'F': 'F-G+F+G-F', 'G': 'GG' },
    angle: 120,
    iterations: 5,
  },
  koch: {
    axiom: 'F',
    rules: { 'F': 'F+F-F-F+F' },
    angle: 90,
    iterations: 4,
  },
  plant: {
    axiom: 'X',
    rules: { 'X': 'F+[[X]-X]-F[-FX]+X', 'F': 'FF' },
    angle: 25,
    iterations: 5,
  },
};
