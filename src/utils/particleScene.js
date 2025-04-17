import * as THREE from 'three';

/**
 * Creates a Three.js scene with plant-themed particles
 * @param {HTMLCanvasElement} canvas - The canvas element to render to
 * @returns {Object} An object containing the cleanup function
 */
export const createParticleScene = (canvas) => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0a1f14');
  
  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;
  
  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  
  // Create leaf-shaped particles
  const particleCount = 180;
  const particles = new THREE.Group();
  
  // Create multiple leaf geometries for variety
  const createLeafGeometry = (type) => {
    const geometry = new THREE.BufferGeometry();
    let shape = [];
    
    if (type === 'simple') {
      // Simple oval leaf shape
      const leafSize = 0.15;
      const detail = 12; // Number of points around the leaf
      
      // Create the leaf outline
      for (let i = 0; i <= detail; i++) {
        const angle = (i / detail) * Math.PI * 2;
        const x = Math.sin(angle) * leafSize * 0.5;
        const y = Math.cos(angle) * leafSize;
        // Make it more leaf-like with a pointed tip
        const yOffset = Math.pow(Math.abs(Math.sin(angle)), 0.5) * leafSize * 0.8;
        shape.push(new THREE.Vector3(x, y + yOffset, 0));
      }
    } 
    else if (type === 'maple') {
      // Maple-like leaf with lobes
      const leafSize = 0.15;
      const lobes = 5; // Number of lobes on the leaf
      const detail = 50; // Points per lobe
      
      for (let i = 0; i <= detail; i++) {
        const angle = (i / detail) * Math.PI * 2;
        const radius = leafSize * (0.8 + 0.3 * Math.sin(angle * lobes));
        const x = Math.sin(angle) * radius;
        const y = Math.cos(angle) * radius;
        shape.push(new THREE.Vector3(x, y, 0));
      }
    }
    else if (type === 'fern') {
      // Fern-like leaf with segments
      const leafSize = 0.2;
      const segments = 8;
      
      // Central stem
      shape.push(new THREE.Vector3(0, 0, 0));
      shape.push(new THREE.Vector3(0, leafSize * 2, 0));
      
      // Add segments on both sides
      for (let i = 1; i <= segments; i++) {
        const segmentLength = leafSize * 0.5 * (1 - i / (segments + 2));
        const y = (i / (segments + 1)) * leafSize * 2;
        
        // Left segment
        shape.push(new THREE.Vector3(0, y, 0));
        shape.push(new THREE.Vector3(-segmentLength, y, 0));
        
        // Right segment
        shape.push(new THREE.Vector3(0, y, 0));
        shape.push(new THREE.Vector3(segmentLength, y, 0));
      }
    }
    else { // Default to broad leaf
      // Broad leaf shape with veins
      const leafSize = 0.15;
      
      // Create leaf outline
      shape.push(new THREE.Vector3(0, 0, 0)); // Base
      shape.push(new THREE.Vector3(leafSize * 0.7, leafSize, 0)); // Right side
      shape.push(new THREE.Vector3(0, leafSize * 2.5, 0)); // Tip
      shape.push(new THREE.Vector3(-leafSize * 0.7, leafSize, 0)); // Left side
    }
    
    // Create vertices from the shape
    const vertices = new Float32Array(shape.length * 3);
    for (let i = 0; i < shape.length; i++) {
      vertices[i * 3] = shape[i].x;
      vertices[i * 3 + 1] = shape[i].y;
      vertices[i * 3 + 2] = shape[i].z;
    }
    
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );
    
    // Add faces - different approach based on leaf type
    if (type === 'simple' || type === 'maple') {
      // Create a center point for fan triangulation
      const center = new THREE.Vector3(0, 0, 0);
      const centerIndex = shape.length;
      
      const newVertices = new Float32Array((shape.length + 1) * 3);
      // Copy existing vertices
      for (let i = 0; i < vertices.length; i++) {
        newVertices[i] = vertices[i];
      }
      // Add center point
      newVertices[shape.length * 3] = center.x;
      newVertices[shape.length * 3 + 1] = center.y;
      newVertices[shape.length * 3 + 2] = center.z;
      
      // Replace vertices
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(newVertices, 3)
      );
      
      // Create faces by connecting each edge to center
      const indices = [];
      for (let i = 0; i < shape.length - 1; i++) {
        indices.push(i, i + 1, centerIndex);
      }
      // Connect last point to first
      indices.push(shape.length - 1, 0, centerIndex);
      
      geometry.setIndex(indices);
    } else if (type === 'fern') {
      // For fern, connect each segment pair
      const indices = [];
      for (let i = 2; i < shape.length - 1; i += 4) {
        // Left segment triangle
        indices.push(0, i, i + 1);
        // Right segment triangle
        indices.push(0, i + 2, i + 3);
      }
      geometry.setIndex(indices);
    } else {
      // For broad leaf, simple triangulation
      geometry.setIndex([
        0, 1, 3,  // Bottom triangle
        1, 2, 3   // Top triangle
      ]);
    }
    
    geometry.computeVertexNormals();
    return geometry;
  };
  
  // Create different leaf geometries
  const leafGeometries = [
    createLeafGeometry('simple'),
    createLeafGeometry('maple'),
    createLeafGeometry('fern'),
    createLeafGeometry('broad')
  ];
  
  // Create particles
  for (let i = 0; i < particleCount; i++) {
    // Different shades of green for variety
    const colors = [
      0x4CAF50, // Green
      0x8BC34A, // Light Green
      0x2E7D32, // Dark Green
      0x66BB6A, // Medium Green
      0xA5D6A7, // Pale Green
      0x81C784  // Lime Green
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Add subtle variation to the color
    const color = new THREE.Color(randomColor);
    color.r += (Math.random() - 0.5) * 0.1;
    color.g += (Math.random() - 0.5) * 0.1;
    color.b += (Math.random() - 0.5) * 0.1;
    
    // Create leaf material with enhanced appearance
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75 + Math.random() * 0.25,
      roughness: 0.5 + Math.random() * 0.5,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.4,
      transmission: 0.1 + Math.random() * 0.1, // Slight translucency
    });
    
    // Choose random leaf geometry type
    const leafGeometry = leafGeometries[Math.floor(Math.random() * leafGeometries.length)];
    const leaf = new THREE.Mesh(leafGeometry, material);
    
    // Random position in a sphere
    const radius = 4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    leaf.position.x = radius * Math.sin(phi) * Math.cos(theta);
    leaf.position.y = radius * Math.sin(phi) * Math.sin(theta);
    leaf.position.z = radius * Math.cos(phi);
    
    // Random rotation with natural orientation (leaves tend to face upward)
    leaf.rotation.x = Math.random() * Math.PI * 0.5;
    leaf.rotation.y = Math.random() * Math.PI * 2;
    leaf.rotation.z = Math.random() * Math.PI * 0.3;
    
    // Random scale with more variation
    const scale = 0.5 + Math.random() * 2;
    leaf.scale.set(scale, scale, scale * 0.1); // Make leaves thin
    
    // Store original position and rotation for animation
    leaf.userData = {
      originalPosition: leaf.position.clone(),
      originalRotation: leaf.rotation.clone(),
      speed: 0.005 + Math.random() * 0.01,
      oscillationFactor: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2 // Random starting phase
    };
    
    particles.add(leaf);
  }
  
  scene.add(particles);
  
  // Animation
  const clock = new THREE.Clock();
  
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    
    // Update particles
    particles.children.forEach((leaf) => {
      const { originalPosition, originalRotation, speed, oscillationFactor, phase } = leaf.userData;
      
      // More natural leaf movement - fluttering and swaying
      leaf.rotation.x = originalRotation.x + Math.sin(elapsedTime * speed * 2 + phase) * 0.1;
      leaf.rotation.y = originalRotation.y + Math.sin(elapsedTime * speed + phase) * 0.1;
      leaf.rotation.z = originalRotation.z + Math.cos(elapsedTime * speed * 1.5 + phase) * 0.15;
      
      // Gentle floating motion
      leaf.position.x = originalPosition.x + Math.sin(elapsedTime * speed + phase) * oscillationFactor;
      leaf.position.y = originalPosition.y + Math.cos(elapsedTime * speed * 0.8 + phase) * oscillationFactor * 0.5;
      leaf.position.z = originalPosition.z + Math.sin(elapsedTime * speed * 0.6 + phase * 2) * oscillationFactor * 0.7;
    });
    
    // Gentle rotation of entire particle system
    particles.rotation.y = elapsedTime * 0.05;
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  
  animate();
  
  // Handle window resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup function
  const cleanup = () => {
    window.removeEventListener('resize', handleResize);
    
    // Dispose of geometries and materials
    particles.children.forEach(leaf => {
      leaf.geometry.dispose();
      leaf.material.dispose();
    });
    
    scene.remove(particles);
    renderer.dispose();
  };
  
  return { cleanup };
}; 