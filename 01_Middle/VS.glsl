#version 130

// VBO-ból érkezõ változók
in vec3 vs_in_pos;

// a pipeline-ban tovább adandó értékek

out vec3 vs_out_ray;

// shader külsõ paraméterei

uniform vec3 u_eye;
uniform vec3 u_up;
uniform vec3 u_fw;
uniform float u_ratio;

void main()
{
	//gl_Position = MVP * vec4( vs_in_pos, 1 );
	gl_Position = vec4( vs_in_pos, 1 );

	vec3 right = normalize(cross(u_fw, u_up));
	vec3 pos = u_eye + u_fw*3 + u_ratio*right*vs_in_pos.x + u_up*vs_in_pos.y;

	vs_out_ray = pos - u_eye;
}