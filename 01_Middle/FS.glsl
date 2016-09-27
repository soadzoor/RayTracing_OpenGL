#version 130

// pipeline-ból bejövõ per-fragment attribútumok
in vec3 vs_out_ray;

// kimenõ érték - a fragment színe
out vec4 fs_out_col;


uniform vec3 u_eye;

uniform sampler2D u_sun_texture;
uniform sampler2D u_earth_texture;
uniform sampler2D u_earth_normal;
uniform sampler2D u_moon_texture;
uniform sampler2D u_moon_normal;
uniform sampler2D u_ground_texture;

uniform sampler2D skybox_texture_back;
uniform sampler2D skybox_texture_down;
uniform sampler2D skybox_texture_front;
uniform sampler2D skybox_texture_left;
uniform sampler2D skybox_texture_right;
uniform sampler2D skybox_texture_up;

struct Ray
{
	vec3 origin;
	vec3 dir;
};
struct Material
{
	vec3 amb;
	vec3 dif;
	vec3 spec;
	float pow;
	bool reflective;
	bool refractive;
	vec3 f0;
	float n;
};
struct Light
{
	vec3 col;
	vec3 pos;
};
struct Plane
{
	vec3 n; //the plane's normal
	vec3 q; //a point on the plane
};
struct Disc
{
	vec3 o;
	float r;
	vec3 n;
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
const int skybox_count = 6;
const int materials_count = spheres_count + triangles_count + skybox_count + 3;
const int lights_count = 3;
uniform Light u_lights[lights_count];
uniform vec4 u_spheres[spheres_count];
uniform Triangle u_triangles[triangles_count];
uniform Material u_materials[materials_count];
uniform float u_rot;
uniform float skybox_ratio;


uniform Plane ground;
uniform Plane skybox_back;
uniform Plane skybox_down;
uniform Plane skybox_front;
uniform Plane skybox_left;
uniform Plane skybox_right;
uniform Plane skybox_up;
uniform Disc disc01;
uniform Disc disc02;

uniform int u_depth;
uniform bool u_shadow;
uniform bool useNormalMap;
uniform bool u_glow;

const float EPSILON = 0.001;
const int STACK_SIZE = 16;

struct Stack
{
	Ray ray;
	vec3 trace_coeff;
	int depth;
};


mat3 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat3(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c);
}

mat3 calculateR(vec3 normal)
{
	normalize(normal);

	float cos_angle = dot(normal, vec3(0, 0, 1));
	float angle = acos(cos_angle);
	vec3 axis = cross(normal, vec3(0, 0, 1));

	mat3 R = rotationMatrix(axis, angle);
	return R;
}





bool intersectSphere(in Ray ray, in vec4 sphere, out HitRec hit_rec, in int ind)
{
	vec3 dist = ray.origin - sphere.xyz;
	float b = dot(dist, ray.dir)*2.0; //skalaris szorzat
	float a = dot(ray.dir, ray.dir);
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
	hit_rec.point = ray.origin + t*ray.dir;


	hit_rec.normal = normalize((hit_rec.point-hit_rec.origo) / sphere.w);

	return true;
}

bool intersectPlane(in Ray ray, in Plane plane, out HitRec hit_rec, in int ind)
{
	if (dot(ray.dir, plane.n) > 0)
	{
		return false;
	}

	float t = (dot(plane.n,(plane.q - ray.origin))) / (dot(plane.n, ray.dir));

	if (t < EPSILON )
	{
		return false;
	}
	hit_rec.ind = ind;
	hit_rec.t = t;
	hit_rec.origo = plane.q;
	hit_rec.point = ray.origin + t*ray.dir;
	hit_rec.normal = plane.n;
	
	return true;
}

bool intersectDisc(in Ray ray, in Disc disc, out HitRec hit_rec, in int ind)
{
	Plane plane1;
	plane1.n = disc.n;
	plane1.q = disc.o;

    if (intersectPlane(ray, plane1, hit_rec, ind)) 
	{ 
        vec3 p = ray.origin + hit_rec.t*ray.dir; 
        vec3 v = p - disc.o; 
        float d2 = dot(v, v); 
        if (!(d2 <= disc.r*disc.r))
		{
			return false;
		}
	
		return true;
    }

	return false;
}


