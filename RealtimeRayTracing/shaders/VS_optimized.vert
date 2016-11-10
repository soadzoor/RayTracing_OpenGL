#version 120
attribute vec3 vertPosition;
varying vec3 vsRay;
uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform vec3 right;
uniform float ratio;
void main ()
{
  vec4 tmpvar_1;
  tmpvar_1.w = 1.0;
  tmpvar_1.xyz = vertPosition;
  gl_Position = tmpvar_1;
  vsRay = (((
    (eye + (fw * 3.0))
   + 
    ((ratio * right) * vertPosition.x)
  ) + (up * vertPosition.y)) - eye);
}

