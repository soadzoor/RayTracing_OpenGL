#pragma once

#define spheresCount 110
#define trianglesCount 14
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
	bool isGlowOn     = true;
	bool vsync        = true;
	float pausedTime     = 0;
	float curElapsedTime = 0;
	float sumElapsedTime = 0;
	int depth = 8;
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
	//static const int materialsCount = spheresCount + trianglesCount + discsCount + toriCount + skyboxCount;
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

	struct Sphere
	{
		glm::vec4 vec = glm::vec4(0.0);
		GLuint Location = 0;
		Sphere() : vec(glm::vec4(0.0)), Location(0) {};
		Sphere(glm::vec4 v, GLuint loc) : vec(v), Location(loc) {};
	};
	Sphere spheres[spheresCount];

	struct Triangle
	{
		glm::vec3 A;
		glm::vec3 B;
		glm::vec3 C;
		GLint ALocation;
		GLint BLocation;
		GLint CLocation;
		Triangle(glm::vec3 a, glm::vec3 b, glm::vec3 c, GLint locA, GLint locB, GLint locC) : A(a), B(b), C(c), ALocation(locA), BLocation(locB), CLocation(locC) {};
		Triangle() : A(glm::vec3(0.0)), B(glm::vec3(0.0)), C(glm::vec3(0.0)) {};
	};
	struct Torus
	{
		glm::vec2 vec;
		GLint Location;
		Torus() : vec(glm::vec3(0.0)), Location(0) {};
		Torus(glm::vec2 Rr, GLint loc) : vec(Rr), Location(loc) {};
	};
	Torus torus;
	struct Plane
	{
		glm::vec3 n;
		glm::vec3 q;
		GLint nLocation;
		GLint qLocation;
	};

	struct Disc
	{
		glm::vec3 o, n;
		float r;
		GLint oLocation;
		GLint nLocation;
		GLint rLocation;
	};

	struct Light
	{
		glm::vec3 col;
		glm::vec3 pos;
		GLint colLocation;
		GLint posLocation;
	};
	
	Light    lights[lightsCount];
	Triangle triangles[trianglesCount];
	Disc     ground;

	Plane skyboxBack;
	Plane skyboxDown;
	Plane skyboxFront;
	Plane skyboxLeft;
	Plane skyboxRight;
	Plane skyboxUp;

	

	// belsõ eljárások
	//glm::vec3 getF0(glm::vec3 n, glm::vec3 k);

	// OpenGL stuff

	gCamera			camera;
	gShaderProgram	program;
	gVertexBuffer	vb;

	// Uniform locations

	GLint eyeLocation;
	GLint upLocation;
	GLint fwLocation;
	GLint rightLocation;
	GLint ratioLocation;
	GLint timeLocation;
	GLint isShadowOnLocation;
	GLint useNormalMapLocation;
	GLint isGlowOnLocation;
	GLint showTorusLocation;
	GLint depthLocation;

	GLint sunTextureLocation;
	GLint earthTextureLocation;
	GLint earthNormalMapLocation;
	GLint moonTextureLocation;
	GLint moonNormalMapLocation;
	GLint groundTextureLocation;
	GLint skyboxTextureBackLocation;
	GLint skyboxTextureDownLocation;
	GLint skyboxTextureFrontLocation;
	GLint skyboxTextureLeftLocation;
	GLint skyboxTextureRightLocation;
	GLint skyboxTextureUpLocation;
	GLint skyboxDistanceLocation;

	GLint colorModeInTernary0Location;
	GLint colorModeInTernary1Location;
	GLint colorModeInTernary2Location;
};

