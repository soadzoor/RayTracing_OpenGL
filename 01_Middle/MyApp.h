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
	static int const spheres_count = 10;
	static int const triangles_count = 2;
	glm::vec4 arrayOfSpheres[spheres_count];

	

	GLuint m_SunTextureID;
	GLuint m_EarthTextureID;
	GLuint m_MoonTextureID;
	GLuint m_SkyTextureID;

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
	struct Triangle
	{
		glm::vec3 A;
		glm::vec3 B;
		glm::vec3 C;
	};
	Light lights[2];
	Triangle arrayOfTriangles[triangles_count];
	Material materials[spheres_count + triangles_count];

	// belsõ eljárások
	GLuint GenTexture();

	// OpenGL-es dolgok
	GLuint m_textureID; // textúra erõforrás azonosító

	gCamera			m_camera;
	gShaderProgram	m_program;
	gVertexBuffer	m_vb;
};

