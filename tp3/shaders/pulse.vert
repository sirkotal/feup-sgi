uniform float time;
uniform float objectID;
varying vec2 vUv;

void main() {
    vUv = uv;
    float pulse = 1.0 + 0.3 * abs(sin(time * 2.0)) ;
    vec3 updatedPosition = position * pulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(updatedPosition, 1.0);
}
