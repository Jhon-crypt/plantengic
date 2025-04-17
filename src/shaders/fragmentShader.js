const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vProgress;

  // Helper function to create a vibrant leaf color gradient
  vec3 leafColor(float value) {
    // Create a gradient between different green hues
    vec3 darkGreen = vec3(0.05, 0.35, 0.15);
    vec3 mediumGreen = vec3(0.15, 0.55, 0.25);
    vec3 lightGreen = vec3(0.45, 0.85, 0.35);
    
    if (value < 0.33) {
      return mix(darkGreen, mediumGreen, value * 3.0);
    } else {
      return mix(mediumGreen, lightGreen, (value - 0.33) * 1.5);
    }
  }
  
  // Helper function for data visualization highlighting
  vec3 dataHighlight(vec3 baseColor, float factor) {
    // Add a cyan/blue data-like highlight
    vec3 dataColor = vec3(0.1, 0.8, 0.9);
    return mix(baseColor, dataColor, factor);
  }

  void main() {
    // Dynamic color based on position and time for plant coloration
    vec3 leafGreen = leafColor(sin(vPosition.y * 3.0 + uTime * 0.3) * 0.5 + 0.5);
    vec3 woodBrown = vec3(0.35, 0.2, 0.1);
    vec3 flowerColor = vec3(0.95, 0.85, 0.2); // Yellow flower accent
    
    // Get position-based value to determine color
    float colorValue = sin(vPosition.x * 3.0 + vPosition.y * 2.0 + vPosition.z * 5.0 + uTime * 0.2);
    
    // Choose between the plant-inspired colors
    vec3 baseColor;
    if (colorValue > 0.5) {
      baseColor = leafGreen;
    } else if (colorValue > 0.0) {
      baseColor = woodBrown;
    } else {
      baseColor = mix(leafGreen, flowerColor, -colorValue);
    }
    
    // Calculate final color with natural lighting effect
    float lighting = dot(normalize(vec3(0.5, 0.8, 0.3)), normalize(vPosition)) * 0.5 + 0.5;
    vec3 finalColor = baseColor * (lighting * 0.7 + 0.3);
    
    // Add scanning line effect
    float scanLine = smoothstep(0.95, 1.0, sin(vPosition.y * 10.0 + uTime * 2.0));
    finalColor = mix(finalColor, vec3(0.0, 1.0, 0.8), scanLine * 0.7);
    
    // Add data visualization elements
    float dataFactor = step(0.93, fract(vPosition.x * 5.0 + vPosition.z * 5.0));
    dataFactor *= step(0.97, sin(uTime * 0.5 + vPosition.y * 20.0));
    finalColor = mix(finalColor, dataHighlight(finalColor, 0.8), dataFactor);
    
    // Add fresnel-like effect for holographic appearance
    float fresnel = pow(1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0)), 3.0);
    finalColor = mix(finalColor, vec3(0.7, 1.0, 0.9), fresnel * 0.4);
    
    // Set varying opacity for semi-transparent effect
    float alpha = 0.75 + fresnel * 0.2;
    
    // Add pulse effect when mouse is close (using vProgress)
    alpha *= 0.9 + 0.2 * sin(uTime * 3.0) * vProgress;
    
    // Add subtle grid/scanning effect
    float grid = max(
      step(0.98, sin(vPosition.x * 20.0 + uTime)),
      step(0.98, sin(vPosition.z * 20.0 + uTime))
    );
    finalColor = mix(finalColor, vec3(0.0, 1.0, 0.6), grid * 0.3);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export default fragmentShader; 