import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../../shaders/vertexShader';
import fragmentShader from '../../shaders/fragmentShader';
import anime from 'animejs/lib/anime.js';

// Component renamed to GlassCubes for better semantic meaning
const GlassCubes = ({ count = 8000 }) => {
  const mesh = useRef();
  const { mouse, viewport } = useThree();
  const mousePosition = useRef(new THREE.Vector3(0, 0, 0));
  
  // Animation progress ref
  const progress = useRef({
    value: 0,
    target: 0
  });

  // Generate random positions for particles
  const particlePositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      // Create a more clustered effect like in the reference image
      const x = (Math.random() - 0.5) * 3;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 3;
      
      positions.push(x, y, z);
    }
    return new Float32Array(positions);
  }, [count]);

  // Generate random values for cube variations
  const randomValues = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      values[i] = Math.random() - 0.5;
    }
    return values;
  }, [count]);

  // Create dummy arrays for shader compatibility (not used in this version but needed for shader)
  const dummyShapeArray = useMemo(() => {
    return new Float32Array(count * 3);
  }, [count]);

  // Update mouse position for shader interaction
  useFrame(() => {
    if (mesh.current) {
      // Convert normalized mouse coordinates to world space
      mousePosition.current.set(
        (mouse.x * viewport.width) / 2,
        (mouse.y * viewport.height) / 2,
        0
      );
      
      // Update uniforms
      mesh.current.material.uniforms.uTime.value += 0.01;
      mesh.current.material.uniforms.uProgress.value = progress.current.value;
      mesh.current.material.uniforms.uMousePosition.value = mousePosition.current;
    }
  });

  // Handle mouse enter/leave animations
  useEffect(() => {
    const canvasContainer = document.querySelector('.canvas-container');
    
    const handleMouseEnter = () => {
      progress.current.target = 1;
      anime({
        targets: progress.current,
        value: progress.current.target,
        duration: 800,
        easing: 'easeOutQuart'
      });
    };
    
    const handleMouseLeave = () => {
      progress.current.target = 0;
      anime({
        targets: progress.current,
        value: progress.current.target,
        duration: 800,
        easing: 'easeOutQuart'
      });
    };
    
    if (canvasContainer) {
      canvasContainer.addEventListener('mouseenter', handleMouseEnter);
      canvasContainer.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        canvasContainer.removeEventListener('mouseenter', handleMouseEnter);
        canvasContainer.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={count}
          array={randomValues}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aShape1"
          count={count}
          array={dummyShapeArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aShape2"
          count={count}
          array={dummyShapeArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aShape3"
          count={count}
          array={dummyShapeArray}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uMousePosition: { value: new THREE.Vector3(0, 0, 0) },
          uColor1: { value: new THREE.Color('#D4A76A') }, // Amber
          uColor2: { value: new THREE.Color('#333333') }, // Dark gray/black
          uColor3: { value: new THREE.Color('#FFFFFF') }  // White/clear
        }}
      />
    </points>
  );
};

export default GlassCubes; 