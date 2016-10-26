#include "MyApp.h"
#include "GLUtils.hpp"

#include <iostream>

#include <GL/GLU.h>
#include <math.h>

CMyApp::CMyApp(void)
{
}


CMyApp::~CMyApp(void)
{
}

//glm::vec3 CMyApp::getF0(glm::vec3 n, glm::vec3 k) //toresmutato, kioltasi tenyezo
//{
//	glm::vec3 f0 = ((n - glm::vec3(1.0))*(n - glm::vec3(1.0)) + k*k) / ((n + glm::vec3(1.0))*(n + glm::vec3(1.0)) + k*k);
//
//	return f0;
//}
void CMyApp::colorModeToTernary(int currentColorMode)
{
	colorModeInTernary[2] = currentColorMode % 3;
	currentColorMode /= 3;
	colorModeInTernary[1] = currentColorMode % 3;
	currentColorMode /= 3;
	colorModeInTernary[0] = currentColorMode % 3;
}

bool CMyApp::Init()
{
	glClearColor(0.125f, 0.25f, 0.5f, 1.0f);

	glEnable(GL_CULL_FACE);		// Discard back-facing triangles
	//glEnable(GL_DEPTH_TEST);	// Z-buffer test. Currently no need for this.

	camera = gCamera(glm::vec3(0.0, 0.0, 35.0), glm::vec3(0.0, 0.0, 0.0), glm::vec3(0.0, 1.0, 0.0));

	//
	// Loading shaders
	//
	program.AttachShader(GL_VERTEX_SHADER, "shaders/VS.vert");
	program.AttachShader(GL_FRAGMENT_SHADER, "shaders/FS.frag");

	program.BindAttribLoc(0, "vertPosition");

	if (!program.LinkProgram())
	{
		return false;
	}

	std::cout << std::endl << "Press WASD to move around" << std::endl;
	std::cout << "Hold left mouse button to look around" << std::endl;
	std::cout << "Hold left Shift to move slower" << std::endl;
	std::cout << "N: toggle normalmaps (bumpmaps) on the Earth and the Moon" << std::endl;
	std::cout << "1: toogle shadows" << std::endl;
	std::cout << "T: toggle Torus" << std::endl;
	std::cout << "G: toggle Glowing Effect on the Sun" << std::endl;
	std::cout << "V: toggle Vsync" << std::endl;
	std::cout << "P: pause scene" << std::endl;
	std::cout << "Left/Right arrow: change depth" << std::endl;
	std::cout << "Up/Down arrow: change ColorMode" << std::endl;
	std::cout << "Esc: exit FullScreen" << std::endl << std::endl;

	//
	// Spheres
	//
	spheres[0] = Sphere(glm::vec4(0, 0, 0, 1.4), glGetUniformLocation(program.getProgramId(), "spheres[0]")); // sun
	spheres[1] = Sphere(glm::vec4(0, 0, 0, 0.0), glGetUniformLocation(program.getProgramId(), "spheres[1]")); // green sphere
	spheres[2] = Sphere(glm::vec4(0, 0, 0, 0.0), glGetUniformLocation(program.getProgramId(), "spheres[2]")); // blue sphere
	spheres[3] = Sphere(glm::vec4(0, 0, 0, 0.0), glGetUniformLocation(program.getProgramId(), "spheres[3]")); // earth
	spheres[4] = Sphere(glm::vec4(0, 0, 0, 0.0), glGetUniformLocation(program.getProgramId(), "spheres[4]")); // moon

	//
	// Spheres of lightsources
	//
	spheres[5] = Sphere(glm::vec4(-2.0, 20.0, 0.0, 0.05), glGetUniformLocation(program.getProgramId(), "spheres[5]"));
	spheres[6] = Sphere(glm::vec4(20.0, 20.0, 0.0, 0.05), glGetUniformLocation(program.getProgramId(), "spheres[6]"));

	//
	// Red sphere with static position
	//
	spheres[7] = Sphere(glm::vec4(-2.0 + 0.3, 20.0 - 0.6, 0.0 - 0.3, 0.3), glGetUniformLocation(program.getProgramId(), "spheres[7]"));

	//
	// Golden sphere
	//
	spheres[8] = Sphere(glm::vec4(6, 0, -10, 1.4), glGetUniformLocation(program.getProgramId(), "spheres[8]"));

	//
	// Glass sphere
	//
	spheres[9] = Sphere(glm::vec4(-7, 0, 0, 1.4), glGetUniformLocation(program.getProgramId(), "spheres[9]"));
	
	// 10x10 mirror spheres (spheresCount == 10 --> disabled)

	//for (int i = 10; i < 20; ++i)
	//{
	//	for (int j = 0; j < 10; ++j)
	//	{
	//		char buffer[50];
	//		sprintf(buffer, "spheres[%i]", i);
	//		spheres[(i-10)*10+j+10] = Sphere(glm::vec4(20+i, -4, j, 0.4), glGetUniformLocation(program.getProgramId(), buffer));
	//	}
	//}

	//
	// Diamond
	//
	/*
	arrayOfTriangles[2].A = glm::vec3(-0.866, 1.5, 0.75);
	arrayOfTriangles[2].B = glm::vec3(-1.732,   0, 0.75);
	arrayOfTriangles[2].C = glm::vec3(-0.866, 0.5, 0.0 );
	
	arrayOfTriangles[3].A = glm::vec3(-0.866, 0.5, 0.0);
	arrayOfTriangles[3].B = glm::vec3(-1.732, 0, 0.75 );
	arrayOfTriangles[3].C = glm::vec3(-0.866, -0.5, 0.0);
	
	arrayOfTriangles[4].A = glm::vec3(-0.866, -0.5, 0.0);
	arrayOfTriangles[4].B = glm::vec3(-1.732, 0, 0.75);
	arrayOfTriangles[4].C = glm::vec3(-0.866, -1.5, 0.75);
	
	arrayOfTriangles[5].A = glm::vec3(-0.866, -0.5, 0.0);
	arrayOfTriangles[5].B = glm::vec3(-0.866, -1.5, 0.75);
	arrayOfTriangles[5].C = glm::vec3(0, -1, 0);
	
	arrayOfTriangles[6].A = glm::vec3(0, -1, 0);
	arrayOfTriangles[6].B = glm::vec3(-0.866, -1.5, 0.75);
	arrayOfTriangles[6].C = glm::vec3(0.866, -1.5, 0.75);
	
	arrayOfTriangles[7].A = glm::vec3(0, -1, 0);
	arrayOfTriangles[7].B = glm::vec3(0.866, -1.5, 0.75);
	arrayOfTriangles[7].C = glm::vec3(0.866, -0.5, 0.0);
	
	arrayOfTriangles[8].A = glm::vec3(0.866, -0.5, 0.0);
	arrayOfTriangles[8].B = glm::vec3(0.866, -1.5, 0.75);
	arrayOfTriangles[8].C = glm::vec3(1.732, 0, 0.75);
	
	arrayOfTriangles[9].A = glm::vec3(0.866, -0.5, 0.0);
	arrayOfTriangles[9].B = glm::vec3(1.732, 0, 0.75);
	arrayOfTriangles[9].C = glm::vec3(0.866, 0.5, 0.0);
	
	arrayOfTriangles[10].A = glm::vec3(0.866, 0.5, 0.0);
	arrayOfTriangles[10].B = glm::vec3(1.732, 0, 0.75);
	arrayOfTriangles[10].C = glm::vec3(0.866, 1.5, 0.75);
	
	arrayOfTriangles[11].A = glm::vec3(0.866, 0.5, 0.0);
	arrayOfTriangles[11].B = glm::vec3(0.866, 1.5, 0.75);
	arrayOfTriangles[11].C = glm::vec3(0, 1, 0);
	
	arrayOfTriangles[12].A = glm::vec3(0, 1, 0);
	arrayOfTriangles[12].B = glm::vec3(0.866, 1.5, 0.75);
	arrayOfTriangles[12].C = glm::vec3(-0.866, 1.5, 0.75);
	
	arrayOfTriangles[13].A = glm::vec3(0, 1, 0);
	arrayOfTriangles[13].B = glm::vec3(-0.866, 1.5, 0.75);
	arrayOfTriangles[13].C = glm::vec3(-0.866, 0.5, 0.0);

	arrayOfTriangles[14].A = glm::vec3(0, 1, 0);
	arrayOfTriangles[14].B = glm::vec3(-0.866, 0.5, 0);
	arrayOfTriangles[14].C = glm::vec3(0.0, 0.0, 0.0);
	
	arrayOfTriangles[15].A = glm::vec3(-0.866, 0.5, 0);
	arrayOfTriangles[15].B = glm::vec3(-0.866, -0.5, 0);
	arrayOfTriangles[15].C = glm::vec3(0.0, 0.0, 0.0);
	
	arrayOfTriangles[16].A = glm::vec3(-0.866, -0.5, 0);
	arrayOfTriangles[16].B = glm::vec3(0, -1, 0);
	arrayOfTriangles[16].C = glm::vec3(0.0, 0.0, 0.0);
	
	arrayOfTriangles[17].A = glm::vec3(0, -1, 0);
	arrayOfTriangles[17].B = glm::vec3(0.866, -0.5, 0);
	arrayOfTriangles[17].C = glm::vec3(0.0, 0.0, 0.0);
	
	arrayOfTriangles[18].A = glm::vec3(0.866, -0.5, 0);
	arrayOfTriangles[18].B = glm::vec3(0.866, 0.5, 0);
	arrayOfTriangles[18].C = glm::vec3(0.0, 0.0, 0.0);
	
	arrayOfTriangles[19].A = glm::vec3(0.866, 0.5, 0);
	arrayOfTriangles[19].B = glm::vec3(0, 1, 0);
	arrayOfTriangles[19].C = glm::vec3(0.0, 0.0, 0.0);

	arrayOfTriangles[20].A = glm::vec3(-0.866, 1.5, 0.75);
	arrayOfTriangles[20].B = glm::vec3(0.866, 1.5, 0.75);
	arrayOfTriangles[20].C = glm::vec3(0.0, 0.0, 3.0);
	
	arrayOfTriangles[21].A = glm::vec3(-1.732, 0, 0.75);
	arrayOfTriangles[21].B = glm::vec3(-0.866, 1.5, 0.75);
	arrayOfTriangles[21].C = glm::vec3(0.0, 0.0, 3.0);
	
	arrayOfTriangles[22].A = glm::vec3(-0.866, -1.5, 0.75);
	arrayOfTriangles[22].B = glm::vec3(-1.732,  0, 0.75);
	arrayOfTriangles[22].C = glm::vec3(0.0, 0.0, 3.0);
	
	arrayOfTriangles[23].A = glm::vec3(0.866, -1.5, 0.75);
	arrayOfTriangles[23].B = glm::vec3(-0.866, -1.5, 0.75);
	arrayOfTriangles[23].C = glm::vec3(0.0, 0.0, 3.0);
	
	arrayOfTriangles[24].A = glm::vec3(1.732, 0, 0.75);
	arrayOfTriangles[24].B = glm::vec3(0.866, -1.5, 0.75);
	arrayOfTriangles[24].C = glm::vec3(0.0, 0.0, 3.0);
	
	arrayOfTriangles[25].A = glm::vec3(0.866, 1.5, 0.75);
	arrayOfTriangles[25].B = glm::vec3(1.732, 0, 0.75);
	arrayOfTriangles[25].C = glm::vec3(0.0, 0.0, 3.0);

	for (int i = 2; i < 26; ++i)
	{
		arrayOfTriangles[i].A += glm::vec3(0, 0, 20);
		arrayOfTriangles[i].B += glm::vec3(0, 0, 20);
		arrayOfTriangles[i].C += glm::vec3(0, 0, 20);

	}
	*/

	//
	// Loading textures
	//
	sunTexture     = TextureFromFile("textures/sun.jpg");
	earthTexture   = TextureFromFile("textures/earth.jpg");
	earthNormalMap = TextureFromFile("textures/earthNormal.jpg");
	moonTexture    = TextureFromFile("textures/moon.jpg");
	moonNormalMap  = TextureFromFile("textures/moonNormal.jpg");
	groundTexture  = TextureFromFile("textures/grid.bmp"); //repeating
	
	skyboxTextureBack  = TextureFromFile("textures/skybox/backImage.jpg", true);
	skyboxTextureDown  = TextureFromFile("textures/skybox/downImage.jpg", true);
	skyboxTextureFront = TextureFromFile("textures/skybox/frontImage.jpg", true);
	skyboxTextureLeft  = TextureFromFile("textures/skybox/leftImage.jpg", true);
	skyboxTextureRight = TextureFromFile("textures/skybox/rightImage.jpg", true);
	skyboxTextureUp    = TextureFromFile("textures/skybox/upImage.jpg", true);

	//
	// Getting uniform locations
	//
	eyeLocation          = glGetUniformLocation(program.getProgramId(), "eye");
	upLocation           = glGetUniformLocation(program.getProgramId(), "up");
	fwLocation           = glGetUniformLocation(program.getProgramId(), "fw");
	rightLocation        = glGetUniformLocation(program.getProgramId(), "right");
	ratioLocation        = glGetUniformLocation(program.getProgramId(), "ratio");
	timeLocation         = glGetUniformLocation(program.getProgramId(), "time");
	isShadowOnLocation   = glGetUniformLocation(program.getProgramId(), "isShadowOn");
	useNormalMapLocation = glGetUniformLocation(program.getProgramId(), "useNormalMap");
	isGlowOnLocation     = glGetUniformLocation(program.getProgramId(), "isGlowOn");
	showTorusLocation    = glGetUniformLocation(program.getProgramId(), "showTorus");
	depthLocation        = glGetUniformLocation(program.getProgramId(), "depth");

	sunTextureLocation         = glGetUniformLocation(program.getProgramId(), "sunTexture");
	earthTextureLocation       = glGetUniformLocation(program.getProgramId(), "earthTexture");
	earthNormalMapLocation     = glGetUniformLocation(program.getProgramId(), "earthNormalMap");
	moonTextureLocation        = glGetUniformLocation(program.getProgramId(), "moonTexture");
	moonNormalMapLocation      = glGetUniformLocation(program.getProgramId(), "moonNormalMap");
	groundTextureLocation      = glGetUniformLocation(program.getProgramId(), "groundTexture");
	skyboxTextureBackLocation  = glGetUniformLocation(program.getProgramId(), "skyboxTextureBack");
	skyboxTextureDownLocation  = glGetUniformLocation(program.getProgramId(), "skyboxTextureDown");
	skyboxTextureFrontLocation = glGetUniformLocation(program.getProgramId(), "skyboxTextureFront");
	skyboxTextureLeftLocation  = glGetUniformLocation(program.getProgramId(), "skyboxTextureLeft");
	skyboxTextureRightLocation = glGetUniformLocation(program.getProgramId(), "skyboxTextureRight");
	skyboxTextureUpLocation    = glGetUniformLocation(program.getProgramId(), "skyboxTextureUp");

	colorModeInTernary0Location = glGetUniformLocation(program.getProgramId(), "colorModeInTernary[0]");
	colorModeInTernary1Location = glGetUniformLocation(program.getProgramId(), "colorModeInTernary[1]");
	colorModeInTernary2Location = glGetUniformLocation(program.getProgramId(), "colorModeInTernary[2]");

	//
	// Creating a square on the XY plane
	//
	vb.AddAttribute(0, 3);

	vb.AddData(0, -1, -1, 0); // A
	vb.AddData(0, 1, -1, 0);  // B
	vb.AddData(0, -1, 1, 0);  // D
	vb.AddData(0, 1, 1, 0);   // C

	vb.AddIndex(0, 1, 2); // 2 triangles with proper vertex positions = 1 square
	vb.AddIndex(3, 2, 1); //

	vb.InitBuffers();

	colorModeToTernary(currentColorMode);

	return true;
}

