#version 130

// pipeline-ból bejövõ per-fragment attribútumok
//in vec3 vs_out_pos;
//in vec3 vs_out_normal;
in vec3 vs_out_ray;

// kimenõ érték - a fragment színe
out vec4 fs_out_col;


uniform vec3 u_eye;

uniform sampler2D u_sun_texture;
uniform sampler2D u_earth_texture;
uniform sampler2D u_earth_normal;
uniform sampler2D u_moon_texture;
uniform sampler2D u_plane_texture;
//uniform sampler2D u_sky_texture;

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
const int materials_count = spheres_count + triangles_count + 3;
const int lights_count = 3;
uniform Light u_lights[lights_count];
uniform vec4 u_spheres[spheres_count];
uniform Triangle u_triangles[triangles_count];
uniform Material u_materials[materials_count];
uniform float u_rot;

uniform Plane plane01;
uniform Disc disc01;
uniform Disc disc02;

uniform int u_depth;
uniform bool u_shadow;

const float EPSILON = 0.001;
bool sky_hit = false;


// Segédfüggvény: feltéve hogy a és b vektorok nem esnek egy egyenesbe,
// mi az az R forgatómátrix, hogy b = R*a?
// Math: http://math.stackexchange.com/questions/180418/calculate-rotation-matrix-to-align-vector-a-to-vector-b-in-3d/897677#897677
mat3 AToB(vec3 a, vec3 b){

	a = normalize(a);
	b = normalize(b);

	vec3 v = cross(a, b);
	float s = length(v);
	float c = dot(a, b);

	mat3 V = mat3(
		vec3(0,     v.z, -v.y),
		vec3(-v.z,  0,    v.x),
		vec3( v.y, -v.x,  0  )
	);

	mat3 R = mat3(1.0f) + V + V * V * ((1 - c) / (s*s));
	return R;

}

// Segédfüggvény a normálvektor módosításához a normalmap szerint
// alapötlet: a normalmap azt mutatja, hogyan kell változtatni egy normálison, ha az a (0,0,1) irányba mutatna
// viszont a normálvektoraink ugye nem így állnak, hanem vs_out_normal irányba mutatnak
// tehát: legyen R az a transzformáció, ami a (0,0,1)-et vs_out_normal-ba forgatja,
// és ekkor az új normálvektor valójában R*normal_from_normalmap lesz

vec3 normalTransform(vec3 normal_original, vec3 normal_from_normalmap){

	vec3 n_orig = normalize(normal_original);
	vec3 n_map = normalize(normal_from_normalmap);
	mat3 R = AToB(vec3(0, 0, 1), n_map);
	return R*n_map;

}




//mat3 cotangent_frame( vec3 N, vec3 p, vec2 uv )
//{
//    // get edge vectors of the pixel triangle
//    vec3 dp1 = dFdx( p );
//    vec3 dp2 = dFdy( p );
//    vec2 duv1 = dFdx( uv );
//    vec2 duv2 = dFdy( uv );
// 
//    // solve the linear system
//    vec3 dp2perp = cross( dp2, N );
//    vec3 dp1perp = cross( N, dp1 );
//    vec3 T = dp2perp * duv1.x + dp1perp * duv2.x;
//    vec3 B = dp2perp * duv1.y + dp1perp * duv2.y;
// 
//    float invmax = inversesqrt( max( dot(T,T), dot(B,B) ) );
//    return mat3( T * invmax, B * invmax, N );
//}
//
//
//vec3 perturb_normal( vec3 N, vec3 V, vec2 texcoord )
//{
//    // assume N, the interpolated vertex normal and 
//    // V, the view vector (vertex to eye)
//    vec3 map = texture2D( u_earth_normal, texcoord ).xyz;
//    map = map * 255./127. - 128./127.;
//    map.z = sqrt( 1. - dot( map.xy, map.xy ) );
//    map.y = -map.y;
//    mat3 TBN = cotangent_frame( N, -V, texcoord );
//    return normalize( TBN * map );
//}







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
	hit_rec.point = pos + t*dir;


	hit_rec.normal = normalize((hit_rec.point-hit_rec.origo) / sphere.w);

	return true;
}

bool intersectPlane(in vec3 pos, in vec3 dir, in Plane plane, out HitRec hit_rec, in int ind)
{
	if (dot(dir, plane.n) > 0)
	{
		return false;
	}

	float t = (dot(plane.n,(plane.q - pos))) / (dot(plane.n, dir));

	if (t < EPSILON )
	{
		return false;
	}
	hit_rec.ind = ind;
	hit_rec.t = t;
	hit_rec.origo = plane.q;
	hit_rec.point = pos + t*dir;
	hit_rec.normal = plane.n;
	
	return true;
}

