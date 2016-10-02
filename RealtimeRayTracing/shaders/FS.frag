#version 130

#define EPSILON 0.001
#define PI 3.14159265359
#define STACK_SIZE 16
#define spheresCount 10
#define trianglesCount 2
#define discsCount 1
#define toriCount 1
#define skyboxCount 6
#define materialsCount spheresCount + trianglesCount + discsCount + toriCount + skyboxCount
#define lightsCount 3

// pipeline-ból bejövõ per-fragment attribútumok
in vec3 vsRay;

// kimenõ érték - a fragment színe
out vec4 fragColor;

uniform vec3 eye;

uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;

uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;

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
	vec3 n; // the plane's normal
	vec3 q; // a point on the plane
};
struct Disc
{
	vec3  o;
	float r;
	vec3  n;
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

uniform Light lights[lightsCount];
uniform vec4 spheres[spheresCount];
uniform vec2 torus;
uniform Triangle triangles[trianglesCount];
uniform Material materials[materialsCount];
uniform float time;
uniform float skyboxRatio;


uniform Disc ground;
uniform Plane skyboxBack;
uniform Plane skyboxDown;
uniform Plane skyboxFront;
uniform Plane skyboxLeft;
uniform Plane skyboxRight;
uniform Plane skyboxUp;

uniform int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform bool showTorus;

struct Stack
{
	Ray ray;
	vec3 coeff;
	int depth;
};


//double cbrt(double x) 
//{    
//    if (abs(x) < EPSILON) return 0;
//	bool isNegativ = x < 0.0;
//    if (isNegativ)
//	{
//		x *= -1;
//	}
//
//    double r = x;
//    double ex = 0;
//
//    while (r < 0.125) { r *= 8; ex--; }
//    while (r > 1.0) { r *= 0.125; ex++; }
//
//    r = (-0.46946116 * r + 1.072302) * r + 0.3812513;
//
//    while (ex < 0) { r *= 0.5; ex++; }
//    while (ex > 0) { r *= 2; ex--; }
//
//    r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
//    r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
//    r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
//    r = (2.0 / 3.0) * r + (1.0 / 3.0) * x / (r * r);
//
//    return isNegativ ? -r : r;
//}
//double cbrt(double n)
//{	
//	double guess = n/2.0;
//	double result;
//	for (int i = 0; i < n; ++i)
//	{
//	    result = n / guess;
//	    guess = (guess + result) / 2.0;
//	}
//	return result;
//}

//double taylor(double x)
//{
//	double sq3 = sqrt(3.0);
//	return sq3/2.0 + x/6.0 - x*x/(12.0*sq3) + 2.0*x*x*x / 81.0 - 35.0*x*x*x*x/(1296.0*sq3) + 8.0*x*x*x*x*x/729.0 - 1001.0*sq3*x*x*x*x*x*x/209952.0 + 128.0*x*x*x*x*x*x*x/19683.0 - 46189.0*sq3*x*x*x*x*x*x*x*x/15116544.0 + 7040.0*x*x*x*x*x*x*x*x*x/1594323.0;// - 5311735*sq3*x*x*x*x*x*x*x*x*x*x/48880128.0 + 46592.0*x*x*x*x*x*x*x*x*x*x*x/14348907.0 - 434113615.0*sq3*x*x*x*x*x*x*x*x*x*x*x*x/264479053824.0 + 974848.0*x*x*x*x*x*x*x*x*x*x*x*x*x / 387420489.0 - 6177770675.0*sq3*x*x*x*x*x*x*x*x*x*x*x*x*x*x/4760622968832.0 + 21168128.0*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x / 10460353203.0 - 2178281940005.0*sq3*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x/2056589122535424.0 + 157515776.0*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x*x/94143178827.0;
//}

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

