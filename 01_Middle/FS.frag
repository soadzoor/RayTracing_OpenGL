#version 130

// pipeline-ból bejövõ per-fragment attribútumok
//in vec3 vs_out_pos;
in vec3 vs_out_normal;
in vec2 vs_out_tex0;
in vec3 vs_out_ray;

// kimenõ érték - a fragment színe
out vec4 fs_out_col;



// anyagtulajdonságok
uniform vec4 Ka = vec4(1, 1, 1, 1);
uniform vec4 Kd = vec4(0.75f, 0.25f, 0.125f, 1);
uniform vec4 Ks = vec4(0, 1, 0, 1);
uniform float specular_power = 16;

uniform vec3 u_eye;

uniform sampler2D texImage;

uniform sampler2D u_sun_texture;
uniform sampler2D u_earth_texture;
uniform sampler2D u_moon_texture;
uniform sampler2D u_sky_texture;

struct Material
{
	vec3 amb;
	vec3 dif;
	vec3 spec;
	float pow;
};
struct Light
{
	vec3 col;
	vec3 pos;
};
struct Triangle
{
	vec3 A, B, C;
};
struct HitRec
{
	int ind;
	float t;
	vec3 point;
	vec3 normal;
	vec3 origo;
};

const int spheres_count = 10;
const int triangles_count = 2;
const int lights_count = 2;
uniform Light u_lights[lights_count];
uniform vec4 u_spheres[spheres_count];
uniform Triangle u_triangles[triangles_count];
uniform Material u_materials[spheres_count+triangles_count];
uniform float u_rot;

const float EPSILON = 0.001;


bool intersectSphere(in vec3 pos, in vec3 dir, in vec4 sphere, out HitRec hit_rec, in int ind)
{
	vec3 dist = pos - sphere.xyz;
	float b = dot(dist,dir)*2.0; //skalaris szorzat
	float a = dot(dir, dir);
	float c = dot(dist, dist) - dot(sphere.w, sphere.w);

	float discr = b*b - 4.0 * a * c;
	if (discr < 0)
	{
		return false;
	}
	float sqrt_discr = sqrt(discr);
	float t1 = (-b + sqrt_discr)/2.0/a;
	float t2 = (-b - sqrt_discr)/2.0/a;
	float t;
	if (t1 < EPSILON)
	{
		t1 = -EPSILON;
	}
	if (t2 < EPSILON)
	{
		t2 = -EPSILON;
	}
	if (t1 < 0.0 && t2 < 0.0)
	{
		return false;
	}
	if (t1 < 0.0)
	{
		return false;
	}
	if (t2 > 0.0)
	{
		t = t2;
	}
	else
	{
		t = t1;
	}
	hit_rec.ind = ind;
	hit_rec.t = t;
	hit_rec.origo = vec3(sphere.xyz);
	hit_rec.point = pos + dir * t;
	hit_rec.normal = normalize((hit_rec.point-hit_rec.origo) / sphere.w);
	return true;
}