bool intersectDisc(in vec3 pos, in vec3 dir, in Disc disc, out HitRec hit_rec, in int ind)
{
	Plane plane1;
	plane1.n = disc.n;
	plane1.q = disc.o;

    if (intersectPlane(pos, dir, plane1, hit_rec, ind)) 
	{ 
        vec3 p = pos + hit_rec.t*dir; 
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


bool intersectTriangle(in vec3 pos, in vec3 dir, in Triangle t, out HitRec hit_rec, in int ind) //Moller-Trumbore
{
  vec3 e1, e2;  //Edge1, Edge2
  vec3 P, Q, T;
  float det, inv_det, u, v;
  float t1;

  //Find vectors for two edges sharing V1
  e1 = t.B - t.A;
  e2 = t.C - t.A;
  //Begin calculating determinant - also used to calculate u parameter
  P = cross(dir, e2);
  //if determinant is near zero, ray lies in plane of triangle
  det = dot(e1, P);
  //NOT CULLING
  //if(det < EPSILON ) return false;
  inv_det = 1.f / det;

  //calculate distance from V1 to ray origin
  T = pos - t.A;

  //Calculate u parameter and test bound
  u = dot(T, P) * inv_det;
  //The intersection lies outside of the triangle
  if(u < 0.f || u > 1.f) return false;

  //Prepare to test v parameter
  Q = cross(T, e1);

  //Calculate V parameter and test bound
  v = dot(dir, Q) * inv_det;
  //The intersection lies outside of the triangle
  if(v < 0.f || u + v  > 1.f) return false;

  t1 = dot(e2, Q) * inv_det;

  if(t1 > EPSILON) { //ray intersection
		hit_rec.t = t1;
		hit_rec.ind = ind;
		hit_rec.point = pos + dir * t1;
		hit_rec.normal = normalize(cross(t.B-t.A, t.C-t.A));
		hit_rec.origo = (t.A+t.B+t.C)/3;
		return true;
  }

  // No hit, no win
  return false;
}

vec4 glow(in float d, in vec4 glow_)
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
	if (intersectPlane(pos, dir, plane01, hit_temp, spheres_count + triangles_count))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}

	if (intersectDisc(pos, dir, disc01, hit_temp, spheres_count + triangles_count + 1))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}

	if (intersectDisc(pos, dir, disc02, hit_temp, spheres_count + triangles_count + 2))
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