	float cosAngle = dot(normal, vec3(0, 0, 1));
	float angle = acos(cosAngle);
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
	if (dot(ray.dir, plane.n) > 0) //culling
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

bool intersectTorus(in Ray ray, in vec2 torus, out HitRec hit_rec, in int ind)
{
	ray.origin.z -= 40.0;
	float Ra2 = torus.x*torus.x;
	float ra2 = torus.y*torus.y;
	
	float m = dot(ray.origin, ray.origin);
	float n = dot(ray.origin, ray.dir);
		
	float k = (m - ra2 - Ra2)/2.0;
	float a = n;
	float b = n*n + Ra2*ray.dir.y*ray.dir.y + k;
	float c = k*n + Ra2*ray.origin.y*ray.dir.y;
	float d = k*k + Ra2*ray.origin.y*ray.origin.y - Ra2*ra2;
	
    //----------------------------------

	float p = -3.0*a*a     + 2.0*b;
	float q =  2.0*a*a*a   - 2.0*a*b   + 2.0*c;
	float r = -3.0*a*a*a*a + 4.0*a*a*b - 8.0*a*c + 4.0*d;
	p /= 3.0;
	r /= 3.0;
	float Q = p*p + r;
	float R = 3.0*r*p - p*p*p - q*q;
	
	float h = R*R - Q*Q*Q;
	float z = 0.0;
	if( h < 0.0 )
	{
		float sQ = sqrt(Q);
		z = 2.0*sQ*cos( acos((R/(sQ*Q))) / 3.0 );
	}
	else
	{
		float sQ = pow( sqrt(h) + abs(R), 1.0/3.0 );
		z = sign(R)*abs( sQ + Q/sQ );

	}
	
	z = p - z;
	
    //----------------------------------
	
	float d1 = z   - 3.0*p;
	float d2 = z*z - 3.0*r;

	if( abs(d1)<EPSILON )
	{
		if( d2<0.0 ) return false;
		d2 = sqrt(d2);
	}
	else
	{
		if( d1<0.0 ) return false;
		d1 = sqrt( d1/2.0 );
		d2 = q/d1;
	}

    //----------------------------------
	
	float result = 1e20;

	h = d1*d1 - z + d2;
	if( h>0.0 )
	{
		h = sqrt(h);
		float t1 = -d1 - h - a;
		float t2 = -d1 + h - a;
		     if( t1>0.0 ) result=t1;
		else if( t2>0.0 ) result=t2;
	}

	h = d1*d1 - z - d2;
	if( h>0.0 )
	{
		h = sqrt(h);
		float t1 = d1 - h - a;
		float t2 = d1 + h - a;
		     if( t1>0.0 ) result=min(result,t1);
		else if( t2>0.0 ) result=min(result,t2);
	}
	
    if (result > 0.0 && result < 100.0) //hit
    {
        hit_rec.t = result;
        hit_rec.point = ray.origin + hit_rec.t*ray.dir;
		hit_rec.ind = ind;
        hit_rec.normal = normalize( hit_rec.point*(dot(hit_rec.point,hit_rec.point)- torus.y*torus.y - torus.x*torus.x*vec3(1.0,-1.0,1.0)));
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
	
	for (int i = 0; i < spheresCount; ++i) 
	{
		if (intersectSphere(ray, spheres[i], hit_temp, i))
		{
			
			if (hit_temp.t < min_t || min_t < 0)
			{
				min_t = hit_temp.t;
				hit_rec = hit_temp;
			}
			hit = true;
		}
	}
	for (int i = spheresCount; i < spheresCount + trianglesCount; ++i)
	{
		if (intersectTriangle(ray, triangles[i-spheresCount], hit_temp, i))
		{
			if (hit_temp.t < min_t || min_t < 0)
			{
				min_t = hit_temp.t;
				hit_rec = hit_temp;
			}
			hit = true;
		}
	}
	if (intersectDisc(ray, ground, hit_temp, spheresCount + trianglesCount))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (showTorus ? intersectTorus(ray, torus, hit_temp, spheresCount + trianglesCount + 1) : false)
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxBack, hit_temp, spheresCount + trianglesCount + 2))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxDown, hit_temp, spheresCount + trianglesCount + 3))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxFront, hit_temp, spheresCount + trianglesCount + 4))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxLeft, hit_temp, spheresCount + trianglesCount + 5))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxRight, hit_temp, spheresCount + trianglesCount + 6))
	{
		if (hit_temp.t < min_t || min_t < 0)
		{
			min_t = hit_temp.t;
			hit_rec = hit_temp;
		}
		hit = true;
	}
	if (intersectPlane(ray, skyboxUp, hit_temp, spheresCount + trianglesCount + 7))
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

