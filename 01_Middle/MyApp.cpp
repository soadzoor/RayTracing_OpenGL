#include "MyApp.h"
#include "GLUtils.hpp"

#include <iostream>

#include <GL/GLU.h>
#include <math.h>

#include "ObjParser_OGL3.h"

CMyApp::CMyApp(void)
{

	m_SunTextureID = 0;
	m_EarthTextureID = 0;
	m_MoonTextureID = 0;
	m_GroundTextureID = 0;
	m_SkyboxTexture_back = 0;
	m_SkyboxTexture_down = 0;
	m_SkyboxTexture_front = 0;
	m_SkyboxTexture_left = 0;
	m_SkyboxTexture_right = 0;
	m_SkyboxTexture_up = 0;

	

	depth = 1;
	pause = false;
	shadow = false;

	//m_mesh = 0;
}


CMyApp::~CMyApp(void)
{
}

glm::vec3 CMyApp::getF0(glm::vec3 n, glm::vec3 k) //toresmutato, kioltasi tenyezo
{

	glm::vec3 f0 = ((n - glm::vec3(1.0))*(n - glm::vec3(1.0)) + k*k) / ((n + glm::vec3(1.0))*(n + glm::vec3(1.0)) + k*k);

	return f0;

}

bool CMyApp::Init()
{
	// törlési szín legyen kékes
	glClearColor(0.125f, 0.25f, 0.5f, 1.0f);

	glEnable(GL_CULL_FACE);		// kapcsoljuk be a hatrafele nezo lapok eldobasat
	glEnable(GL_DEPTH_TEST);	// mélységi teszt bekapcsolása (takarás)

	//fenyek
	lights[0].col = glm::vec3(1, 1, 1);
	lights[0].pos = glm::vec3(0.0, 0.0, 0.0);
	lights[1].col = glm::vec3(1, 1, 1);
	lights[1].pos = glm::vec3(-2, 20, 0);
	lights[2].col = glm::vec3(1, 1, 1);
	lights[2].pos = glm::vec3(20, 20, 0);

	//gombok
	arrayOfSpheres[0] = glm::vec4(0, 0, 0, 1.4); //nap 1.4
	arrayOfSpheres[1] = glm::vec4(1, 0, 0, 0.1); //zold golyo
	arrayOfSpheres[2] = glm::vec4(2, 0, 0, 0.1); //kek
	arrayOfSpheres[3] = glm::vec4(3, 0, 0, 0.1); //fold
	arrayOfSpheres[4] = glm::vec4(4, 0, 0, 0.1); //hold

	//fenyeket reprezentalo gombok
	arrayOfSpheres[5] = glm::vec4(lights[1].pos.x, lights[1].pos.y, lights[1].pos.z, 0.05);
	arrayOfSpheres[6] = glm::vec4(lights[2].pos.x, lights[2].pos.y, lights[2].pos.z, 0.05);

	//spekularishoz a piros gomb
	arrayOfSpheres[7] = glm::vec4(lights[1].pos.x + 0.6, lights[1].pos.y - 0.6, lights[1].pos.z - 0.6, 0.3);

	//tukor
	arrayOfSpheres[8] = glm::vec4(6, 0, -10, 1.4);

	//uveg
	arrayOfSpheres[9] = glm::vec4(-7, 0, 0, 1.4);

	//also uvegek

	//for (int i = 10; i < 20; ++i)
	//{
	//	for (int j = 0; j < 10; ++j)
	//	{
	//		arrayOfSpheres[(i-10)*10+j+10] = glm::vec4(20+i, -4, j, 0.4);
	//	}
	//}

	//haromszogek
	arrayOfTriangles[0].A = glm::vec3(-14, 14, -14);
	arrayOfTriangles[0].B = glm::vec3(-14, -5, -12);
	arrayOfTriangles[0].C = glm::vec3(14,  -5, -12);

	arrayOfTriangles[1].A = glm::vec3(-14, 14, -14);
	arrayOfTriangles[1].B = glm::vec3(14 , -5, -12);
	arrayOfTriangles[1].C = glm::vec3(14,  14, -14);

	////tetraeder

	//arrayOfTriangles[2].A = glm::vec3(1, 0, 20); //1
	//arrayOfTriangles[2].B = glm::vec3(2, 0, 20); //2
	//arrayOfTriangles[2].C = glm::vec3(1.5, 0, 21); //3

	//arrayOfTriangles[3].A = glm::vec3(1.5, 0, 21); //3
	//arrayOfTriangles[3].B = glm::vec3(2, 0, 20); //2
	//arrayOfTriangles[3].C = glm::vec3(1.5, 1, 20.5); //4

	//arrayOfTriangles[4].A = glm::vec3(2, 0, 20); //2
	//arrayOfTriangles[4].B = glm::vec3(1, 0, 20); //1
	//arrayOfTriangles[4].C = glm::vec3(1.5, 1, 20.5); //4

	//arrayOfTriangles[5].A = glm::vec3(1, 0, 20); //1
	//arrayOfTriangles[5].B = glm::vec3(1.5, 0, 21); //3
	//arrayOfTriangles[5].C = glm::vec3(1.5, 1, 20.5); //4


	//sik

	ground.o = glm::vec3(0, -10, 0);
	ground.n = glm::vec3(0, 1, 0);
	ground.r = 30;

	//skybox

	skybox_back.n = glm::vec3(0, 0, -1);
	skybox_back.q = glm::vec3(0, 0, skybox_distance);

	skybox_down.n = glm::vec3(0, 1, 0);
	skybox_down.q = glm::vec3(0, -skybox_distance, 0);

	skybox_front.n = glm::vec3(0, 0, 1);
	skybox_front.q = glm::vec3(0, 0, -skybox_distance);

	skybox_left.n = glm::vec3(1, 0, 0);
	skybox_left.q = glm::vec3(-skybox_distance, 0, 0);

	skybox_right.n = glm::vec3(-1, 0, 0);
	skybox_right.q = glm::vec3(skybox_distance, 0, 0);

	skybox_up.n = glm::vec3(0, -1, 0);
	skybox_up.q = glm::vec3(0, skybox_distance, 0);

	//gyemant
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
	//kozepso 6szog
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
	//dereka
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
	
	//Nap
	materials[0].amb = glm::vec3(1.0, 0.95, 0.85);
	materials[0].dif = glm::vec3(0.0, 0.0, 0.0);
	materials[0].spec = glm::vec3(0.0, 0.0, 0.0);
	materials[0].pow = 30.0f;
	materials[0].refractive = false;
	materials[0].reflective = false;

	//Zold golyo
	materials[1].amb = glm::vec3(0, 0.2f, 0);
	materials[1].dif = glm::vec3(0, 0.4f, 0);
	materials[1].spec = glm::vec3(1, 0.6f, 0.8f);
	materials[1].pow = 20.0f;
	materials[1].refractive = false;
	materials[1].reflective = false;

	//Kek golyo
	materials[2].amb = glm::vec3(0, 0, 0.2f);
	materials[2].dif = glm::vec3(0, 0, 0.4f);
	materials[2].spec = glm::vec3(0.8f, 0.5f, 0.6f);
	materials[2].pow = 20.0f;
	materials[2].refractive = false;
	materials[2].reflective = false;

	//Fold
	materials[3].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].dif = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].spec = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].pow = 30.0f;
	materials[3].refractive = false;
	materials[3].reflective = true;

	//Hold
	materials[4].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].dif = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].spec = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].pow = 20.0f;
	materials[4].refractive = false;
	materials[4].reflective = false;

	//Fenyek
	materials[5].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[5].dif = glm::vec3(0.8f, 0.5f, 0.8f);
	materials[5].spec = glm::vec3(0.9f, 0.9f, 0.9f);
	materials[5].pow = 20.0f;
	materials[5].refractive = false;
	materials[5].reflective = false;


	materials[6].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[6].dif = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[6].spec = glm::vec3(0.5f, 0.5f, 0.9f);
	materials[6].pow = 20.0f;
	materials[6].refractive = false;
	materials[6].reflective = false;

	//Piros golyo
	materials[7].amb = glm::vec3(0.2f, 0.0f, 0.0f);
	materials[7].dif = glm::vec3(0.5f, 0.0f, 0.0f);
	materials[7].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[7].pow = 66.0f;
	materials[7].refractive = false;
	materials[7].reflective = false;

	//arany
	//materials[8].amb = glm::vec3(0.24725, 0.1995, 0.0745)/5.0f;
	//materials[8].dif = glm::vec3(0.01, 0.01, 0.01);
	materials[8].spec = glm::vec3(0.628281, 0.555802, 0.366065);
	materials[8].pow = 51.2f;
	materials[8].refractive = false;
	materials[8].reflective = true;
	materials[8].f0 = getF0(glm::vec3(0.17, 0.35, 1.5), glm::vec3(3.1, 2.7, 1.9));//arany kioltasi tenyezo);
	//materials[9].pow = 70.0f;
	//materials[9].refractive = true;
	//materials[9].reflective = true;
	//materials[9].f0 = getF0(glm::vec3(1.5), glm::vec3(0.00));
	//materials[9].n = 1.5;

	//uveg
	//materials[9].amb = glm::vec3(0.0f, 0.0f, 0.0f);
	//materials[9].dif = glm::vec3(0.01f, 0.01f, 0.01f);
	//materials[9].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[9].pow = 70.0f;
	materials[9].refractive = true;
	materials[9].reflective = true;
	materials[9].f0 = getF0(glm::vec3(1.5), glm::vec3(0.00));
	materials[9].n = 1.5;


	//also uveggombok
	for (int i = 10; i < spheres_count; ++i)
	{
		//materials[i].amb = glm::vec3(0.2f, 0.2f, 0.3f);
		//materials[i].dif = glm::vec3(0.2f, 0.2f, 0.3f);
		materials[i].spec = glm::vec3(0.7, 0.7, 0.7);
		materials[i].pow = 50.0f;
		materials[i].refractive = true;
		materials[i].reflective = true;
		//materials[i].f0 = getF0(glm::vec3(0.14, 0.16, 0.13), glm::vec3(4.1, 2.3, 3.1));
		materials[i].f0 = getF0(glm::vec3(1.5), glm::vec3(0.00));
		materials[i].n = 1.5;

	}

	//Haromszog 1
	materials[spheres_count].amb = glm::vec3(0.0f, 0.0f, 0.0f); //glm::vec3(240/255, 240/255, 250/255);
	materials[spheres_count].dif = glm::vec3(0.01f, 0.01f, 0.01f);
	materials[spheres_count].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count].pow = 120.0f;
	materials[spheres_count].refractive = false;
	materials[spheres_count].reflective = true;
	materials[spheres_count].f0 = getF0(glm::vec3(0.14, 0.16, 0.13), glm::vec3(4.1, 2.3, 3.1));

	//Haromszog 2
	materials[spheres_count+1].amb = glm::vec3(0.0f, 0.0f, 0.0f);//glm::vec3(240 / 255, 240 / 255, 250 / 255);
	materials[spheres_count+1].dif = glm::vec3(0.01f, 0.01f, 0.01f);
	materials[spheres_count+1].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+1].pow = 120.0f;
	materials[spheres_count+1].refractive = false;
	materials[spheres_count+1].reflective = true;
	materials[spheres_count+1].f0 = getF0(glm::vec3(0.14, 0.16, 0.13), glm::vec3(4.1, 2.3, 3.1));

	//Tetraeder

	for (int i = spheres_count+2; i < spheres_count+triangles_count; ++i)
	{
		//materials[i].amb = glm::vec3(0.1f, 0.3f, 0.2f);
		//materials[i].dif = glm::vec3(0.2f, 0.7f, 0.4f);
		materials[i].spec = glm::vec3(0.7, 0.7, 0.7);
		materials[i].pow = 25.0f;
		materials[i].refractive = true;
		materials[i].reflective = true;
		materials[i].f0 = getF0(glm::vec3(1.4, 1.5, 1.6), glm::vec3(0.01));
		//materials[i].f0 = getF0(glm::vec3(0.17, 0.35, 1.5), glm::vec3(3.1, 2.7, 1.9));
		materials[i].n = 1.1;
	
	}
	//Sik
	materials[spheres_count + triangles_count].amb = glm::vec3(0.0f, 0.0f, 0.0f);
	materials[spheres_count + triangles_count].dif = glm::vec3(0.3f, 0.34f, 0.36f);
	materials[spheres_count + triangles_count].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count + triangles_count].pow = 60.0f;
	materials[spheres_count + triangles_count].refractive = false;
	materials[spheres_count + triangles_count].reflective = false;
	materials[spheres_count + triangles_count].f0 = getF0(glm::vec3(0.6), glm::vec3(2.6));

	//Skybox
	for (int i = spheres_count + triangles_count + 1; i <= spheres_count + triangles_count + skybox_count; ++i)
	{
		materials[i].amb = glm::vec3(0.5f, 0.5f, 0.5f);
		materials[i].dif = glm::vec3(0.5f, 0.5f, 0.5f);
		materials[i].spec = glm::vec3(0.5f, 0.5f, 0.5f);
		materials[i].pow = 20.0f;
		materials[i].refractive = false;
		materials[i].reflective = false;

	}

	//Disc
	materials[spheres_count+triangles_count + skybox_count +1].amb = glm::vec3(0.0f, 0.15f, 0.3f);
	materials[spheres_count+triangles_count + skybox_count +1].dif = glm::vec3(0.0f, 0.3f, 0.5f);
	materials[spheres_count+triangles_count + skybox_count +1].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+triangles_count + skybox_count +1].pow = 110.0f;
	materials[spheres_count+triangles_count + skybox_count +1].refractive = false;
	materials[spheres_count+triangles_count + skybox_count +1].reflective = false;


	materials[spheres_count+triangles_count+ skybox_count + 2].amb = glm::vec3(0.0f, 0.15f, 0.3f);
	materials[spheres_count+triangles_count+ skybox_count + 2].dif = glm::vec3(0.0f, 0.3f, 0.5f);
	materials[spheres_count+triangles_count+ skybox_count + 2].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+triangles_count+ skybox_count + 2].pow = 110.0f;
	materials[spheres_count+triangles_count+ skybox_count + 2].refractive = false;
	materials[spheres_count+triangles_count+ skybox_count + 2].reflective = false;



	//
	// shaderek betöltése
	//
	m_program.AttachShader(GL_VERTEX_SHADER, "VS.glsl");
	m_program.AttachShader(GL_FRAGMENT_SHADER, "FS.glsl");

	m_program.BindAttribLoc(0, "vs_in_pos");

	if ( !m_program.LinkProgram() )
	{
		return false;
	}

	//
	// egyéb inicializálás
	//

	m_camera.SetProj(45.0f, 640.0f/480.0f, 0.1f, 1000.0f);

	// textúra betöltése

	m_SunTextureID = TextureFromFile("sun.jpg");
	m_EarthTextureID = TextureFromFile("earth.jpg");
	m_EarthNormalID = TextureFromFile("earth_normal.jpg");
	m_MoonTextureID = TextureFromFile("moon.jpg");
	m_MoonNormalID = TextureFromFile("moon_normal.jpg");
	m_GroundTextureID = TextureFromFile("grid.bmp");
	
	m_SkyboxTexture_back = TextureFromFile("skybox/backImage.jpg");
	m_SkyboxTexture_down = TextureFromFile("skybox/downImage.jpg");
	m_SkyboxTexture_front = TextureFromFile("skybox/frontImage.jpg");
	m_SkyboxTexture_left = TextureFromFile("skybox/leftImage.jpg");
	m_SkyboxTexture_right = TextureFromFile("skybox/rightImage.jpg");
	m_SkyboxTexture_up = TextureFromFile("skybox/upImage.jpg");



	//haromszog vertexei
	m_vb.AddAttribute(0, 3);

	m_vb.AddData(0, -1, -1, 0);
	m_vb.AddData(0, 1, -1, 0);
	m_vb.AddData(0, -1, 1, 0);
	m_vb.AddData(0, 1, 1, 0);

	m_vb.AddIndex(0, 1, 2);
	m_vb.AddIndex(3, 2, 1);

	m_vb.InitBuffers();

	
	// mesh betöltés
	//m_mesh = ObjParser::parse("suzanne.obj");
	//m_mesh->initBuffers();

	return true;
}