void trace(in Light u_lights[lights_count], in Material u_materials[materials_count], in vec3 pos, in vec3 dir, inout vec4 color, inout HitRec min_hit, float k)
{
	vec3 ref_dir;
	float min_t = -1;
	float u,v;
	vec2 uv;
	
	vec3 specular = vec3(0);
	if(findmin(pos, dir, min_hit))
	{
		u = 0.5 + atan(-min_hit.normal.z, -min_hit.normal.x)/(2*3.1415);
		v = 0.5 - asin(-min_hit.normal.y)/3.1415;
		u += u_rot/2;
		vec2 uv = vec2(u, v);
		if (min_hit.ind == 10)
		{
			//vec3 normalFromMap = (2*( (texture(u_earth_normal, min_hit.point.xz)).xyz ) - 1);

			//min_hit.normal = normalTransform(min_hit.normal, normalFromMap);
		}

		ref_dir = normalize(reflect(min_hit.point - pos, min_hit.normal));
		vec3 temp_col = u_materials[min_hit.ind].amb;
		vec3 diffuse = vec3(0);
		for (int j = 0; j < lights_count; ++j)
		{
			vec3 light_vec = u_lights[j].pos - min_hit.point;
			//float distance = length(light_vec);
			light_vec = normalize(light_vec);
			float diffintensity = clamp(dot(min_hit.normal, light_vec), 0, 1);
			
			specular = clamp(((u_materials[min_hit.ind].spec*u_lights[j].col)*pow(clamp(dot(light_vec, ref_dir),0,1), u_materials[min_hit.ind].pow))/(1), 0, 1);// /distance*distance mehetne, csak ronda lesz
			diffuse = clamp((u_materials[min_hit.ind].dif*diffintensity*u_lights[j].col)/(1),0,1);

			temp_col += diffuse + specular;
			if (u_shadow)
			{
				HitRec shadow_hit = min_hit;
				int ind = shadow_hit.ind;
				findmin(shadow_hit.point+1.5*shadow_hit.normal*EPSILON, u_lights[j].pos-shadow_hit.point, shadow_hit);
				if (shadow_hit.ind != 0 && shadow_hit.ind != 5 && shadow_hit.ind != 6 && shadow_hit.ind != spheres_count+triangles_count && shadow_hit.ind != ind)
				{
					temp_col *= 0.5f;
				}
			}
		}
		

		color += k*vec4(temp_col, 1);
			
		
		if (min_hit.ind == 0)
		{
			u += u_rot/5;
			v += u_rot/5;
			vec2 uv = vec2(u, v);
			color += k*(texture(u_sun_texture, -uv).bgra - vec4(temp_col + specular, 1) + vec4(0,0,0.5,1));
		}
		if (min_hit.ind == 3)
		{
				
			color *= k*(texture(u_earth_texture, -uv).bgra);
			if (color.z > color.x && color.z > color.y)
			{
				color += k*clamp(k*vec4(3*specular, 1), 0, 1);
				//fs_out_col = vec4(1,0,0,1);
			}
		}
		if (min_hit.ind == 4)
		{
			u += u_rot/7;
			//uv = vec2(u, v);
			color *= k*texture(u_moon_texture, -uv).bgra;
		}
		if (min_hit.ind == spheres_count+triangles_count)
		{
			color *= k*texture(u_plane_texture, 0.05*min_hit.point.xz).bgra;
		}
		//fs_out_col = texture(u_sky_texture, vs_out_pos.xy) + glow;


	}
	else if (!sky_hit)
	{
		color += vec4(k*vec3(0.25, 0.25, 0.75),1);
		sky_hit = true;
	}

	
	//glow
	vec3 vec = u_spheres[0].xyz - pos;
	vec3 direction = normalize(dir);
	float t = dot(vec, direction);
	vec3 hit_point = pos + t*direction;
	float d = length(hit_point);
	vec4 glowcolor = vec4(1,0.95,0.1,1);
	vec4 glowness;
	if ((length(min_hit.point-u_spheres[0].xyz) > 4.0f && length(min_hit.point-u_eye) < length(u_spheres[0].xyz - u_eye)) || t < 0)
	{
		glowness = vec4(0);
	}
	else
	{
		glowness = glow(d, glowcolor);
	}
	color += k*glowness;
}


/*bool refraction(in vec3 in_dir, in vec3 normal, in float eta, inout vec3 out_dir)
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
}*/


void main()
{	
	vec4 color = vec4(0);
	HitRec min_hit;
	//HitRec last_min_hit;
	
	float ray_eta = 1.0f;
	
	color = vec4(0);
	float k1 = 1f;

	vec3 ray_dir = normalize(vs_out_ray);
	vec3 ray_origin = u_eye;
	vec3 temp_ray = vec3(0);

	for (int i = 0; i < u_depth; ++i)
	{
		if (sky_hit) break;
		trace(u_lights, u_materials, ray_origin+temp_ray, ray_dir, color, min_hit, k1);
		
		
		
		//mirror
		if (u_materials[min_hit.ind].pow >= 120 || (min_hit.ind == 3 && (color.z > color.x && color.z > color.y)))
		{
			ray_dir = normalize(reflect(ray_dir, min_hit.normal));
			ray_origin = min_hit.point+1.5*min_hit.normal*EPSILON;
			k1 = 0.5;
		}
		
		//glass
		else if (u_materials[min_hit.ind].pow < 120 && u_materials[min_hit.ind].pow >= 100)
		{
			float eta = 1.52f;
			vec3 temp_ray = ray_dir;
			
			ray_dir = dot(ray_dir, min_hit.normal) < 0 ? refract(ray_dir, min_hit.normal, 1/eta) : refract(ray_dir, -min_hit.normal, eta);

			if (ray_dir == vec3(0.0))
			{
				ray_dir = normalize(reflect(temp_ray, min_hit.normal));
				ray_origin = min_hit.point - 1.5*min_hit.normal*EPSILON;
				continue;
			}
			ray_origin = min_hit.point + ray_dir*EPSILON;
			ray_dir = normalize(ray_dir);

			k1 = 0.5;

		}
		else
		{
			break;
		}

		//last_min_hit = min_hit;
	}

	fs_out_col = color;
}