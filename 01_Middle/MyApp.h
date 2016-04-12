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
	static int const spheres_count = 10; //10 vagy 110
	static int const triangles_count = 2;
	static int const lights_count = 3;
	static int const materials_count = spheres_count + triangles_count + 3;
	

	glm::vec4 arrayOfSpheres[spheres_count];

	

	GLuint m_SunTextureID;
	GLuint m_EarthTextureID;
	GLuint m_EarthNormalID;
	GLuint m_MoonTextureID;
	GLuint m_MoonNormalID;
	GLuint m_PlaneTextureID;
	//GLuint m_SkyTextureID;


	struct Light
	{
		glm::vec3 col;
		glm::vec3 pos;
	};
	struct Material
	{
		glm::vec3 amb;
		glm::vec3 dif;
		glm::vec3 spec;
		float pow;
	};
	
	Light lights[lights_count];
	Triangle arrayOfTriangles[triangles_count];
	Material materials[materials_count];
	Plane plane01;
	Disc disc01;
	Disc disc02;

	// belsõ eljárások
	GLuint GenTexture();

	// OpenGL-es dolgok
	GLuint m_textureID; // textúra erõforrás azonosító

	gCamera			m_camera;
	gShaderProgram	m_program;
	gVertexBuffer	m_vb;
};

