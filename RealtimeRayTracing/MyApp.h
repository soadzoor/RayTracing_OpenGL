#pragma once

#define spheresCount 10
#define trianglesCount 2
#define discsCount 1
#define toriCount 1
#define skyboxCount 6
#define lightsCount 3
#define skyboxDistance 10000.0

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

#include <string>

class CMyApp
{
public:
	CMyApp(void);
	~CMyApp(void);

	bool pause        = false;
	bool isShadowOn   = false;
	bool useNormalMap = true;
	bool isGlowOn     = false;
	bool showTorus    = false;
	bool vsync        = true;
	float pausedTime     = 0;
	float curElapsedTime = 0;
	float sumElapsedTime = 0;
	int depth = 1;
	int currentColorMode = 5;

	void colorModeToTernary(int currentColorMode);
	int colorModeInTernary[3];

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
	glm::vec4 spheres[spheresCount];
	glm::vec2 torus;
	static const int materialsCount = spheresCount + trianglesCount + discsCount + toriCount + skyboxCount;
	const std::string colorModes[27] = {"RRR", "RRG", "RRB",
										"RGR", "RGG", "RGB",
										"RBR", "RBG", "RBB",
										"GRR", "GRG", "GRB",
										"GGR", "GGG", "GGB",
										"GBR", "GBG", "GBB",
										"BRR", "BRG", "BRB",
										"BGR", "BGG", "BGB",
										"BBR", "BBG", "BBB"};


	GLuint sunTexture	  = 0;
	GLuint earthTexture	  = 0;
	GLuint earthNormalMap = 0;
	GLuint moonTexture	  = 0;
	GLuint moonNormalMap  = 0;
	GLuint groundTexture  = 0;
	
	GLuint skyboxTextureBack  = 0;
	GLuint skyboxTextureDown  = 0;
	GLuint skyboxTextureFront = 0;
	GLuint skyboxTextureLeft  = 0;
	GLuint skyboxTextureRight = 0;
	GLuint skyboxTextureUp	  = 0;

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
		glm::vec3 amb  = glm::vec3(0.0);
		glm::vec3 dif  = glm::vec3(0.0);
		glm::vec3 spec = glm::vec3(0.0);
		float pow;
		bool refractive;
		bool reflective;
		float n = 1.0f;
		glm::vec3 f0 = glm::vec3(0.0);
	};
	
	Light    lights[lightsCount];
	Triangle triangles[trianglesCount];
	Material materials[materialsCount];
	Disc     ground;

	Plane skyboxBack;
	Plane skyboxDown;
	Plane skyboxFront;
	Plane skyboxLeft;
	Plane skyboxRight;
	Plane skyboxUp;

	

	// belsõ eljárások
	glm::vec3 getF0(glm::vec3 n, glm::vec3 k);

	// OpenGL-es dolgok

	gCamera			camera;
	gShaderProgram	program;
	gVertexBuffer	vb;
};

