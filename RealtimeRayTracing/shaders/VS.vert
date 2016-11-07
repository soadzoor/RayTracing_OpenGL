#version 120

#ifdef GL_FRAGMENT_PRECISION_HIGH
	precision highp float;
#elif GL_FRAGMENT_PRECISION_MEDIUM
	precision mediump float;
#else
	precision lowp float;
#endif

// VBO-ból érkezõ változók
attribute vec3 vertPosition;

// a pipeline-ban tovább adandó értékek

varying vec3 vsRay;

// shader külsõ paraméterei

uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform vec3 right;
uniform float ratio;

void main()
{
	gl_Position = vec4( vertPosition, 1.0 );

	vec3 pos = eye + fw*3.0 + ratio*right*vertPosition.x + up*vertPosition.y;

	vsRay = pos - eye;
}