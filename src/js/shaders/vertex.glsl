precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vecPos;

uniform float blend;
uniform sampler2D original;
uniform sampler2D target;

void main() {

    vPosition = position;
    vUv = uv;

    float from = texture2D(original, vUv).r;
    float to = texture2D(target, vUv).r;

    vPosition.z = mix(from, to, blend) * 0.3;

    vec4 modelPosition = modelMatrix * vec4(vPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;     
} 