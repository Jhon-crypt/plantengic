import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Hero from './components/Hero/Hero';
import FallbackHero from './components/Hero/FallbackHero';
import ErrorBoundary from './components/ErrorBoundary';
import { GeminiProvider } from './context/GeminiContext';
import './App.css';

function App() {
  const [useThreeJS, setUseThreeJS] = useState(true);

  useEffect(() => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setUseThreeJS(false);
    }
  }, []);

  return (
    <GeminiProvider>
      <ErrorBoundary>
        <Layout>
          <ErrorBoundary fallback={<FallbackHero />}>
            {useThreeJS ? <Hero /> : <FallbackHero />}
          </ErrorBoundary>
        </Layout>
      </ErrorBoundary>
    </GeminiProvider>
  );
}

export default App;
