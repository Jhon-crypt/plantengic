import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.js';
import './Hero.css';

const FallbackHero = () => {
  const heroRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (heroRef.current && textRef.current) {
      // Animate hero section on mount
      anime({
        targets: heroRef.current,
        opacity: [0, 1],
        duration: 1200,
        easing: 'easeOutQuad'
      });
      
      // Animate text elements with staggered delay
      anime({
        targets: textRef.current.querySelectorAll('.hero-text > *'),
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {start: 300}),
        duration: 800,
        easing: 'easeOutQuint'
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="canvas-container fallback-bg">
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
      </div>
      <div ref={textRef} className="hero-content">
        <div className="hero-text">
          <h1>Get Things Done</h1>
          <h2>Make <span className="highlight">Building</span> Fun</h2>
          <p>Indie Action Club keeps you focused and getting things done, day after day</p>
          <button className="cta-button">Start 7-day free trial</button>
          <div className="credit-info">
            <span className="credit-icon">💳</span>
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FallbackHero; 