bool intersectTriangle(Ray ray, in Triangle t, out HitRec hit_rec, in int ind) //Moller-Trumbore
{
  vec3 e1, e2;  //Edge1, Edge2
  vec3 P, Q, T;
  float det, inv_det, u, v;
  float t1;

  //Find vectors for two edges sharing V1
  e1 = t.B - t.A;
  e2 = t.C - t.A;
  //Begin calculating determinant - also used to calculate u parameter
  P = cross(ray.dir, e2);
  //if determinant is near zero, ray lies in plane of triangle
  det = dot(e1, P);
  //NOT CULLING
  //if(det < EPSILON ) return false;
  inv_det = 1.f / det;

  //calculate distance from V1 to ray origin
  T = ray.origin - t.A;

  //Calculate u parameter and test bound
  u = dot(T, P) * inv_det;
  //The intersection lies outside of the triangle
  if(u < 0.f || u > 1.f) return false;

  //Prepare to test v parameter
  Q = cross(T, e1);

  //Calculate V parameter and test bound
  v = dot(ray.dir, Q) * inv_det;
  //The intersection lies outside of the triangle
  if(v < 0.f || u + v  > 1.f) return false;

  t1 = dot(e2, Q) * inv_det;

  if(t1 > EPSILON) 
  { //ray intersection
		hit_rec.t = t1;
		hit_rec.ind = ind;
		hit_rec.point = ray.origin + ray.dir * t1;
		hit_rec.normal = normalize(cross(t.B-t.A, t.C-t.A));
		hit_rec.origo = (t.A+t.B+t.C)/3;
		return true;
  }

  return false;
}

vec3 glow(in float d, in vec3 glow_)
{
	return glow_*clamp((2/(0.5f + d*d)), 0, 1);
}

bool findmin(in Ray ray, inout HitRec hit_rec)
{
	HitRec hit_temp;
	
	float min_t = -1;
	bool hit = false;
	
	for (int i = 0; i < spheres_count; ++i) 
	{
		if (intersectSphere(ray, u_spheres[i], hit_temp, i))
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
		if (intersectTriangle(ray, u_triangles[i-spheres_count], hit_temp, i))
		{
			if (hit_temp.t < min_t || min_t < 0)
			{
				min_t = hit_temp.t;
				hit_rec = hit_temp;
			}
			hit = true;
		}
	}
	if (intersectPlane(ray, ground, hit_temp, spheres_count + triangles_count))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_back, hit_temp, spheres_count + triangles_count + 1))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_down, hit_temp, spheres_count + triangles_count + 2))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_front, hit_temp, spheres_count + triangles_count + 3))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_left, hit_temp, spheres_count + triangles_count + 4))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_right, hit_temp, spheres_count + triangles_count + 5))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skybox_up, hit_temp, spheres_count + triangles_count + 6))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}

	if (intersectDisc(ray, disc01, hit_temp, spheres_count + triangles_count + skybox_count + 1))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}

	if (intersectDisc(ray, disc02, hit_temp, spheres_count + triangles_count + skybox_count + 2))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}

	return hit;
}

vec3 shade(in HitRec min_hit, in Ray ray)
{
	vec3 ref_dir = normalize(reflect(min_hit.point - ray.origin, min_hit.normal));
	vec3 temp_col = u_materials[min_hit.ind].amb;
	vec3 diffuse = vec3(0);
	vec3 specular = vec3(0);

	for (int j = 0; j < lights_count; ++j)
	{
		vec3 light_vec = u_lights[j].pos - min_hit.point;
		//float distance = length(light_vec);
		light_vec = normalize(light_vec);
		float diffintensity = clamp(dot(min_hit.normal, light_vec), 0, 1);
			
		specular = clamp(((u_materials[min_hit.ind].spec*u_lights[j].col)*pow(clamp(dot(light_vec, ref_dir),0,1), u_materials[min_hit.ind].pow)), 0, 1);
		diffuse = clamp((u_materials[min_hit.ind].dif*diffintensity*u_lights[j].col)/(1),0,1);

			
		if (u_shadow)
		{
			HitRec shadow_hit = min_hit;
			int ind = shadow_hit.ind;
			Ray shadow_ray;
			shadow_ray.origin = shadow_hit.point+1.5*shadow_hit.normal*EPSILON;
			shadow_ray.dir = u_lights[j].pos-shadow_hit.point;
			findmin(shadow_ray, shadow_hit);
			if (shadow_hit.ind != 0 && shadow_hit.ind != 5 && shadow_hit.ind != 6 && shadow_hit.ind != spheres_count+triangles_count && shadow_hit.ind != ind && ind <= spheres_count + triangles_count)
			{
				specular = vec3(0.0); 
				diffuse = vec3(0.0);
			}
		}
		temp_col += diffuse + specular;
	}

	return temp_col;
}

