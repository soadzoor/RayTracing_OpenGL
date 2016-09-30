#pragma once

// GLEW
#include <GL/glew.h>

// SDL
#include <SDL.h>
#include <SDL_opengl.h>

// GLM
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtx/transform2.hpp>

#include "gCamera.h"
#include "gShaderProgram.h"
#include "gVertexBuffer.h"
#include "Mesh_OGL3.h"

class CMyApp
{
public:
	CMyApp(void);
	~CMyApp(void);

	int depth;
	bool mirror_spheres;
	bool pause;
	bool shadow;
	bool useNormalMap = true;
	bool glow = false;
	bool vsync = true;
	float pausedTime = 0;
	float curElapsedTime = 0;
	float sumElapsedTime = 0;
	

	


	bool Init();
	void Clean();

	void Update();
	void Render();

	void KeyboardDown(SDL_KeyboardEvent&);
	void KeyboardUp(SDL_KeyboardEvent&);
	void MouseMove(SDL_MouseMotionEvent&);
	void MouseDown(SDL_MouseButtonEvent&);
	void MouseUp(SDL_MouseButtonEvent&);
	void MouseWheel(SDL_MouseWheelEvent&);
	void Resize(int, int);

protected:
	//raytrace specifikusak
	static int const spheres_count = 10; //10, +100
	static int const triangles_count = 2;
	static int const discs_count = 1;
	static int const tori_count = 1;
	static int const skybox_count = 6;
	static int const lights_count = 3;
	static int const materials_count = spheres_count + triangles_count + discs_count + tori_count + skybox_count;
	static int const skybox_distance = 100.0;
	

	glm::vec4 arrayOfSpheres[spheres_count];
	glm::vec2 torus;

	

	GLuint m_SunTextureID;
	GLuint m_EarthTextureID;
	GLuint m_EarthNormalID;
	GLuint m_MoonTextureID;
	GLuint m_MoonNormalID;
	GLuint m_GroundTextureID;
	
	GLuint m_SkyboxTexture_back;
	GLuint m_SkyboxTexture_down;
	GLuint m_SkyboxTexture_front;
	GLuint m_SkyboxTexture_left;
	GLuint m_SkyboxTexture_right;
	GLuint m_SkyboxTexture_up;

	struct Triangle
	{
		glm::vec3 A;
		glm::vec3 B;
		glm::vec3 C;
	};

	struct Plane
	{
		glm::vec3 n;
		glm::vec3 q;
	};

	struct Disc
	{
		glm::vec3 o, n;
		float r;
	};

	struct Light
	{
		glm::vec3 col;
		glm::vec3 pos;
	};
	struct Material
	{
		glm::vec3 amb = glm::vec3(0.0);
		glm::vec3 dif = glm::vec3(0.0);
		glm::vec3 spec = glm::vec3(0.0);
		float pow;
		bool refractive;
		bool reflective;
		float n = 1.0f;
		glm::vec3 f0 = glm::vec3(0.0);
	};
	
	Light lights[lights_count];
	Triangle arrayOfTriangles[triangles_count];
	Material materials[materials_count];
	Disc ground;

	Plane skybox_back;
	Plane skybox_down;
	Plane skybox_front;
	Plane skybox_left;
	Plane skybox_right;
	Plane skybox_up;

	// belsõ eljárások
	glm::vec3 getF0(glm::vec3 n, glm::vec3 k);

	// OpenGL-es dolgok

	gCamera			m_camera;
	gShaderProgram	m_program;
	gVertexBuffer	m_vb;
};