vec3 shade(in HitRec closestHit, in Ray ray)
{
	vec3 refDir = normalize(reflect(closestHit.point - ray.origin, closestHit.normal));
	vec3 color = materials[closestHit.ind].amb;
	vec3 diffuse = vec3(0.0);
	vec3 specular = vec3(0.0);

	for (int j = 0; j < lightsCount; ++j)
	{
		vec3 toLight = lights[j].pos - closestHit.point;
		//float distance = length(toLight);
		toLight = normalize(toLight);
		float diffintensity = clamp(dot(closestHit.normal, toLight), 0.0, 1.0);
			
		specular = clamp(((materials[closestHit.ind].spec*lights[j].col)*pow(clamp(dot(toLight, refDir), 0.0, 1.0), materials[closestHit.ind].pow)), 0.0, 1.0);
		diffuse = clamp((materials[closestHit.ind].dif*diffintensity*lights[j].col), 0.0, 1.0);

			
		if (isShadowOn)
		{
			HitRec shadowHit = closestHit;
			int ind = shadowHit.ind;
			Ray shadowRay;
			shadowRay.origin = shadowHit.point+1.5*shadowHit.normal*EPSILON;
			shadowRay.dir = lights[j].pos-shadowHit.point;
			findmin(shadowRay, shadowHit);
			if (shadowHit.ind != 0 && shadowHit.ind != 5 && shadowHit.ind != 6 && shadowHit.ind != spheresCount+trianglesCount && shadowHit.ind != ind && ind <= spheresCount + trianglesCount)
			{
				specular = vec3(0.0); 
				diffuse = vec3(0.0);
			}
		}
		color += diffuse + specular;
	}

	return color;
}

vec3 fresnel(in vec3 dir, in vec3 normal, in vec3 f0)
{
	float cosa = abs(dot(normal, dir));
	vec3 f = f0 + (vec3(1.0)-f0)*pow((1-cosa), 5);

	return f;
}

