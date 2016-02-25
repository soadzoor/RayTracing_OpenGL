#include "MyApp.h"
#include "GLUtils.hpp"

#include <iostream>

#include <GL/GLU.h>
#include <math.h>

#include "ObjParser_OGL3.h"

CMyApp::CMyApp(void)
{
	m_textureID = 0;

	m_SunTextureID = 0;
	m_EarthTextureID = 0;
	m_MoonTextureID = 0;
	m_PlaneTextureID = 0;
	//m_SkyTextureID = 0;

	depth = 1;
	pause = false;
	shadow = false;

	//m_mesh = 0;
}


CMyApp::~CMyApp(void)
{
}


GLuint CMyApp::GenTexture()
{
    unsigned char tex[256][256][3];
 
    for (int i=0; i<256; ++i)
        for (int j=0; j<256; ++j)
        {
			tex[i][j][0] = rand()%256;
			tex[i][j][1] = rand()%256;
			tex[i][j][2] = rand()%256;
        }
 
	GLuint tmpID;

	// generáljunk egy textúra erõforrás nevet
    glGenTextures(1, &tmpID);
	// aktiváljuk a most generált nevû textúrát
    glBindTexture(GL_TEXTURE_2D, tmpID);
	// töltsük fel adatokkal az...
    gluBuild2DMipmaps(  GL_TEXTURE_2D,	// aktív 2D textúrát
						GL_RGB8,		// a vörös, zöld és kék csatornákat 8-8 biten tárolja a textúra
						256, 256,		// 256x256 méretû legyen
						GL_RGB,				// a textúra forrása RGB értékeket tárol, ilyen sorrendben
						GL_UNSIGNED_BYTE,	// egy-egy színkopmonenst egy unsigned byte-ról kell olvasni
						tex);				// és a textúra adatait a rendszermemória ezen szegletébõl töltsük fel
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);	// bilineáris szûrés kicsinyítéskor
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);	// és nagyításkor is
	glBindTexture(GL_TEXTURE_2D, 0);

	return tmpID;
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

	//raytrace gombok
	arrayOfSpheres[0] = glm::vec4(0, 0, 0, 1.4); //nap 1.4
	arrayOfSpheres[1] = glm::vec4(1, 0, 0, 0.1); //zold golyo
	arrayOfSpheres[2] = glm::vec4(2, 0, 0, 0.1); //kek
	arrayOfSpheres[3] = glm::vec4(3, 0, 0, 0.1); //fold
	arrayOfSpheres[4] = glm::vec4(4, 0, 0, 0.1); //hold

	//fenyeket reprezentalo gombok
	arrayOfSpheres[5] = glm::vec4(lights[0].pos.x, lights[0].pos.y, lights[0].pos.z, 0.05); //nap fenye
	arrayOfSpheres[6] = glm::vec4(lights[1].pos.x, lights[1].pos.y, lights[1].pos.z, 0.05); //masik feny

	//spekularishoz a piros gomb
	arrayOfSpheres[7] = glm::vec4(lights[1].pos.x + 0.6, lights[1].pos.y - 0.6, lights[1].pos.z - 0.6, 0.3);

	//tukor
	arrayOfSpheres[8] = glm::vec4(6, 0, -10, 1.4);

	//uveg
	arrayOfSpheres[9] = glm::vec4(-7, 0, -2, 0.4);

	//also uvegek

	for (int i = 10; i < 20; ++i)
	{
		for (int j = 0; j < 10; ++j)
		{
			arrayOfSpheres[(i-10)*10+j+10] = glm::vec4(20+i, -4, j, 0.4);
		}
	}

	//haromszogek
	arrayOfTriangles[0].A = glm::vec3(-14, 14, -14);
	arrayOfTriangles[0].B = glm::vec3(-14, -5, -12);
	arrayOfTriangles[0].C = glm::vec3(14,  -5, -12);

	arrayOfTriangles[1].A = glm::vec3(-14, 14, -14);
	arrayOfTriangles[1].B = glm::vec3(14 , -5, -12);
	arrayOfTriangles[1].C = glm::vec3(14,  14, -14);

	//sik

	plane01.n = glm::vec3(0, 1, 0);
	plane01.q = glm::vec3(0, -10, 0);

	//disc

	disc01.o = glm::vec3(0,0,8);
	disc01.n = glm::normalize(glm::vec3(0, 0, 1));
	disc01.r = 1;

	disc02.o = glm::vec3(0, 0, 8);
	disc02.n = glm::normalize(glm::vec3(0, 0, -1));
	disc02.r = 1;

	//gyemant

	//arrayOfTriangles[2].A = glm::vec3(-0.866, 1.5, 0.75);
	//arrayOfTriangles[2].B = glm::vec3(-1.732,   0, 0.75);
	//arrayOfTriangles[2].C = glm::vec3(-0.866, 0.5, 0.0 );

	//arrayOfTriangles[3].A = glm::vec3(-0.866, 0.5, 0.0);
	//arrayOfTriangles[3].B = glm::vec3(-1.732, 0, 0.75 );
	//arrayOfTriangles[3].C = glm::vec3(-0.866, -0.5, 0.0);

	//arrayOfTriangles[4].A = glm::vec3(-0.866, -0.5, 0.0);
	//arrayOfTriangles[4].B = glm::vec3(-1.732, 0, 0.75);
	//arrayOfTriangles[4].C = glm::vec3(-0.866, -1.5, 0.75);

	//arrayOfTriangles[5].A = glm::vec3(-0.866, -0.5, 0.0);
	//arrayOfTriangles[5].B = glm::vec3(-0.866, -1.5, 0.75);
	//arrayOfTriangles[5].C = glm::vec3(0, -1, 0);

	//arrayOfTriangles[6].A = glm::vec3(0, -1, 0);
	//arrayOfTriangles[6].B = glm::vec3(-0.866, -1.5, 0.75);
	//arrayOfTriangles[6].C = glm::vec3(0.866, -1.5, 0.75);

	//arrayOfTriangles[7].A = glm::vec3(0, -1, 0);
	//arrayOfTriangles[7].B = glm::vec3(0.866, -1.5, 0.75);
	//arrayOfTriangles[7].C = glm::vec3(0.866, -0.5, 0.0);

	//arrayOfTriangles[8].A = glm::vec3(0.866, -0.5, 0.0);
	//arrayOfTriangles[8].B = glm::vec3(0.866, -1.5, 0.75);
	//arrayOfTriangles[8].C = glm::vec3(1.732, 0, 0.75);

	//arrayOfTriangles[9].A = glm::vec3(0.866, -0.5, 0.0);
	//arrayOfTriangles[9].B = glm::vec3(1.732, 0, 0.75);
	//arrayOfTriangles[9].C = glm::vec3(0.866, 0.5, 0.0);

	//arrayOfTriangles[10].A = glm::vec3(0.866, 0.5, 0.0);
	//arrayOfTriangles[10].B = glm::vec3(1.732, 0, 0.75);
	//arrayOfTriangles[10].C = glm::vec3(0.866, 1.5, 0.75);

	//arrayOfTriangles[11].A = glm::vec3(0.866, 0.5, 0.0);
	//arrayOfTriangles[11].B = glm::vec3(0.866, 1.5, 0.75);
	//arrayOfTriangles[11].C = glm::vec3(0, 1, 0);

	//arrayOfTriangles[12].A = glm::vec3(0, 1, 0);
	//arrayOfTriangles[12].B = glm::vec3(0.866, 1.5, 0.75);
	//arrayOfTriangles[12].C = glm::vec3(-0.866, 1.5, 0.75);

	//arrayOfTriangles[13].A = glm::vec3(0, 1, 0);
	//arrayOfTriangles[13].B = glm::vec3(-0.866, 1.5, 0.75);
	//arrayOfTriangles[13].C = glm::vec3(-0.866, 0.5, 0.0);
	////kozepso 6szog
	//arrayOfTriangles[14].A = glm::vec3(0, 1, 0);
	//arrayOfTriangles[14].B = glm::vec3(-0.866, 0.5, 0);
	//arrayOfTriangles[14].C = glm::vec3(0.0, 0.0, 0.0);

	//arrayOfTriangles[15].A = glm::vec3(-0.866, 0.5, 0);
	//arrayOfTriangles[15].B = glm::vec3(-0.866, -0.5, 0);
	//arrayOfTriangles[15].C = glm::vec3(0.0, 0.0, 0.0);

	//arrayOfTriangles[16].A = glm::vec3(-0.866, -0.5, 0);
	//arrayOfTriangles[16].B = glm::vec3(0, -1, 0);
	//arrayOfTriangles[16].C = glm::vec3(0.0, 0.0, 0.0);

	//arrayOfTriangles[17].A = glm::vec3(0, -1, 0);
	//arrayOfTriangles[17].B = glm::vec3(0.866, -0.5, 0);
	//arrayOfTriangles[17].C = glm::vec3(0.0, 0.0, 0.0);

	//arrayOfTriangles[18].A = glm::vec3(0.866, -0.5, 0);
	//arrayOfTriangles[18].B = glm::vec3(0.866, 0.5, 0);
	//arrayOfTriangles[18].C = glm::vec3(0.0, 0.0, 0.0);

	//arrayOfTriangles[19].A = glm::vec3(0.866, 0.5, 0);
	//arrayOfTriangles[19].B = glm::vec3(0, 1, 0);
	//arrayOfTriangles[19].C = glm::vec3(0.0, 0.0, 0.0);
	////dereka
	//arrayOfTriangles[20].A = glm::vec3(-0.866, 1.5, 0.75);
	//arrayOfTriangles[20].B = glm::vec3(0.866, 1.5, 0.75);
	//arrayOfTriangles[20].C = glm::vec3(0.0, 0.0, 3.0);

	//arrayOfTriangles[21].A = glm::vec3(-1.732, 0, 0.75);
	//arrayOfTriangles[21].B = glm::vec3(-0.866, 1.5, 0.75);
	//arrayOfTriangles[21].C = glm::vec3(0.0, 0.0, 3.0);

	//arrayOfTriangles[22].A = glm::vec3(-0.866, -1.5, 0.75);
	//arrayOfTriangles[22].B = glm::vec3(-1.732,  0, 0.75);
	//arrayOfTriangles[22].C = glm::vec3(0.0, 0.0, 3.0);

	//arrayOfTriangles[23].A = glm::vec3(0.866, -1.5, 0.75);
	//arrayOfTriangles[23].B = glm::vec3(-0.866, -1.5, 0.75);
	//arrayOfTriangles[23].C = glm::vec3(0.0, 0.0, 3.0);

	//arrayOfTriangles[24].A = glm::vec3(1.732, 0, 0.75);
	//arrayOfTriangles[24].B = glm::vec3(0.866, -1.5, 0.75);
	//arrayOfTriangles[24].C = glm::vec3(0.0, 0.0, 3.0);

	//arrayOfTriangles[25].A = glm::vec3(0.866, 1.5, 0.75);
	//arrayOfTriangles[25].B = glm::vec3(1.732, 0, 0.75);
	//arrayOfTriangles[25].C = glm::vec3(0.0, 0.0, 3.0);
	
	//Nap
	materials[0].amb = glm::vec3(1.0, 0.95, 0.85);
	materials[0].dif = glm::vec3(0.0, 0.0, 0.0);
	materials[0].spec = glm::vec3(0.0, 0.0, 0.0);
	materials[0].pow = 30.0f;
	//Zold golyo
	materials[1].amb = glm::vec3(0, 0.2f, 0);
	materials[1].dif = glm::vec3(0, 0.4f, 0);
	materials[1].spec = glm::vec3(1, 0.6f, 0.8f);
	materials[1].pow = 20.0f;
	//Kek golyo
	materials[2].amb = glm::vec3(0, 0, 0.2f);
	materials[2].dif = glm::vec3(0, 0, 0.4f);
	materials[2].spec = glm::vec3(0.8f, 0.5f, 0.6f);
	materials[2].pow = 20.0f;
	//Fold
	materials[3].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].dif = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].spec = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[3].pow = 30.0f;
	//Hold
	materials[4].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].dif = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].spec = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[4].pow = 20.0f;
	//Fenyek
	materials[5].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[5].dif = glm::vec3(0.8f, 0.5f, 0.8f);
	materials[5].spec = glm::vec3(0.9f, 0.9f, 0.9f);
	materials[5].pow = 20.0f;

	materials[6].amb = glm::vec3(0.5f, 0.5f, 0.5f);
	materials[6].dif = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[6].spec = glm::vec3(0.5f, 0.5f, 0.9f);
	materials[6].pow = 20.0f;
	//Piros golyo
	materials[7].amb = glm::vec3(0.2f, 0.0f, 0.0f);
	materials[7].dif = glm::vec3(0.5f, 0.0f, 0.0f);
	materials[7].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[7].pow = 66.0f;
	//Tukor
	materials[8].amb = glm::vec3(0.15f, 0.15f, 0.25f);
	materials[8].dif = glm::vec3(0.2f, 0.2f, 0.2f);
	materials[8].spec = glm::vec3(0.75f, 0.75f, 0.75f);
	materials[8].pow = 140.0f;
	//Uveg
	materials[9].amb = glm::vec3(0.1f, 0.1f, 0.15f);
	materials[9].dif = glm::vec3(0.2f, 0.2f, 0.2f);
	materials[9].spec = glm::vec3(0.6f,0.6f, 0.6f);
	materials[9].pow = 110.0f;

	//also uvegek
	for (int i = 10; i < spheres_count; ++i)
	{
		materials[i].amb = glm::vec3(0.2f, 0.2f, 0.3f);
		materials[i].dif = glm::vec3(0.2f, 0.2f, 0.3f);
		materials[i].spec = glm::vec3(0.3, 0.3, 0.3);
		materials[i].pow = 120.0f;
	}

	//Haromszog 1
	materials[spheres_count].amb = glm::vec3(240/255, 240/255, 250/255);
	materials[spheres_count].dif = glm::vec3(0.2f, 0.2f, 0.2f);
	materials[spheres_count].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count].pow = 120.0f;
	//Haromszog 2
	materials[spheres_count+1].amb = glm::vec3(240 / 255, 240 / 255, 250 / 255);
	materials[spheres_count+1].dif = glm::vec3(0.2f, 0.2f, 0.2f);
	materials[spheres_count+1].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+1].pow = 120.0f;
	//Gyemant

	/*for (int i = spheres_count+2; i < triangles_count; ++i)
	{
		materials[i].amb = glm::vec3(0.3f, 0.3f, 0.3f);
		materials[i].dif = glm::vec3(0.7f, 0.7f, 0.7f);
		materials[i].spec = glm::vec3(0.75f, 0.75f, 0.75f);
		materials[i].pow = 110.0f;
	}*/
	//Sik
	materials[spheres_count+triangles_count].amb = glm::vec3(0.0f, 0.0f, 0.0f);
	materials[spheres_count+triangles_count].dif = glm::vec3(0.3f, 0.34f, 0.36f);
	materials[spheres_count+triangles_count].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+triangles_count].pow = 60.0f;
	//Disc
	materials[spheres_count+triangles_count+1].amb = glm::vec3(0.0f, 0.15f, 0.3f);
	materials[spheres_count+triangles_count+1].dif = glm::vec3(0.0f, 0.3f, 0.5f);
	materials[spheres_count+triangles_count+1].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+triangles_count+1].pow = 110.0f;

	materials[spheres_count+triangles_count+2].amb = glm::vec3(0.0f, 0.15f, 0.3f);
	materials[spheres_count+triangles_count+2].dif = glm::vec3(0.0f, 0.3f, 0.5f);
	materials[spheres_count+triangles_count+2].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[spheres_count+triangles_count+2].pow = 110.0f;

	
	

	

	//
	// geometria letrehozasa
	//
	



	//
	// shaderek betöltése
	//
	m_program.AttachShader(GL_VERTEX_SHADER, "VS.vert");
	m_program.AttachShader(GL_FRAGMENT_SHADER, "FS.frag");

	m_program.BindAttribLoc(0, "vs_in_pos");

	if ( !m_program.LinkProgram() )
	{
		return false;
	}

	//
	// egyéb inicializálás
	//

	m_camera.SetProj(45.0f, 640.0f/480.0f, 0.01f, 1000.0f);

	// textúra betöltése
	m_textureID = TextureFromFile("texture.png");

	m_SunTextureID = TextureFromFile("sun.jpg");
	m_EarthTextureID = TextureFromFile("earth.png");
	m_MoonTextureID = TextureFromFile("moon.png");
	m_PlaneTextureID = TextureFromFile("grid.jpg");
	//m_SkyTextureID = TextureFromFile("sky.jpg");


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
	glDeleteTextures(1, &m_textureID);

	glDeleteTextures(1, &m_SunTextureID);
	glDeleteTextures(1, &m_EarthTextureID);
	glDeleteTextures(1, &m_MoonTextureID);
	glDeleteTextures(1, &m_PlaneTextureID);
	//glDeleteTextures(1, &m_SkyTextureID);

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

	glm::mat4 matWorld = glm::mat4(1.0f);
	glm::mat4 matWorldIT = glm::transpose( glm::inverse( matWorld ) );
	glm::mat4 mvp = m_camera.GetViewProj() *matWorld;

	float rot = 0;

	if (!pause)
	{
		rot = SDL_GetTicks() / 1000.0f;
	}
	m_program.SetUniform("u_rot", rot);
	m_program.SetUniform("u_shadow", shadow);

	arrayOfSpheres[1] = glm::vec4(2 * sinf(rot / 2), 0, 2 * cosf(rot / 2), 0.26);
	arrayOfSpheres[2] = glm::vec4(2.5* cos(rot / 3), 0, 2.5 * sinf(rot / 3), 0.18);
	arrayOfSpheres[3] = glm::vec4(5 * cosf(rot / 5), 0, 5 * sinf(rot / 5), 0.366);
	arrayOfSpheres[4] = glm::vec4(5 * cosf(rot / 5) + 1.0*cos(2 * rot), 0, 5 * sinf(rot / 5) + 1.0*sinf(2 * rot), 0.1);

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


	//Sik atadasa

	m_program.SetUniform("plane01.n", plane01.n);
	m_program.SetUniform("plane01.q", plane01.q);

	//Disc atadasa
	disc01.n = glm::normalize(glm::vec3(cosf(rot / 2), 0, sinf(rot / 2)));
	m_program.SetUniform("disc01.n", disc01.n);
	m_program.SetUniform("disc01.r", disc01.r);
	m_program.SetUniform("disc01.o", disc01.o);

	disc02.n = glm::normalize(glm::vec3(cosf(rot / 2), 0, sinf(rot / 2)));
	m_program.SetUniform("disc02.n", -disc02.n);
	m_program.SetUniform("disc02.r", disc02.r);
	m_program.SetUniform("disc02.o", disc02.o);

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
	m_program.SetTexture("u_moon_texture",  2, m_MoonTextureID);
	m_program.SetTexture("u_plane_texture", 3, m_PlaneTextureID);
	//m_program.SetTexture("u_sky_texture",   4, m_SkyTextureID);

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
			std::cout << "Depth: " << ++depth << std::endl;

			break;
		}
		case SDLK_p:
		{
			pause = !pause;
			pause ? std::cout << "paused" << std::endl : std::cout << "returned" << std::endl;

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