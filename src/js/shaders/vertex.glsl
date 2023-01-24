precision highp float;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vecPos;

uniform float blend;
uniform float time;
uniform sampler2D original;
uniform sampler2D target;

void main() {

    vPosition = position;
    vUv = uv;

    float from = texture2D(original, vUv).r;
    float to = texture2D(target, vUv).r;

    float roundBlend = sin(3.1415926 * blend);
    float stepblend = clamp(2.0 * (vPosition.x + vPosition.y) + 6.0 * blend - 2.0, 0.0, 1.0);

    vPosition.y = vPosition.y + roundBlend * 0.5 * sin(vPosition.x + vPosition.y + blend);
    vPosition.x = vPosition.x + roundBlend * 0.5 * sin(vPosition.x + vPosition.y + blend);

    vPosition.z = mix(from, to, stepblend) * 0.5 + 0.1 * sin(vPosition.x * 2. + time / 10.0) * roundBlend;

    vec4 modelPosition = modelMatrix * vec4(vPosition, 1.0);

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
  
    gl_Position = projectedPosition;     
} 