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

glm::vec3 CMyApp::getF0(glm::vec3 n, glm::vec3 k) //toresmutato, kioltasi tenyezo
{
	glm::vec3 f0 = ((n - glm::vec3(1.0))*(n - glm::vec3(1.0)) + k*k) / ((n + glm::vec3(1.0))*(n + glm::vec3(1.0)) + k*k);

	return f0;
}
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
	// Lights
	//
	lights[0].col = glm::vec3( 1.0,  1.0, 1.0);
	lights[0].pos = glm::vec3( 0.0,  0.0, 0.0);
	lights[1].col = glm::vec3( 1.0,  1.0, 1.0);
	lights[1].pos = glm::vec3(-2.0, 20.0, 0.0);
	lights[2].col = glm::vec3( 1.0,  1.0, 1.0);
	lights[2].pos = glm::vec3(20.0, 20.0, 0.0);

	//
	// Spheres
	//
	spheres[0] = glm::vec4(0, 0, 0, 1.4); // sun
	spheres[1] = glm::vec4(0.0); // green sphere
	spheres[2] = glm::vec4(0.0); // blue sphere
	spheres[3] = glm::vec4(0.0); // earth
	spheres[4] = glm::vec4(0.0); // moon

	//
	// Spheres of lightsources
	//
	spheres[5] = glm::vec4(lights[1].pos.x, lights[1].pos.y, lights[1].pos.z, 0.05);
	spheres[6] = glm::vec4(lights[2].pos.x, lights[2].pos.y, lights[2].pos.z, 0.05);

	//
	// Red sphere with static position
	//
	spheres[7] = glm::vec4(lights[1].pos.x + 0.3, lights[1].pos.y - 0.6, lights[1].pos.z - 0.3, 0.3);

	//
	// Golden sphere
	//
	spheres[8] = glm::vec4(6, 0, -10, 1.4);

	//
	// Glass sphere
	//
	spheres[9] = glm::vec4(-7, 0, 0, 1.4);

	// 10x10 mirror spheres (spheresCount == 10 --> disabled)

	for (int i = 10; i < 20; ++i)
	{
		for (int j = 0; j < 10; ++j)
		{
			spheres[(i-10)*10+j+10] = glm::vec4(i*2-30, -7, 5+j*2, 0.8);
		}
	}

	//
	// Triangles
	//
	triangles[0].A = glm::vec3(-14, 14, -14);
	triangles[0].B = glm::vec3(-14, -5, -12);
	triangles[0].C = glm::vec3(14,  -5, -12);

	triangles[1].A = glm::vec3(-14, 14, -14);
	triangles[1].B = glm::vec3(14 , -5, -12);
	triangles[1].C = glm::vec3(14,  14, -14);

	float hCubeSide = 2.0; //half the cube's side
	glm::vec3 cubeCenter = glm::vec3(10.0, 0.0, 0.0);
	glm::vec3 cube1 = glm::vec3(cubeCenter.x - hCubeSide, cubeCenter.y - hCubeSide, cubeCenter.z - hCubeSide);
	glm::vec3 cube2 = glm::vec3(cubeCenter.x - hCubeSide, cubeCenter.y - hCubeSide, cubeCenter.z + hCubeSide);
	glm::vec3 cube3 = glm::vec3(cubeCenter.x + hCubeSide, cubeCenter.y - hCubeSide, cubeCenter.z + hCubeSide);
	glm::vec3 cube4 = glm::vec3(cubeCenter.x + hCubeSide, cubeCenter.y - hCubeSide, cubeCenter.z - hCubeSide);
	glm::vec3 cube5 = glm::vec3(cubeCenter.x - hCubeSide, cubeCenter.y + hCubeSide, cubeCenter.z - hCubeSide);
	glm::vec3 cube6 = glm::vec3(cubeCenter.x - hCubeSide, cubeCenter.y + hCubeSide, cubeCenter.z + hCubeSide);
	glm::vec3 cube7 = glm::vec3(cubeCenter.x + hCubeSide, cubeCenter.y + hCubeSide, cubeCenter.z + hCubeSide);
	glm::vec3 cube8 = glm::vec3(cubeCenter.x + hCubeSide, cubeCenter.y + hCubeSide, cubeCenter.z - hCubeSide);

	// Down
	triangles[2] = Triangle(cube1, cube3, cube2);
	triangles[3] = Triangle(cube1, cube4, cube3);
	// Front		    
	triangles[4] = Triangle(cube2, cube3, cube6);
	triangles[5] = Triangle(cube6, cube3, cube7);
	// Left			    
	triangles[6] = Triangle(cube1, cube2, cube5);
	triangles[7] = Triangle(cube5, cube2, cube6);
	// Right		    
	triangles[8] = Triangle(cube3, cube4, cube7);
	triangles[9] = Triangle(cube7, cube4, cube8);
	// Up
	triangles[10] = Triangle(cube5, cube6, cube7);
	triangles[11] = Triangle(cube5, cube7, cube8);
	// Back
	triangles[12] = Triangle(cube1, cube8, cube4);
	triangles[13] = Triangle(cube1, cube5, cube8);

	//
	// Ground
	//
	ground.o = glm::vec3(0, -10, 0);
	ground.n = glm::vec3(0, 1, 0);
	ground.r = 30;

	//
	// Torus (R, r)
	//
	torus = glm::vec2(1.0, 0.25);

	//
	// Skybox (planes)
	//
	skyboxBack.n = glm::vec3(0, 0, -1);
	skyboxBack.q = glm::vec3(0, 0, skyboxDistance);

	skyboxDown.n = glm::vec3(0, 1, 0);
	skyboxDown.q = glm::vec3(0, -skyboxDistance, 0);

	skyboxFront.n = glm::vec3(0, 0, 1);
	skyboxFront.q = glm::vec3(0, 0, -skyboxDistance);

	skyboxLeft.n = glm::vec3(1, 0, 0);
	skyboxLeft.q = glm::vec3(-skyboxDistance, 0, 0);

	skyboxRight.n = glm::vec3(-1, 0, 0);
	skyboxRight.q = glm::vec3(skyboxDistance, 0, 0);

	skyboxUp.n = glm::vec3(0, -1, 0);
	skyboxUp.q = glm::vec3(0, skyboxDistance, 0);

	//
	// Diamond
	//
	/*
	triangles[14].A = glm::vec3(-0.866, 1.5, 0.75);
	triangles[14].B = glm::vec3(-1.732,   0, 0.75);
	triangles[14].C = glm::vec3(-0.866, 0.5, 0.0 );
	
	triangles[15].A = glm::vec3(-0.866, 0.5, 0.0);
	triangles[15].B = glm::vec3(-1.732, 0, 0.75 );
	triangles[15].C = glm::vec3(-0.866, -0.5, 0.0);
	
	triangles[16].A = glm::vec3(-0.866, -0.5, 0.0);
	triangles[16].B = glm::vec3(-1.732, 0, 0.75);
	triangles[16].C = glm::vec3(-0.866, -1.5, 0.75);
	
	triangles[17].A = glm::vec3(-0.866, -0.5, 0.0);
	triangles[17].B = glm::vec3(-0.866, -1.5, 0.75);
	triangles[17].C = glm::vec3(0, -1, 0);
	
	triangles[18].A = glm::vec3(0, -1, 0);
	triangles[18].B = glm::vec3(-0.866, -1.5, 0.75);
	triangles[18].C = glm::vec3(0.866, -1.5, 0.75);
	
	triangles[19].A = glm::vec3(0, -1, 0);
	triangles[19].B = glm::vec3(0.866, -1.5, 0.75);
	triangles[19].C = glm::vec3(0.866, -0.5, 0.0);
	
	triangles[20].A = glm::vec3(0.866, -0.5, 0.0);
	triangles[20].B = glm::vec3(0.866, -1.5, 0.75);
	triangles[20].C = glm::vec3(1.732, 0, 0.75);
	
	triangles[21].A = glm::vec3(0.866, -0.5, 0.0);
	triangles[21].B = glm::vec3(1.732, 0, 0.75);
	triangles[21].C = glm::vec3(0.866, 0.5, 0.0);
	
	triangles[22].A = glm::vec3(0.866, 0.5, 0.0);
	triangles[22].B = glm::vec3(1.732, 0, 0.75);
	triangles[22].C = glm::vec3(0.866, 1.5, 0.75);
	
	triangles[23].A = glm::vec3(0.866, 0.5, 0.0);
	triangles[23].B = glm::vec3(0.866, 1.5, 0.75);
	triangles[23].C = glm::vec3(0, 1, 0);
	
	triangles[24].A = glm::vec3(0, 1, 0);
	triangles[24].B = glm::vec3(0.866, 1.5, 0.75);
	triangles[24].C = glm::vec3(-0.866, 1.5, 0.75);
	
	triangles[25].A = glm::vec3(0, 1, 0);
	triangles[25].B = glm::vec3(-0.866, 1.5, 0.75);
	triangles[25].C = glm::vec3(-0.866, 0.5, 0.0);

	triangles[26].A = glm::vec3(0, 1, 0);
	triangles[26].B = glm::vec3(-0.866, 0.5, 0);
	triangles[26].C = glm::vec3(0.0, 0.0, 0.0);
	
	triangles[27].A = glm::vec3(-0.866, 0.5, 0);
	triangles[27].B = glm::vec3(-0.866, -0.5, 0);
	triangles[27].C = glm::vec3(0.0, 0.0, 0.0);
	
	triangles[28].A = glm::vec3(-0.866, -0.5, 0);
	triangles[28].B = glm::vec3(0, -1, 0);
	triangles[28].C = glm::vec3(0.0, 0.0, 0.0);
	
	triangles[29].A = glm::vec3(0, -1, 0);
	triangles[29].B = glm::vec3(0.866, -0.5, 0);
	triangles[29].C = glm::vec3(0.0, 0.0, 0.0);
	
	triangles[30].A = glm::vec3(0.866, -0.5, 0);
	triangles[30].B = glm::vec3(0.866, 0.5, 0);
	triangles[30].C = glm::vec3(0.0, 0.0, 0.0);
	
	triangles[31].A = glm::vec3(0.866, 0.5, 0);
	triangles[31].B = glm::vec3(0, 1, 0);
	triangles[31].C = glm::vec3(0.0, 0.0, 0.0);

	triangles[32].A = glm::vec3(-0.866, 1.5, 0.75);
	triangles[32].B = glm::vec3(0.866, 1.5, 0.75);
	triangles[32].C = glm::vec3(0.0, 0.0, 3.0);
	
	triangles[33].A = glm::vec3(-1.732, 0, 0.75);
	triangles[33].B = glm::vec3(-0.866, 1.5, 0.75);
	triangles[33].C = glm::vec3(0.0, 0.0, 3.0);
	
	triangles[34].A = glm::vec3(-0.866, -1.5, 0.75);
	triangles[34].B = glm::vec3(-1.732,  0, 0.75);
	triangles[34].C = glm::vec3(0.0, 0.0, 3.0);
	
	triangles[35].A = glm::vec3(0.866, -1.5, 0.75);
	triangles[35].B = glm::vec3(-0.866, -1.5, 0.75);
	triangles[35].C = glm::vec3(0.0, 0.0, 3.0);
	
	triangles[36].A = glm::vec3(1.732, 0, 0.75);
	triangles[36].B = glm::vec3(0.866, -1.5, 0.75);
	triangles[36].C = glm::vec3(0.0, 0.0, 3.0);
	
	triangles[37].A = glm::vec3(0.866, 1.5, 0.75);
	triangles[37].B = glm::vec3(1.732, 0, 0.75);
	triangles[37].C = glm::vec3(0.0, 0.0, 3.0);

	for (int i = 14; i < trianglesCount; ++i)
	{
		triangles[i].A += glm::vec3(0, 0, 20);
		triangles[i].B += glm::vec3(0, 0, 20);
		triangles[i].C += glm::vec3(0, 0, 20);

		glm::vec3 swap = triangles[i].A;
		triangles[i].A = triangles[i].B;
		triangles[i].B = swap;

	}*/
	//
	// Loading shaders
	//
	program.AttachShader(GL_VERTEX_SHADER, "shaders/VS.vert");
	program.AttachShader(GL_FRAGMENT_SHADER, "shaders/FS.frag");


	program.BindAttribLoc(0, "vertPosition");

	if ( !program.LinkProgram() )
	{
		return false;
	}
	std::cout << std::endl << "Press WASD to move around" << std::endl;
	std::cout << "Hold left mouse button to look around" << std::endl;
	std::cout << "Hold left Shift to move slower" << std::endl;
	std::cout << "N: toggle normalmaps (bumpmaps) on the Earth and the Moon" << std::endl;
	std::cout << "1: toogle shadows" << std::endl;
	//std::cout << "T: toggle Torus" << std::endl;
	std::cout << "G: toggle Glowing Effect on the Sun" << std::endl;
	std::cout << "V: toggle Vsync" << std::endl;
	std::cout << "P: pause scene" << std::endl;
	std::cout << "Left/Right arrow: change depth" << std::endl;
	std::cout << "Up/Down arrow: change ColorMode" << std::endl;
	std::cout << "Esc: exit FullScreen" << std::endl << std::endl;


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
	// Delete framepuffer (GL_COLOR_BUFFER_BIT) and Z puffer (GL_DEPTH_BUFFER_BIT)
	//
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	
	//
	// Turn shader program on
	//
	program.On();

	//
	// Calculating current time, check if scene is paused
	//
	float time;
	
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
	spheres[1] = glm::vec4(2 * sinf(time / 2), 0, 2 * cosf(time / 2), 0.26);
	spheres[2] = glm::vec4(2.5* cos(time / 3), 0, 2.5 * sinf(time / 3), 0.18);
	spheres[3] = glm::vec4(5 * cosf(time / 5), 0, 5 * sinf(time / 5), 0.366);
	spheres[4] = glm::vec4(5 * cosf(time / 5) + 1.0*cos(2 * time), 0, 5 * sinf(time / 5) + 1.0*sinf(2 * time), 0.1);
	//
	// Get momentous data from camera
	//
	glm::vec3 eye = camera.GetEye();
	glm::vec3 fw = camera.GetFw();
	glm::vec3 right = camera.GetRight();
	glm::vec3 up = glm::cross(right, fw);
	//
	// Pass uniform variables to GPU
	//
	program.SetUniform("eye", eye);
	program.SetUniform("up", up);
	program.SetUniform("fw", fw);
	program.SetUniform("right", right);
	program.SetUniform("ratio", camera.GetRatio());
	program.SetUniform("time", time);
	program.SetUniform("skyboxRatio", (float)skyboxDistance * 2);
	program.SetUniform("isShadowOn", isShadowOn);
	program.SetUniform("useNormalMap", useNormalMap);
	program.SetUniform("isGlowOn", isGlowOn);
	program.SetUniform("depth", depth); // --> bounces count
	//
	// Pass lights to GPU
	//
	for (int i = 0; i < lightsCount; ++i)
	{
		char buffer[50];
		sprintf(buffer, "lights[%i].pos", i);
		program.SetUniform(buffer, lights[i].pos);
		sprintf(buffer, "lights[%i].col", i);
		program.SetUniform(buffer, lights[i].col);
	}
	//
	// Pass spheres to GPU
	//
	for (int i = 0; i < spheresCount; ++i)
	{
		char buffer[50];
		sprintf(buffer, "spheres[%i]", i);
		program.SetUniform(buffer, spheres[i]);
	}
	//
	// Pass triangles to GPU (3 vec3)
	//
	for (int i = 0; i < trianglesCount; ++i)
	{
		char buffer[50];
		sprintf(buffer, "triangles[%i].A", i);
		program.SetUniform(buffer, triangles[i].A);

		sprintf(buffer, "triangles[%i].B", i);
		program.SetUniform(buffer, triangles[i].B);

		sprintf(buffer, "triangles[%i].C", i);
		program.SetUniform(buffer, triangles[i].C);
	}
	//
	// Pass ground to GPU (disc)
	//
	program.SetUniform("ground.o", ground.o);
	program.SetUniform("ground.n", ground.n);
	program.SetUniform("ground.r", ground.r);
	//
	// Pass torus to GPU (vec2)
	//
	program.SetUniform("torus", torus);
	//
	// Pass skybox to GPU (planes)
	//
	program.SetUniform("skyboxBack.n",  skyboxBack.n);
	program.SetUniform("skyboxBack.q",  skyboxBack.q);

	program.SetUniform("skyboxDown.n",  skyboxDown.n);
	program.SetUniform("skyboxDown.q",  skyboxDown.q);

	program.SetUniform("skyboxFront.n", skyboxFront.n);
	program.SetUniform("skyboxFront.q", skyboxFront.q);

	program.SetUniform("skyboxLeft.n",  skyboxLeft.n);
	program.SetUniform("skyboxLeft.q",  skyboxLeft.q);

	program.SetUniform("skyboxRight.n", skyboxRight.n);
	program.SetUniform("skyboxRight.q", skyboxRight.q);

	program.SetUniform("skyboxUp.n",    skyboxUp.n);
	program.SetUniform("skyboxUp.q",    skyboxUp.q);
	//
	// Pass textures to GPU
	//
	program.SetTexture("sunTexture",          0, sunTexture);
	program.SetTexture("earthTexture",        1, earthTexture);
	program.SetTexture("earthNormalMap",      2, earthNormalMap);
	program.SetTexture("moonTexture",         3, moonTexture);
	program.SetTexture("moonNormalMap",       4, moonNormalMap);
	program.SetTexture("groundTexture",       5, groundTexture);
	program.SetTexture("skyboxTextureBack",   6, skyboxTextureBack);
	program.SetTexture("skyboxTextureDown",   7, skyboxTextureDown);
	program.SetTexture("skyboxTextureFront",  8, skyboxTextureFront);
	program.SetTexture("skyboxTextureLeft",   9, skyboxTextureLeft);
	program.SetTexture("skyboxTextureRight", 10, skyboxTextureRight);
	program.SetTexture("skyboxTextureUp",    11, skyboxTextureUp);
	//
	// Pass materials to GPU
	//
	/*
	for (int i = 0; i < materialsCount; ++i)
	{
		char buffer[50];
		sprintf(buffer, "materials[%i].amb", i);
		program.SetUniform(buffer,  materials[i].amb);
		sprintf(buffer, "materials[%i].dif", i);
		program.SetUniform(buffer,  materials[i].dif);
		sprintf(buffer, "materials[%i].spec", i);
		program.SetUniform(buffer, materials[i].spec);
		sprintf(buffer, "materials[%i].pow", i);
		program.SetUniform(buffer,  materials[i].pow);
		sprintf(buffer, "materials[%i].reflective", i);
		program.SetUniform(buffer, materials[i].reflective);
		sprintf(buffer, "materials[%i].refractive", i);
		program.SetUniform(buffer, materials[i].refractive);
		sprintf(buffer, "materials[%i].f0", i);
		program.SetUniform(buffer, materials[i].f0);
		sprintf(buffer, "materials[%i].n", i);
		program.SetUniform(buffer, materials[i].n);
	}
	*/
	//
	// Pass color mode to GPU
	//
	program.SetUniform("colorModeInTernary[0]", colorModeInTernary[0]);
	program.SetUniform("colorModeInTernary[1]", colorModeInTernary[1]);
	program.SetUniform("colorModeInTernary[2]", colorModeInTernary[2]);
	


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