void CMyApp::Clean()
{
	glDeleteTextures(1, &sunTexture);
	glDeleteTextures(1, &earthTexture);
	glDeleteTextures(1, &earthNormalMap);
	glDeleteTextures(1, &moonTexture);
	glDeleteTextures(1, &moonNormalMap);
	glDeleteTextures(1, &groundTexture);
	glDeleteTextures(1, &skyboxTextureBack);
	glDeleteTextures(1, &skyboxTextureDown);
	glDeleteTextures(1, &skyboxTextureFront);
	glDeleteTextures(1, &skyboxTextureLeft);
	glDeleteTextures(1, &skyboxTextureRight);
	glDeleteTextures(1, &skyboxTextureUp);

	program.Clean();
}

void CMyApp::Update()
{
	static Uint32 lastTime = SDL_GetTicks();
	float deltaTime = (SDL_GetTicks() - lastTime)/1000.0f;

	camera.Update(deltaTime);

	lastTime = SDL_GetTicks();

}


void CMyApp::Render()
{
	//
	// Delete framepuffer (GL_COLOR_BUFFER_BIT) (currently we don't need Z puffer (GL_DEPTH_BUFFER_BIT))
	//
	glClear(GL_COLOR_BUFFER_BIT);
	
	//
	// Turn shader program on
	//
	program.On();
	//
	// Calculating current time, check if scene is paused
	//
	if (pause)
	{
		time = pausedTime - sumElapsedTime;
		curElapsedTime = SDL_GetTicks() / 1000.0f - pausedTime;
	}
	else
	{
		time = SDL_GetTicks() / 1000.0f - sumElapsedTime;
	}
	
	//
	// Moving specific spheres on a circle-shape
	//
	spheres[1].vec = glm::vec4(2 * sinf(time / 2), 0, 2 * cosf(time / 2), 0.26);
	spheres[2].vec = glm::vec4(2.5* cosf(time / 3), 0, 2.5 * sinf(time / 3), 0.18);
	spheres[3].vec = glm::vec4(5 * cosf(time / 5), 0, 5 * sinf(time / 5), 0.366);
	spheres[4].vec = glm::vec4(5 * cosf(time / 5) + 1.0*cosf(2 * time), 0, 5 * sinf(time / 5) + 1.0*sinf(2 * time), 0.1);
	//
	// Get momentous data from camera
	//
	glm::vec3 eye   = camera.GetEye();
	glm::vec3 fw    = camera.GetFw();
	glm::vec3 right = camera.GetRight();
	glm::vec3 up    = glm::cross(right, fw);
	//
	// Pass uniform variables to GPU
	//
	program.SetUniform(eyeLocation, eye);
	program.SetUniform(upLocation, up);
	program.SetUniform(fwLocation, fw);
	program.SetUniform(rightLocation, right);
	program.SetUniform(ratioLocation, camera.GetRatio());
	program.SetUniform(timeLocation, time);
	program.SetUniform(isShadowOnLocation, isShadowOn);
	program.SetUniform(useNormalMapLocation, useNormalMap);
	program.SetUniform(isGlowOnLocation, isGlowOn);
	program.SetUniform(showTorusLocation, showTorus);
	program.SetUniform(depthLocation, depth); // --> bounces count
	//
	// Pass spheres to GPU
	//
	for (int i = 0; i < spheresCount; ++i)
	{
		program.SetUniform(spheres[i].Location, spheres[i].vec);
	}
	//
	// Pass textures to GPU
	//
	program.SetTexture(sunTextureLocation,          0, sunTexture);
	program.SetTexture(earthTextureLocation,        1, earthTexture);
	program.SetTexture(earthNormalMapLocation,      2, earthNormalMap);
	program.SetTexture(moonTextureLocation,         3, moonTexture);
	program.SetTexture(moonNormalMapLocation,       4, moonNormalMap);
	program.SetTexture(groundTextureLocation,       5, groundTexture);
	program.SetTexture(skyboxTextureBackLocation,   6, skyboxTextureBack);
	program.SetTexture(skyboxTextureDownLocation,   7, skyboxTextureDown);
	program.SetTexture(skyboxTextureFrontLocation,  8, skyboxTextureFront);
	program.SetTexture(skyboxTextureLeftLocation,   9, skyboxTextureLeft);
	program.SetTexture(skyboxTextureRightLocation, 10, skyboxTextureRight);
	program.SetTexture(skyboxTextureUpLocation,    11, skyboxTextureUp);
	//
	// Pass color mode to GPU
	//
	program.SetUniform(colorModeInTernary0Location, colorModeInTernary[0]);
	program.SetUniform(colorModeInTernary1Location, colorModeInTernary[1]);
	program.SetUniform(colorModeInTernary2Location, colorModeInTernary[2]);
	


	//
	// Turn on VAO (VBO also turns on with it)
	//
	vb.On();
	//
	// Draw 2 triangles (1 square)
	//
	vb.DrawIndexed(GL_TRIANGLES, 0, 6, 0);
	//
	// Turn off VAO
	//
	vb.Off();
	//
	// Turn off shader program
	//
	program.Off();

}

