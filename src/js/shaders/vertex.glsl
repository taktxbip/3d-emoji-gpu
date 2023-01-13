precision highp float;

attribute vec3 position;
attribute vec2 source;
attribute vec2 target;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float size;
uniform float blend;
uniform vec2 dimensions;

uniform sampler2D sourceTex;
uniform sampler2D targetTex;
 
varying vec3 vColor;

void main() {

    vec3 origin = vec3(source, 0.0);
    vec3 destination = vec3(target, 0.0);

    vec3 p = mix(origin, destination, blend);
    p.z = sin(3.1415926 * blend) * 0.2 * distance(origin, destination);

    vec2 uvSource = source / dimensions.x;
    vec2 uvTarget = target / dimensions.x;

    vColor = mix(texture2D(sourceTex, uvSource).rgb, texture2D(targetTex, uvTarget).rgb, blend);

    p.xy -= 0.5 * dimensions;
    p.y *= -1.0;

    p *= 3.1 / dimensions.x;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    
    gl_PointSize = size * (1. / -  mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
} 