float determinant(mat3 m)
{
	return  + m[0][0] * (m[1][1] * m[2][2] - m[2][1] * m[1][2])
			- m[1][0] * (m[0][1] * m[2][2] - m[2][1] * m[0][2])
			+ m[2][0] * (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
}

mat3 inverse(mat3 m)
{
	float d = determinant(m);

	mat3 Inverse;
	Inverse[0][0] = + (m[1][1] * m[2][2] - m[2][1] * m[1][2]);
	Inverse[1][0] = - (m[1][0] * m[2][2] - m[2][0] * m[1][2]);
	Inverse[2][0] = + (m[1][0] * m[2][1] - m[2][0] * m[1][1]);
	Inverse[0][1] = - (m[0][1] * m[2][2] - m[2][1] * m[0][2]);
	Inverse[1][1] = + (m[0][0] * m[2][2] - m[2][0] * m[0][2]);
	Inverse[2][1] = - (m[0][0] * m[2][1] - m[2][0] * m[0][1]);
	Inverse[0][2] = + (m[0][1] * m[1][2] - m[1][1] * m[0][2]);
	Inverse[1][2] = - (m[0][0] * m[1][2] - m[1][0] * m[0][2]);
	Inverse[2][2] = + (m[0][0] * m[1][1] - m[1][0] * m[0][1]);
	Inverse /= d;

	return Inverse;
}

bool intersectTriangle(in vec3 pos, in vec3 dir, in Triangle t, out HitRec hit_rec, in int ind)
{
	vec3 AB = t.B.xyz - t.A.xyz;
	vec3 AC = t.C.xyz - t.A.xyz;

	float det = determinant(mat3(AB, AC, -1.0f*dir));
	
	if (det == 0.0f)
	{
		return false;
	}
	else
	{
		vec3 oA = pos - t.A.xyz;
		
		mat3 Di = inverse(mat3(AB, AC, -1.0f*dir));
		vec3 solution = Di*oA;

		if (solution.x >= EPSILON && solution.x <= 1+EPSILON)
		{
			if (solution.y >= -EPSILON && solution.y <= 1+EPSILON)
			{
				if (solution.x + solution.y <= 1+EPSILON && solution.z > EPSILON)
				{
					hit_rec.t = solution.z;
					hit_rec.ind = ind;
					hit_rec.point = pos + dir * hit_rec.t;
					hit_rec.normal = normalize(cross(AB, AC));
					hit_rec.origo = (t.A+t.B+t.C)/3;
					return true;

				}
			}
		}
		return false;
	}
}

vec4 glow(in float d, in vec4 glow_, in HitRec min_hit)
{
	return glow_*clamp((2/(0.5f + d*d)), 0, 1);
}

bool findmin(in vec3 pos, in vec3 dir, inout HitRec hit_rec)
{
	HitRec hit_temp;
	
	float min_t = -1;
	bool hit = false;
	
	for (int i = 0; i < spheres_count; ++i) 
	{
		if (intersectSphere(pos, dir, u_spheres[i], hit_temp, i))
		{
			
			if (hit_temp.t < min_t || min_t < 0)
			{
				min_t = hit_temp.t;
				hit_rec = hit_temp;
				
			}
			hit = true;
		}
	}
	for (int i = spheres_count; i < spheres_count + triangles_count; ++i)
	{
		if (intersectTriangle(pos, dir, u_triangles[i-spheres_count], hit_temp, i))
		{
			if (hit_temp.t < min_t || min_t < 0)
			{
				min_t = hit_temp.t;
				hit_rec = hit_temp;
			}
			hit = true;
		}
	}
	return hit;
}

void trace(in Light u_lights[lights_count], in Material u_materials[spheres_count+triangles_count], in vec3 pos, in vec3 dir, inout vec4 color, in HitRec min_hit, bool hit, float k)
{
	HitRec hit_rec;
	vec3 ref_dir;
	float min_t = -1;
	float u,v;
	vec2 uv;
	
	vec3 specular = vec3(0);
	if(hit)
	{
		ref_dir = normalize(reflect(min_hit.point - pos, min_hit.normal));
		vec3 fs_out_col_wo_spec = u_materials[min_hit.ind].amb;
		for (int j = 0; j < lights_count; ++j)
		{
			vec3 light_vec = u_lights[j].pos - min_hit.point;
			float distance = length(light_vec);
			light_vec = normalize(light_vec);
			float diffintensity = clamp(dot(min_hit.normal, light_vec), 0, 1);
			
			specular += clamp(((u_materials[min_hit.ind].spec*u_lights[j].col)*pow(clamp(dot(light_vec, ref_dir),0,1), u_materials[min_hit.ind].pow))/(1), 0, 1);// /distance*distance mehetne, csak ronda lesz
			fs_out_col_wo_spec += clamp((u_materials[min_hit.ind].dif*diffintensity*u_lights[j].col+specular)/(1),0,1);
		}

		color += k*vec4(fs_out_col_wo_spec + specular, 1);
			
		float u = 0.5 + atan(-min_hit.normal.z, -min_hit.normal.x)/(2*3.1415);
		float v = 0.5 - asin(-min_hit.normal.y)/3.1415;
		if (min_hit.ind == 0)
		{
			u += u_rot/5;
			v += u_rot/5;
			vec2 uv = vec2(u, v);
			color += k*(texture(u_sun_texture, -uv).bgra - vec4(fs_out_col_wo_spec + specular, 1) + vec4(0,0,0.5,1));
		}
		if (min_hit.ind == 3)
		{
			u += u_rot/2;
			vec2 uv = vec2(u, v);
				
			color *= k*(texture(u_earth_texture, -uv).bgra);
			if (color.z > color.x && color.z > color.y)
			{
				color += k*vec4(3*specular, 1);
				//fs_out_col = vec4(1,0,0,1);
			}
			else
			{
				color -= k*vec4(specular, 1);
			}
				
		}
		if (min_hit.ind == 4)
		{
			u += u_rot/7;
			uv = vec2(u, v);
			color *= k*texture(u_moon_texture, -uv).bgra;
		}
		//fs_out_col = texture(u_sky_texture, vs_out_pos.xy) + glow;

	}
	if(!hit)
	{
		
		color += vec4(0.25, 0.25, 0.75,1);
	}

	
	//glow
	vec3 vec = u_spheres[0].xyz - pos;
	vec3 direction = normalize(dir);
	float t = dot(vec, direction);
	vec3 hit_point = pos + t*direction;
	float d = length(hit_point);
	vec4 glowcolor = vec4(1,0.95,0.1,1);
	vec4 glowness;
	if (length(min_hit.origo-u_spheres[0].xyz) > 4.0f || t < 0)
	{
		glowness = vec4(0);
	}
	else
	{
		glowness = glow(d, glowcolor, min_hit);
	}
	color += k*glowness;
}


bool refraction(in vec3 in_dir, in vec3 normal, in float eta, inout vec3 out_dir)
{
	float cosin = -1.0*dot(in_dir,normal);
	if (abs(cosin) <= EPSILON) return false;

	float cn = eta;
	if (cosin < 0)
	{
		cn = 1.0/eta;
		normal = -normal;
		cosin = -cosin;
	}
	float disc = 1 - (1 - cosin * cosin) / cn / cn;
	if (disc < 0) return false;
	out_dir = normal * (cosin / cn - sqrt(disc)) + in_dir / cn;
	return true;
}


void main()
{
	vec4 color = vec4(0);
	HitRec min_hit;
	bool hit = findmin(u_eye, vs_out_ray, min_hit);
	float k1 = 1.0f;
	trace(u_lights, u_materials, u_eye, vs_out_ray, color, min_hit, hit, k1);

	//tukor
	if (u_materials[min_hit.ind].pow >= 120 || (min_hit.ind == 3 && (color.z > color.x && color.z > color.y)))
	{
		vec3 ref_dir = normalize(reflect(min_hit.point-u_eye, min_hit.normal));
		hit = findmin(min_hit.point, ref_dir, min_hit);
		float k2 = 0.5f;
		trace(u_lights, u_materials, min_hit.point, ref_dir, color, min_hit, hit, k2);
		color *= 0.5f;
	}
	//uveg
	if (u_materials[min_hit.ind].pow < 120 && u_materials[min_hit.ind].pow >= 100)
	{
		
	}

	fs_out_col = color;
}