vec3 fresnel(in vec3 dir, in vec3 normal, in vec3 f0)
{

	float cosa = abs(dot(normal, dir));

	vec3 f = f0 + (vec3(1.0)-f0)*pow((1-cosa), 5);

	return f;
	
}

vec3 trace(Ray ray)
{
	vec3 color = vec3(0);
	HitRec min_hit;

	float u,v;
	vec2 uv;

	Stack stack[STACK_SIZE]; //max db
	int stack_size = 0; //aktualis db
	int bounce_count = 1;
	vec3 trace_coeff = vec3(1.0);
	bool continueLoop = true;
	float f = 1.0;

	while (continueLoop)
	{
		if(findmin(ray, min_hit))
		{
			u = 0.5 + atan(-min_hit.normal.z, -min_hit.normal.x)/(2*3.1415);
			v = 0.5 - asin(-min_hit.normal.y)/3.1415;

			if (useNormalMap)
			{
				if (min_hit.ind == 3)
				{
					u += u_rot/2;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2*( (texture(u_earth_normal, -uv)).bgr ) - 1);
			
					mat3 R = calculateR(min_hit.normal);
					min_hit.normal = R*normalFromMap;
				}
				else if (min_hit.ind == 4)
				{
					u += u_rot/7;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2*( (texture(u_moon_normal, -uv)).bgr ) - 1);
			
					mat3 R = calculateR(min_hit.normal);
					min_hit.normal = R*normalFromMap;
				}
			}
			
			bounce_count++;
			
			Material mat = u_materials[min_hit.ind];
			vec3 shade_col = min_hit.ind == 0 ? mat.amb : shade(min_hit, ray);
		
			color += shade_col*trace_coeff;
			
			if (min_hit.ind == 0) //sun
			{
				u += u_rot/5;
				v += u_rot/5;
				vec2 uv = vec2(u, v);
				color *= texture(u_sun_texture, -uv).bgr + vec3(0,0,0.5);
			}
			else if (min_hit.ind == 3) //earth
			{
				if (!useNormalMap)
				{
					u += u_rot/2;
				}
			
				vec2 uv = vec2(u, v);
				color *= texture(u_earth_texture, -uv).bgr;
			}
			else if (min_hit.ind == 4) //moon
			{
				if (!useNormalMap)
				{
					u += u_rot/7;
				}
				vec2 uv = vec2(u, v);
				color *= texture(u_moon_texture, -uv).bgr;
			}
			else if (min_hit.ind == spheres_count+triangles_count) //ground
			{
				color *= texture(u_ground_texture, 0.15*min_hit.point.xz).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 1) //skybox_back
			{
				color *= texture(skybox_texture_back, (-min_hit.point.xy + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 2) //skybox_down
			{
				color *= texture(skybox_texture_down, (min_hit.point.xz + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 3) //skybox_front
			{
				color *= texture(skybox_texture_front, (min_hit.point.xy*vec2(1, -1) + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 4) //skybox_left
			{
				color *= texture(skybox_texture_left, (min_hit.point.yz + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 5) //skybox_right
			{
				color *= texture(skybox_texture_right, (min_hit.point.zy*vec2(1, -1) + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			else if (min_hit.ind == spheres_count + triangles_count + 6) //skybox_up
			{
				color *= texture(skybox_texture_up, (min_hit.point.xz + vec2(skybox_ratio/2.0, skybox_ratio/2.0)) / skybox_ratio).bgr;
			}
			if ((mat.reflective || mat.refractive) && bounce_count <= u_depth)
			{
				//f *= 0.7;
				//if (f < 0.1) continueLoop = false;
				//glass
				bool total_internal_reflection = false;
				if (mat.refractive)
				{
					float eta = 1/mat.n;
					vec3 temp_ray = ray.dir;
					Ray refr_ray;
					
					//                     kivulrol jon?                        igen                                        nem
					refr_ray.dir = dot(ray.dir, min_hit.normal) < 0 ? refract(ray.dir, min_hit.normal, eta) : refract(ray.dir, -min_hit.normal, 1/eta);
				
					if (refr_ray.dir == vec3(0.0)) //teljes belso visszaverodes
					{
						ray.dir = normalize(reflect(temp_ray, min_hit.normal));
						ray.origin = min_hit.point - 1.5*min_hit.normal*EPSILON;
						trace_coeff = trace_coeff*fresnel(ray.dir, min_hit.normal, mat.f0);
						//total_internal_reflection = true;
					}
					else
					{
						float esign = dot(ray.dir, min_hit.normal) < 0 ? 1.0 : -1.0;
						refr_ray.origin = min_hit.point - min_hit.normal*EPSILON*esign;

						refr_ray.dir = normalize(refr_ray.dir);
						
						if (!mat.reflective)
						{
							ray = refr_ray;
							//trace_coeff *= (vec3(1.0) - fresnel(ray.dir, min_hit.normal, mat.f0))*f;
						}
						else
						{
							stack[stack_size].trace_coeff = trace_coeff*(vec3(1.0) - fresnel(ray.dir, min_hit.normal, mat.f0));
							stack[stack_size].depth = bounce_count;
							stack[stack_size++].ray = refr_ray;
						}
					}
				}
				//mirror
				if (mat.reflective && !total_internal_reflection && (min_hit.ind != 3 || (min_hit.ind == 3 && color.z > color.x && color.z > color.y))) //A fold csak a vizen tukrozodjon
				{
					if (dot(ray.dir, min_hit.normal) >= 0)
					{
						//if (bounce_count > 3)
						//{
						//	continueLoop = false; //igy gyorsabb, es nincs nagy kulonbseg latvanyban
						//}
						//else
						{
							trace_coeff = trace_coeff*fresnel(ray.dir, -min_hit.normal, mat.f0);
							ray.dir = normalize(reflect(ray.dir, -min_hit.normal));
							ray.origin = min_hit.point - 1.5*min_hit.normal*EPSILON;
						}
					}
					else
					{
						trace_coeff = trace_coeff*fresnel(ray.dir, min_hit.normal, mat.f0);
						ray.dir = normalize(reflect(ray.dir, min_hit.normal));
						ray.origin = min_hit.point + 1.5*min_hit.normal*EPSILON;
					}
				}
			}
			else //diffuse material
			{
				continueLoop = false;
			}


		}
		else
		{
			//color += vec3(0.25, 0.25, 0.75)*trace_coeff;
			color += vec3(0.6, 0.75, 0.9)*trace_coeff;
			continueLoop = false;
		}

		if (!continueLoop && stack_size > 0)
		{
			ray = stack[--stack_size].ray;
			bounce_count = stack[stack_size].depth;
			trace_coeff = stack[stack_size].trace_coeff;
			continueLoop = true;
		}
		//
		// glow
		//
		if (u_glow)
		{
			vec3 vec = u_spheres[0].xyz - ray.origin;
			vec3 direction = normalize(ray.dir);
			float t = abs(dot(vec, direction));
			vec3 hit_point = ray.origin + t*direction;
			float d = length(hit_point);
			vec3 glowcolor = vec3(1,0.95,0.1);
			vec3 glowness;
			if (length(min_hit.point-u_eye)+u_spheres[0].w < length(u_spheres[0].xyz - u_eye))
			{
				glowness = vec3(0);
			}
			else
			{
				glowness = glow(d, glowcolor);
			}
			color += glowness;
		}
		
		
	}

	return color;
}


void main()
{
	Ray ray;
	ray.origin = u_eye;
	ray.dir = normalize(vs_out_ray);
	

	vec3 color = trace(ray);

	fs_out_col = vec4(color, 1);
}