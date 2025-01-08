uniform sampler2D lGrayTexture;
uniform float depthScale;      
varying vec2 vUv;

void main() {
    vUv = uv;
    float depth = texture2D(lGrayTexture, vUv).r;
    vec3 displacedPosition = position + normal * depth * depthScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
