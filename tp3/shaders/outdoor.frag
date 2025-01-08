uniform sampler2D rgbTexture;   // RGB texture from the render target
varying vec2 vUv;

void main() {
    vec4 color = texture2D(rgbTexture, vUv);
    gl_FragColor = color;
}