vec3 trace(Ray ray) //https://www.cg.tuwien.ac.at/research/publications/2013/Voglsam_2013_RRT/Voglsam_2013_RRT-Thesis.pdf
{
	vec3 color = vec3(0);
	HitRec closestHit;
	float u,v;
	vec2 uv;

	Stack stack[STACK_SIZE]; // max depth
	int stack_size = 0; // current depth
	int bounceCount = 1;
	vec3 coeff = vec3(1.0);
	bool continueLoop = true;
	float f = 1.0;

	while (continueLoop)
	{
		if(findmin(ray, closestHit))
		{
			u = 0.5 + atan(-closestHit.normal.z, -closestHit.normal.x)/(2*PI);
			v = 0.5 - asin(-closestHit.normal.y)/PI;

			if (useNormalMap)
			{
				if (closestHit.ind == 3)
				{
					u += time/2;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2*( (texture(earthNormalMap, -uv)).bgr ) - 1);
			
					mat3 R = calculateR(closestHit.normal);
					closestHit.normal = R*normalFromMap;
				}
				else if (closestHit.ind == 4)
				{
					u += time/7;
					uv = vec2(u, v);
					vec3 normalFromMap = normalize(2*( (texture(moonNormalMap, -uv)).bgr ) - 1);
			
					mat3 R = calculateR(closestHit.normal);
					closestHit.normal = R*normalFromMap;
				}
			}
			
			bounceCount++;
			
			Material mat = materials[closestHit.ind];
			vec3 shade_col = closestHit.ind == 0 ? mat.amb : shade(closestHit, ray);
		
			color += shade_col*coeff;
			
			if (closestHit.ind == 0) //sun
			{
				u += time/5;
				v += time/5;
				vec2 uv = vec2(u, v);
				color *= texture(sunTexture, -uv).bgr + vec3(0,0,0.5);
			}
			else if (closestHit.ind == 3) //earth
			{
				if (!useNormalMap)
				{
					u += time/2;
				}
			
				vec2 uv = vec2(u, v);
				color *= texture(earthTexture, -uv).bgr;
			}
			else if (closestHit.ind == 4) //moon
			{
				if (!useNormalMap)
				{
					u += time/7;
				}
				vec2 uv = vec2(u, v);
				color *= texture(moonTexture, -uv).bgr;
			}
			else if (closestHit.ind == spheresCount+trianglesCount) //ground
			{
				color *= texture(groundTexture, 0.15*closestHit.point.xz).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 2) //skyboxBack
			{
				color *= texture(skyboxTextureBack, (-closestHit.point.xy + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 3) //skyboxDown
			{
				color *= texture(skyboxTextureDown, (closestHit.point.xz + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 4) //skyboxFront
			{
				color *= texture(skyboxTextureFront, (closestHit.point.xy*vec2(1, -1) + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 5) //skyboxLeft
			{
				color *= texture(skyboxTextureLeft, (closestHit.point.yz + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 6) //skyboxRight
			{
				color *= texture(skyboxTextureRight, (closestHit.point.zy*vec2(1, -1) + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			else if (closestHit.ind == spheresCount + trianglesCount + 7) //skyboxUp
			{
				color *= texture(skyboxTextureUp, (closestHit.point.xz + vec2(skyboxRatio/2.0, skyboxRatio/2.0)) / skyboxRatio).bgr;
			}
			if ((mat.reflective || mat.refractive) && bounceCount <= depth)
			{
				//glass
				if (mat.refractive)
				{
					float eta = 1/mat.n;
					vec3 temp_ray = ray.dir;
					Ray refractedRay;

					//                     coming from outside the object  ?                        yes                                       no
					refractedRay.dir = dot(ray.dir, closestHit.normal) < 0.0 ? refract(ray.dir, closestHit.normal, eta) : refract(ray.dir, -closestHit.normal, 1/eta);
				
					if (refractedRay.dir == vec3(0.0)) //total internal reflection
					{
						ray.dir = normalize(reflect(temp_ray, closestHit.normal));
						ray.origin = closestHit.point - 1.5*closestHit.normal*EPSILON;
						coeff = coeff*fresnel(ray.dir, closestHit.normal, mat.f0);
					}
					else
					{
						refractedRay.origin = closestHit.point + closestHit.normal*EPSILON*sign(dot(ray.dir, closestHit.normal));
						refractedRay.dir = normalize(refractedRay.dir);
						
						if (!mat.reflective)
						{
							ray = refractedRay;
						}
						else
						{
							stack[stack_size].coeff = coeff*(vec3(1.0) - fresnel(ray.dir, closestHit.normal, mat.f0));
							stack[stack_size].depth = bounceCount;
							stack[stack_size++].ray = refractedRay;
						}
					}
				}
				//mirror
				if (mat.reflective && (closestHit.ind != 3 || (closestHit.ind == 3 && color.z > color.x && color.z > color.y))) //A fold csak a vizen tukrozodjon
				{
					if (dot(ray.dir, closestHit.normal) >= 0.0)
					{
						if (bounceCount > 2)
						{
							continueLoop = false; //igy gyorsabb, es nincs nagy kulonbseg latvanyban
						}
						else
						{
							coeff = coeff*fresnel(ray.dir, -closestHit.normal, mat.f0);
							ray.dir = normalize(reflect(ray.dir, -closestHit.normal));
							ray.origin = closestHit.point - 1.5*closestHit.normal*EPSILON;
						}
					}
					else
					{
						coeff = coeff*fresnel(ray.dir, closestHit.normal, mat.f0);
						ray.dir = normalize(reflect(ray.dir, closestHit.normal));
						ray.origin = closestHit.point + 1.5*closestHit.normal*EPSILON;
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
			color += vec3(0.6, 0.75, 0.9)*coeff;
			continueLoop = false;
		}

		if (!continueLoop && stack_size > 0)
		{
			ray = stack[--stack_size].ray;
			bounceCount = stack[stack_size].depth;
			coeff = stack[stack_size].coeff;
			continueLoop = true;
		}
		//
		// glow
		//
		if (isGlowOn)
		{
			vec3 vec = spheres[0].xyz - ray.origin;
			vec3 direction = normalize(ray.dir);
			float t = abs(dot(vec, direction));
			vec3 hitPoint = ray.origin + t*direction;
			float d = length(hitPoint);
			vec3 glowcolor = vec3(1,0.95,0.1);
			vec3 glowness;
			if (length(closestHit.point-eye)+spheres[0].w < length(spheres[0].xyz - eye))
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
	ray.origin = eye;
	ray.dir = normalize(vsRay);
	vec3 color = trace(ray);

	fragColor = vec4(color, 1);
}