void CMyApp::Clean()
{

	glDeleteTextures(1, &m_SunTextureID);
	glDeleteTextures(1, &m_EarthTextureID);
	glDeleteTextures(1, &m_EarthNormalID);
	glDeleteTextures(1, &m_MoonTextureID);
	glDeleteTextures(1, &m_MoonNormalID);
	glDeleteTextures(1, &m_GroundTextureID);
	glDeleteTextures(1, &m_SkyboxTexture_back);
	glDeleteTextures(1, &m_SkyboxTexture_down);
	glDeleteTextures(1, &m_SkyboxTexture_front);
	glDeleteTextures(1, &m_SkyboxTexture_left);
	glDeleteTextures(1, &m_SkyboxTexture_right);
	glDeleteTextures(1, &m_SkyboxTexture_up);


	m_program.Clean();
}

void CMyApp::Update()
{
	static Uint32 last_time = SDL_GetTicks();
	float delta_time = (SDL_GetTicks() - last_time)/1000.0f;

	m_camera.Update(delta_time);

	last_time = SDL_GetTicks();

}


void CMyApp::Render()
{
	// töröljük a frampuffert (GL_COLOR_BUFFER_BIT) és a mélységi Z puffert (GL_DEPTH_BUFFER_BIT)
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	m_program.On();

	float rot;
	
	if (pause)
	{
		rot = pausedTime - sumElapsedTime;
		curElapsedTime = SDL_GetTicks() / 1000.0f - pausedTime;
	}
	else
	{
		rot = SDL_GetTicks() / 1000.0f - sumElapsedTime;
	}
	m_program.SetUniform("u_rot", rot);
	m_program.SetUniform("skybox_ratio", (float)skybox_distance * 2);
	m_program.SetUniform("u_shadow", shadow);
	m_program.SetUniform("useNormalMap", useNormalMap);
	m_program.SetUniform("u_glow", glow);

	arrayOfSpheres[1] = glm::vec4(2 * sinf(rot / 2), 0, 2 * cosf(rot / 2), 0.26);
	arrayOfSpheres[2] = glm::vec4(2.5* cos(rot / 3), 0, 2.5 * sinf(rot / 3), 0.18);
	arrayOfSpheres[3] = glm::vec4(5 * cosf(rot / 5), 0, 5 * sinf(rot / 5), 0.366);
	arrayOfSpheres[4] = glm::vec4(5 * cosf(rot / 5) + 1.0*cos(2 * rot), 0, 5 * sinf(rot / 5) + 1.0*sinf(2 * rot), 0.1);

	//m_camera.SetView(glm::vec3(-2, 0, 0), glm::vec3(-7, 0, 0), glm::vec3(0, 1, 0));
	glm::vec3 eye = m_camera.GetEye();
	glm::vec3 fw = m_camera.GetFw();
	glm::vec3 right = m_camera.GetRight();
	glm::vec3 up = glm::cross(right, fw);

	//m_program.SetUniform("world", matWorld);
	//m_program.SetUniform("worldIT", matWorldIT);
	//m_program.SetUniform("MVP", mvp);
	m_program.SetUniform("u_eye", eye);
	m_program.SetUniform("u_up", up);
	m_program.SetUniform("u_fw", fw);
	m_program.SetUniform("u_ratio", m_camera.GetRatio());

	
	//Gombok atadasa
	for (int i = 0; i < spheres_count; ++i)
	{
		char buffer[50];
		sprintf(buffer, "u_spheres[%i]", i);
		m_program.SetUniform(buffer, arrayOfSpheres[i]);
	}

	//Haromszogek atadasa

	for (int i = 0; i < triangles_count; ++i)
	{
		char buffer[50];
		sprintf(buffer, "u_triangles[%i].A", i);
		m_program.SetUniform(buffer, arrayOfTriangles[i].A);

		sprintf(buffer, "u_triangles[%i].B", i);
		m_program.SetUniform(buffer, arrayOfTriangles[i].B);

		sprintf(buffer, "u_triangles[%i].C", i);
		m_program.SetUniform(buffer, arrayOfTriangles[i].C);
	}


	//Talapzat atadasa

	m_program.SetUniform("ground.o", ground.o);
	m_program.SetUniform("ground.n", ground.n);
	m_program.SetUniform("ground.r", ground.r);

	//Skybox atadasa

	m_program.SetUniform("skybox_back.n", skybox_back.n);
	m_program.SetUniform("skybox_back.q", skybox_back.q);

	m_program.SetUniform("skybox_down.n", skybox_down.n);
	m_program.SetUniform("skybox_down.q", skybox_down.q);

	m_program.SetUniform("skybox_front.n", skybox_front.n);
	m_program.SetUniform("skybox_front.q", skybox_front.q);

	m_program.SetUniform("skybox_left.n", skybox_left.n);
	m_program.SetUniform("skybox_left.q", skybox_left.q);

	m_program.SetUniform("skybox_right.n", skybox_right.n);
	m_program.SetUniform("skybox_right.q", skybox_right.q);

	m_program.SetUniform("skybox_up.n", skybox_up.n);
	m_program.SetUniform("skybox_up.q", skybox_up.q);

	//Melyseg atadasa

	m_program.SetUniform("u_depth", depth);

	glm::inverse(glm::mat3(glm::vec3(1, 1, 1), glm::vec3(1, 1, 1), glm::vec3(1, 1, 1)));


	for (int i = 0; i < lights_count; ++i)
	{
		char buffer[50];
		sprintf(buffer, "u_lights[%i].pos", i);
		m_program.SetUniform(buffer, lights[i].pos);
		sprintf(buffer, "u_lights[%i].col", i);
		m_program.SetUniform(buffer, lights[i].col);
	}

	m_program.SetTexture("u_sun_texture",   0, m_SunTextureID);
	m_program.SetTexture("u_earth_texture", 1, m_EarthTextureID);
	m_program.SetTexture("u_earth_normal",  2, m_EarthNormalID);
	m_program.SetTexture("u_moon_texture",  3, m_MoonTextureID);
	m_program.SetTexture("u_moon_normal",   4, m_MoonNormalID);
	m_program.SetTexture("u_ground_texture", 5, m_GroundTextureID);
	m_program.SetTexture("skybox_texture_back", 6, m_SkyboxTexture_back);
	m_program.SetTexture("skybox_texture_down", 7, m_SkyboxTexture_down);
	m_program.SetTexture("skybox_texture_front", 8, m_SkyboxTexture_front);
	m_program.SetTexture("skybox_texture_left", 9, m_SkyboxTexture_left);
	m_program.SetTexture("skybox_texture_right", 10, m_SkyboxTexture_right);
	m_program.SetTexture("skybox_texture_up", 11, m_SkyboxTexture_up);


	for (int i = 0; i < materials_count; ++i)
	{
		char buffer[50];
		sprintf(buffer, "u_materials[%i].amb", i);
		m_program.SetUniform(buffer,  materials[i].amb);
		sprintf(buffer, "u_materials[%i].dif", i);
		m_program.SetUniform(buffer,  materials[i].dif);
		sprintf(buffer, "u_materials[%i].spec", i);
		m_program.SetUniform(buffer, materials[i].spec);
		sprintf(buffer, "u_materials[%i].pow", i);
		m_program.SetUniform(buffer,  materials[i].pow);
		sprintf(buffer, "u_materials[%i].reflective", i);
		m_program.SetUniform(buffer, materials[i].reflective);
		sprintf(buffer, "u_materials[%i].refractive", i);
		m_program.SetUniform(buffer, materials[i].refractive);
		sprintf(buffer, "u_materials[%i].f0", i);
		m_program.SetUniform(buffer, materials[i].f0);
		sprintf(buffer, "u_materials[%i].n", i);
		m_program.SetUniform(buffer, materials[i].n);
	}
	

	// kapcsoljuk be a VAO-t (a VBO jön vele együtt)
	m_vb.On();

	m_vb.DrawIndexed(GL_TRIANGLES, 0, 6, 0);

	m_vb.Off();

	// shader kikapcsolasa
	m_program.Off();

}

void CMyApp::KeyboardDown(SDL_KeyboardEvent& key)
{
	m_camera.KeyboardDown(key);
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
				std::cout << "paused" << std::endl;
				pausedTime = SDL_GetTicks() / 1000.0f;
			}
			else
			{
				sumElapsedTime += curElapsedTime;
				std::cout << "returned" << std::endl;
			}
			break;
		}
		case SDLK_n:
		{
			useNormalMap = !useNormalMap;
			useNormalMap ? std::cout << "Using normal maps." << std::endl : std::cout << "All smooth." << std::endl;
			break;
		}
		case SDLK_g:
		{
			glow = !glow;
			glow ? std::cout << "Sun is glowing." << std::endl : std::cout << "Glow effect is off." << std::endl;
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
			shadow = !shadow;
			shadow ? std::cout << "Shadows ON" << std::endl : std::cout << "Shadows OFF" << std::endl;
			break;
		}
	}
}

void CMyApp::KeyboardUp(SDL_KeyboardEvent& key)
{
	m_camera.KeyboardUp(key);
}

void CMyApp::MouseMove(SDL_MouseMotionEvent& mouse)
{
	m_camera.MouseMove(mouse);
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

	m_camera.Resize(_w, _h);
}