#version 120

// VBO-ból érkezõ változók
in vec3 vertPosition;

// a pipeline-ban tovább adandó értékek

out vec3 vsRay;

// shader külsõ paraméterei

uniform vec3 eye;
uniform vec3 up;
uniform vec3 fw;
uniform vec3 right;
uniform float ratio;

void main()
{
	gl_Position = vec4( vertPosition, 1 );

	vec3 pos = eye + fw*3 + ratio*right*vertPosition.x + up*vertPosition.y;

	vsRay = pos - eye;
}