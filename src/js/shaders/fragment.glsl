precision highp float;

uniform sampler2D original;
uniform sampler2D target;
uniform float blend;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
    float stepblend = clamp(vPosition.x + vPosition.y + 5.0 * blend - 2.0, 0.0, 1.0);

    vec4 from = texture2D(original, vUv);
    vec4 to = texture2D(target, vUv);

    vec4 result = from * (1.0 - stepblend) + to * stepblend;
    gl_FragColor = result;

    // gl_FragColor = vec4(blend, 0.0, 0.0, 1.0);
}