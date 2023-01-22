precision highp float;

uniform sampler2D original;
uniform sampler2D target;
uniform float blend;

varying vec2 vUv;

void main() {

    vec4 from = texture2D(original, vUv);
    vec4 to = texture2D(target, vUv);

    gl_FragColor = mix(from, to, blend);

    // gl_FragColor = vec4(blend, 0.0, 0.0, 1.0);
}