void CMyApp::KeyboardDown(SDL_KeyboardEvent& key)
{
	camera.KeyboardDown(key);
	switch (key.keysym.sym)
	{
		case SDLK_LEFT:
		{
			if (depth > 1)
			{
				std::cout << "Depth: " << --depth << std::endl;
			}
			
			break;
		}
		case SDLK_RIGHT:
		{
			if (depth < 8)
			{
				std::cout << "Depth: " << ++depth << std::endl;
			}

			break;
		}
		case SDLK_p:
		{
			pause = !pause;
			if (pause)
			{
				curElapsedTime = 0;
				std::cout << "Time paused" << std::endl;
				pausedTime = SDL_GetTicks() / 1000.0f;
			}
			else
			{
				sumElapsedTime += curElapsedTime;
				std::cout << "Returned" << std::endl;
			}
			break;
		}
		case SDLK_n:
		{
			useNormalMap = !useNormalMap;
			useNormalMap ? std::cout << "Normalmaps ON" << std::endl : std::cout << "Normalmaps OFF" << std::endl;
			break;
		}
		case SDLK_g:
		{
			isGlowOn = !isGlowOn;
			isGlowOn ? std::cout << "Glow effect ON" << std::endl : std::cout << "Glow effect OFF" << std::endl;
			break;
		}
		case SDLK_v:
		{
			vsync = !vsync;
			if (vsync)
			{
				SDL_GL_SetSwapInterval(1);
				std::cout << "Vsync ON" << std::endl;
			}
			else
			{
				SDL_GL_SetSwapInterval(0);
				std::cout << "Vsync OFF" << std::endl;
			}
			
			break;
		}
		case SDLK_1:
		{
			isShadowOn = !isShadowOn;
			isShadowOn ? std::cout << "Shadows ON" << std::endl : std::cout << "Shadows OFF" << std::endl;
			break;
		}
		case SDLK_t:
		{
			showTorus = !showTorus;
			showTorus ? std::cout << "Torus ON" << std::endl : std::cout << "Torus OFF" << std::endl;
			break;
		}
		case SDLK_DOWN:
		{
			if (currentColorMode > 0)
			{
				std::cout << "Current color mode: " << colorModes[--currentColorMode] << std::endl;
				colorModeToTernary(currentColorMode);
			}
			break;
		}
		case SDLK_UP:
		{
			if (currentColorMode < 26)
			{
				std::cout << "Current color mode: " << colorModes[++currentColorMode] << std::endl;
				colorModeToTernary(currentColorMode);
			}
			break;
		}
	}
}

void CMyApp::KeyboardUp(SDL_KeyboardEvent& key)
{
	camera.KeyboardUp(key);
}

void CMyApp::MouseMove(SDL_MouseMotionEvent& mouse)
{
	camera.MouseMove(mouse);
}

void CMyApp::MouseDown(SDL_MouseButtonEvent& mouse)
{
}

void CMyApp::MouseUp(SDL_MouseButtonEvent& mouse)
{
}

void CMyApp::MouseWheel(SDL_MouseWheelEvent& wheel)
{
}

// a két paraméterbe az új ablakméret szélessége (_w) és magassága (_h) található
void CMyApp::Resize(int _w, int _h)
{
	glViewport(0, 0, _w, _h);

	camera.Resize(_w, _h);
}