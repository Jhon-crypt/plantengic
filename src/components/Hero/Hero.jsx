import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import * as THREE from 'three';
import { createParticleScene } from '../../utils/particleScene';
import PlantScanModal from '../PlantScan/PlantScanModal';
import './Hero.css';

const Hero = () => {
  const canvasRef = useRef(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

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
  
  const handleScanButtonClick = (e) => {
    e.preventDefault();  // Prevent any default navigation
    console.log('Opening scan modal...');
    setShowScanModal(true);
  };
  
  const handleCloseModal = (e) => {
    if (e) e.preventDefault();  // Prevent any default navigation
    console.log('Closing scan modal...');
    setShowScanModal(false);
  };

  // Log when modal display state changes
  useEffect(() => {
    console.log(`Modal display state: ${showScanModal ? 'visible' : 'hidden'}`);
  }, [showScanModal]);
  
  // Create modal portal
  const renderModal = () => {
    if (!showScanModal) return null;
    
    // Find modal root element
    const modalRoot = document.getElementById('modal-root');
    
    // If modal root exists, use portal, otherwise render inline
    if (modalRoot) {
      return ReactDOM.createPortal(
        <PlantScanModal onClose={handleCloseModal} />,
        modalRoot
      );
    }
    
    // Fallback to inline rendering
    return <PlantScanModal onClose={handleCloseModal} />;
  };
  
  // Create portal target if needed
  useEffect(() => {
    if (showScanModal) {
      // Make sure the body can't be scrolled while modal is open
      document.body.style.overflow = 'hidden';
      // Add a class to maintain context to the body
      document.body.classList.add('modal-open');
    } else {
      // Restore scrolling when modal is closed
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
    
    // Prevent history navigation when modal is open
    const handlePopState = (e) => {
      if (showScanModal) {
        e.preventDefault();
        setShowScanModal(false);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      // Cleanup on unmount
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showScanModal]);

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
            <button 
              className="cta-button scan-button" 
              onClick={handleScanButtonClick}
            >
              <span className="camera-icon">📷</span>
              Scan a Plant Now
            </button>
          </div>

          <div className="scan-info">
            <span className="scan-icon">📱</span>
            <span>Compatible with 25,000+ plant species worldwide</span>
          </div>
        </div>
      </div>
      
      {renderModal()}
    </section>
  );
};

export default Hero; 