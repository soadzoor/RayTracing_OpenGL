#pragma once

#define spheresCount 10

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
	float time = 0.0;

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

	GLint colorModeInTernary0Location;
	GLint colorModeInTernary1Location;
	GLint colorModeInTernary2Location;
};

