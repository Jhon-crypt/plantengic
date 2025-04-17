const vertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uMousePosition;
  attribute vec3 aRandom;
  attribute vec3 aShape1;
  attribute vec3 aShape2;
  attribute vec3 aShape3;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vProgress;

  // Simplex noise function
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    
    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    
    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            
    // Gradients
    float n_ = 0.142857142857; // 1.0/7.0
    vec3 ns = n_ * D.wyz - D.xzx;
    
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    
    // Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    
    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // Function to create a plant-like structure
  vec3 createPlantShape(vec3 pos, float size, float phase) {
    float angle = atan(pos.x, pos.z) + phase;
    float radius = length(pos.xz);
    float height = pos.y;
    
    // Create branching structure
    float branch = step(0.8, fract(angle * 2.0 / 3.141592));
    
    // Create leaves or flowers at the tips
    float tipFactor = smoothstep(0.6, 1.0, radius + height);
    
    // Add some cubes for data visualization effect
    vec3 cubePos = floor(pos / size) * size;
    
    // Blend between organic and cubic forms
    float organicWeight = smoothstep(0.3, 0.7, sin(radius * 10.0 + phase));
    
    vec3 organicPos = pos;
    organicPos.y += tipFactor * 0.2 * sin(angle * 5.0);
    organicPos.xz *= 1.0 + 0.3 * tipFactor * cos(angle * 3.0);
    
    return mix(cubePos, organicPos, organicWeight);
  }

  void main() {
    vUv = uv;
    
    // Calculate dynamic phase shifts for animation
    float globalPhase = uTime * 0.1;
    float localPhase = snoise(position * 0.5) * 5.0;
    
    // Create multiple plant forms that morph between each other
    float morphProgress = sin(uTime * 0.2) * 0.5 + 0.5;
    
    vec3 plantShape1 = createPlantShape(position, 0.2, globalPhase);
    vec3 plantShape2 = createPlantShape(position, 0.15, globalPhase + 1.57);
    vec3 plantShape3 = createPlantShape(position, 0.1, globalPhase + 3.14);
    
    // Mix between different plant arrangements
    vec3 morphedPosition = mix(
      mix(plantShape1, plantShape2, morphProgress),
      plantShape3,
      sin(uTime * 0.15) * 0.5 + 0.5
    );

    // Add movement that resembles plant growth and swaying
    float noiseFreq = 0.5;
    float noiseAmp = 0.15;
    vec3 noisePos = position * noiseFreq + uTime * 0.1;
    float noise = snoise(noisePos) * noiseAmp;
    
    // Enhanced mouse interaction - create a ripple effect
    float mouseDistance = length(morphedPosition - uMousePosition);
    float mouseEffect = 0.0;
    float ripple = sin(mouseDistance * 10.0 - uTime * 5.0) * 0.5 + 0.5;
    
    if (mouseDistance < 2.0) {
      mouseEffect = (1.0 - mouseDistance / 2.0) * uProgress * ripple * 0.3;
    }
    
    // Data visualization effect - particles align to form data patterns
    float dataVisEffect = step(0.95, sin(position.x * 10.0 + position.y * 15.0 + position.z * 5.0 + uTime));
    
    // Apply all transformations
    vec3 finalPosition = morphedPosition;
    finalPosition += normal * (noise + mouseEffect);
    finalPosition += aRandom * 0.05 * (sin(uTime + localPhase) * 0.5 + 0.5);
    
    // Add data visualization alignment when mouse is close
    if (mouseDistance < 1.0 && dataVisEffect > 0.5) {
      vec3 alignPos = vec3(
        floor(position.x * 5.0) / 5.0,
        floor(position.y * 5.0) / 5.0,
        floor(position.z * 5.0) / 5.0
      );
      finalPosition = mix(finalPosition, alignPos, uProgress * 0.5);
    }
    
    // Create a "scanning" wave effect
    float scanLine = step(0.98, sin(position.y * 10.0 + uTime * 2.0));
    finalPosition.xz += scanLine * vec2(sin(uTime * 3.0), cos(uTime * 3.0)) * 0.02;
    
    vPosition = finalPosition;
    vProgress = uProgress;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = 2.5;
  }
`;

export default vertexShader; 