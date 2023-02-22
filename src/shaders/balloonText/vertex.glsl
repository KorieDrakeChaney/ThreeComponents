

uniform vec3 u_color;
uniform float u_scale;

attribute vec3 offset;

varying vec3 vColor;

void main() {

    vColor = u_color;

    vec3 transformed = (instanceMatrix * vec4(position, 1.)).xyz;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(transformed, 1.);
}