import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { createParticleScene } from '../../utils/particleScene';
import './Hero.css';

const Hero = () => {
  const canvasRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [sceneLoaded, setSceneLoaded] = useState(false);

  useEffect(() => {
    // Check for WebGL support
    try {
      const canvas = document.createElement('canvas');
      const supportsWebGL = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      
      setWebGLSupported(supportsWebGL);
      
      if (!supportsWebGL) {
        console.warn('WebGL not supported, showing fallback content');
        return;
      }
      
      // Initialize Three.js scene
      if (canvasRef.current) {
        const { cleanup } = createParticleScene(canvasRef.current);
        
        // Mark scene as loaded after a slight delay for animation
        setTimeout(() => {
          setSceneLoaded(true);
        }, 300);
        
        // Cleanup on unmount
        return cleanup;
      }
    } catch (error) {
      console.error('Error initializing WebGL:', error);
      setWebGLSupported(false);
    }
  }, []);

  // Define plant icons for the fallback background
  const plantIcons = [
    '🌿', '🌱', '🍃', '🌴', '🌲', '🍀', '🌵', '🌳', '🍂'
  ];

  return (
    <section
      className="hero-section"
      style={{ opacity: sceneLoaded || !webGLSupported ? 1 : 0 }}
    >
      {webGLSupported ? (
        <>
          <div className="canvas-container">
            <canvas ref={canvasRef} />
          </div>
          
          <div className="cube-pattern">
            <div className="cube amber-cube"></div>
            <div className="cube black-cube"></div>
            <div className="cube clear-cube"></div>
            <div className="cube amber-cube"></div>
            <div className="cube black-cube"></div>
            <div className="cube clear-cube"></div>
            <div className="cube amber-cube"></div>
            <div className="cube black-cube"></div>
          </div>
        </>
      ) : (
        <div className="canvas-fallback fallback-bg">
          <div className="plant-pattern">
            {plantIcons.map((icon, index) => (
              <div key={index} className="plant-icon">
                {icon}
              </div>
            ))}
          </div>
          <div className="fallback-icon">🌿</div>
          <h1>PlantEngic</h1>
          <p>Your plant scanning solution</p>
        </div>
      )}

      <div className="hero-content">
        <div className="hero-text">
          <h1>PlantEngic</h1>
          <h2>Know Your Plants Better</h2>
          <p>
            Scan any plant with your camera to instantly identify species, 
            get care tips, and track growth data. Advanced AI technology 
            identifies <span className="highlight">25,000+ plant species</span> with 
            amazing accuracy.
          </p>
          
          <div className="cta-buttons">
            <button className="cta-button primary-cta">Download App</button>
            <button className="cta-button secondary-cta">See Plant Database</button>
          </div>

          <div className="scan-info">
            <span className="scan-icon">📱</span>
            <span>Compatible with 25,000+ plant species worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 