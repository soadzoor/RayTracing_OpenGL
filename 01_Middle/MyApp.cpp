#include "MyApp.h"
#include "GLUtils.hpp"

#include <GL/GLU.h>
#include <math.h>

#include "ObjParser_OGL3.h"

CMyApp::CMyApp(void)
{
	m_textureID = 0;

	m_SunTextureID = 0;
	m_EarthTextureID = 0;
	m_MoonTextureID = 0;
	m_SkyTextureID = 0;

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
	arrayOfSpheres[8] = glm::vec4(6, 0, -2, 0.4);

	//uveg
	arrayOfSpheres[9] = glm::vec4(-6, 0, -2, 0.4);

	//haromszogek
	arrayOfTriangles[0].A = glm::vec3( 0,  -4,  0);
	arrayOfTriangles[0].B = glm::vec3(1,   -4, 0);
	arrayOfTriangles[0].C = glm::vec3(0.5, -4, -1);

	arrayOfTriangles[1].A = glm::vec3(-12, -12, -12);
	arrayOfTriangles[1].B = glm::vec3(12, -12, -12);
	arrayOfTriangles[1].C = glm::vec3(0, 12, -12);

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
	materials[7].pow = 26.0f;
	//Tukor
	materials[8].amb = glm::vec3(0.3f, 0.3f, 0.3f);
	materials[8].dif = glm::vec3(0.7f, 0.7f, 0.7f);
	materials[8].spec = glm::vec3(0.75f, 0.75f, 0.75f);
	materials[8].pow = 120.0f;
	//Uveg
	materials[9].amb = glm::vec3(0, 0.3f, 0.3f);
	materials[9].dif = glm::vec3(0, 0.9f, 0.9f);
	materials[9].spec = glm::vec3(1, 1, 1);
	materials[9].pow = 120.0f;
	//Haromszog 1
	materials[10].amb = glm::vec3(0.0f, 0.2f, 0.0f);
	materials[10].dif = glm::vec3(0.0f, 0.7f, 0.0f);
	materials[10].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[10].pow = 10.0f;
	//Haromszog 2
	materials[11].amb = glm::vec3(0.0f, 0.0f, 0.0f);
	materials[11].dif = glm::vec3(0.7f, 0.0f, 0.0f);
	materials[11].spec = glm::vec3(0.8f, 0.8f, 0.8f);
	materials[11].pow = 120.0f;

	////Gyemant

	//for (int i = 12; i < 13; ++i)
	//{
	//	materials[i].amb = glm::vec3(0.3f, 0.3f, 0.3f);
	//	materials[i].dif = glm::vec3(0.7f, 0.7f, 0.7f);
	//	materials[i].spec = glm::vec3(0.75f, 0.75f, 0.75f);
	//	materials[i].pow = 120.0f;
	//}
	

	

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
	m_SkyTextureID = TextureFromFile("sky.jpg");


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
	glDeleteTextures(1, &m_SkyTextureID);

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


	float rot = SDL_GetTicks() / 1000.0f;
	m_program.SetUniform("u_rot", rot);

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

	m_program.SetUniform("u_triangles[0].A", arrayOfTriangles[0].A);
	m_program.SetUniform("u_triangles[0].B", arrayOfTriangles[0].B);
	m_program.SetUniform("u_triangles[0].C", arrayOfTriangles[0].C);

	m_program.SetUniform("u_triangles[1].A", arrayOfTriangles[1].A);
	m_program.SetUniform("u_triangles[1].B", arrayOfTriangles[1].B);
	m_program.SetUniform("u_triangles[1].C", arrayOfTriangles[1].C);

	//m_program.SetUniform("u_triangles[2].A", arrayOfTriangles[2].A);
	//m_program.SetUniform("u_triangles[2].B", arrayOfTriangles[2].B);
	//m_program.SetUniform("u_triangles[2].C", arrayOfTriangles[2].C);

	//m_program.SetUniform("u_triangles[3].A", arrayOfTriangles[3].A);
	//m_program.SetUniform("u_triangles[3].B", arrayOfTriangles[3].B);
	//m_program.SetUniform("u_triangles[3].C", arrayOfTriangles[3].C);

	//m_program.SetUniform("u_triangles[4].A", arrayOfTriangles[4].A);
	//m_program.SetUniform("u_triangles[4].B", arrayOfTriangles[4].B);
	//m_program.SetUniform("u_triangles[4].C", arrayOfTriangles[4].C);

	//m_program.SetUniform("u_triangles[5].A", arrayOfTriangles[5].A);
	//m_program.SetUniform("u_triangles[5].B", arrayOfTriangles[5].B);
	//m_program.SetUniform("u_triangles[5].C", arrayOfTriangles[5].C);

	//m_program.SetUniform("u_triangles[6].A", arrayOfTriangles[6].A);
	//m_program.SetUniform("u_triangles[6].B", arrayOfTriangles[6].B);
	//m_program.SetUniform("u_triangles[6].C", arrayOfTriangles[6].C);

	//m_program.SetUniform("u_triangles[7].A", arrayOfTriangles[7].A);
	//m_program.SetUniform("u_triangles[7].B", arrayOfTriangles[7].B);
	//m_program.SetUniform("u_triangles[7].C", arrayOfTriangles[7].C);

	//m_program.SetUniform("u_triangles[8].A", arrayOfTriangles[8].A);
	//m_program.SetUniform("u_triangles[8].B", arrayOfTriangles[8].B);
	//m_program.SetUniform("u_triangles[8].C", arrayOfTriangles[8].C);

	//m_program.SetUniform("u_triangles[9].A", arrayOfTriangles[9].A);
	//m_program.SetUniform("u_triangles[9].B", arrayOfTriangles[9].B);
	//m_program.SetUniform("u_triangles[9].C", arrayOfTriangles[9].C);

	//m_program.SetUniform("u_triangles[10].A", arrayOfTriangles[10].A);
	//m_program.SetUniform("u_triangles[10].B", arrayOfTriangles[10].B);
	//m_program.SetUniform("u_triangles[10].C", arrayOfTriangles[10].C);

	//m_program.SetUniform("u_triangles[11].A", arrayOfTriangles[11].A);
	//m_program.SetUniform("u_triangles[11].B", arrayOfTriangles[11].B);
	//m_program.SetUniform("u_triangles[11].C", arrayOfTriangles[11].C);

	//m_program.SetUniform("u_triangles[12].A", arrayOfTriangles[12].A);
	//m_program.SetUniform("u_triangles[12].B", arrayOfTriangles[12].B);
	//m_program.SetUniform("u_triangles[12].C", arrayOfTriangles[12].C);

	//m_program.SetUniform("u_triangles[13].A", arrayOfTriangles[13].A);
	//m_program.SetUniform("u_triangles[13].B", arrayOfTriangles[13].B);
	//m_program.SetUniform("u_triangles[13].C", arrayOfTriangles[13].C);

	//m_program.SetUniform("u_triangles[14].A", arrayOfTriangles[14].A);
	//m_program.SetUniform("u_triangles[14].B", arrayOfTriangles[14].B);
	//m_program.SetUniform("u_triangles[14].C", arrayOfTriangles[14].C);

	//m_program.SetUniform("u_triangles[15].A", arrayOfTriangles[15].A);
	//m_program.SetUniform("u_triangles[15].B", arrayOfTriangles[15].B);
	//m_program.SetUniform("u_triangles[15].C", arrayOfTriangles[15].C);

	//m_program.SetUniform("u_triangles[16].A", arrayOfTriangles[16].A);
	//m_program.SetUniform("u_triangles[16].B", arrayOfTriangles[16].B);
	//m_program.SetUniform("u_triangles[16].C", arrayOfTriangles[16].C);

	//m_program.SetUniform("u_triangles[17].A", arrayOfTriangles[17].A);
	//m_program.SetUniform("u_triangles[17].B", arrayOfTriangles[17].B);
	//m_program.SetUniform("u_triangles[17].C", arrayOfTriangles[17].C);

	//m_program.SetUniform("u_triangles[18].A", arrayOfTriangles[18].A);
	//m_program.SetUniform("u_triangles[18].B", arrayOfTriangles[18].B);
	//m_program.SetUniform("u_triangles[18].C", arrayOfTriangles[18].C);

	//m_program.SetUniform("u_triangles[19].A", arrayOfTriangles[19].A);
	//m_program.SetUniform("u_triangles[19].B", arrayOfTriangles[19].B);
	//m_program.SetUniform("u_triangles[19].C", arrayOfTriangles[19].C);

	//m_program.SetUniform("u_triangles[20].A", arrayOfTriangles[20].A);
	//m_program.SetUniform("u_triangles[20].B", arrayOfTriangles[20].B);
	//m_program.SetUniform("u_triangles[20].C", arrayOfTriangles[20].C);

	//m_program.SetUniform("u_triangles[21].A", arrayOfTriangles[21].A);
	//m_program.SetUniform("u_triangles[21].B", arrayOfTriangles[21].B);
	//m_program.SetUniform("u_triangles[21].C", arrayOfTriangles[21].C);

	//m_program.SetUniform("u_triangles[22].A", arrayOfTriangles[22].A);
	//m_program.SetUniform("u_triangles[22].B", arrayOfTriangles[22].B);
	//m_program.SetUniform("u_triangles[22].C", arrayOfTriangles[22].C);

	//m_program.SetUniform("u_triangles[23].A", arrayOfTriangles[23].A);
	//m_program.SetUniform("u_triangles[23].B", arrayOfTriangles[23].B);
	//m_program.SetUniform("u_triangles[23].C", arrayOfTriangles[23].C);

	//m_program.SetUniform("u_triangles[24].A", arrayOfTriangles[24].A);
	//m_program.SetUniform("u_triangles[24].B", arrayOfTriangles[24].B);
	//m_program.SetUniform("u_triangles[24].C", arrayOfTriangles[24].C);

	//m_program.SetUniform("u_triangles[25].A", arrayOfTriangles[25].A);
	//m_program.SetUniform("u_triangles[25].B", arrayOfTriangles[25].B);
	//m_program.SetUniform("u_triangles[25].C", arrayOfTriangles[25].C);

	glm::inverse(glm::mat3(glm::vec3(1, 1, 1), glm::vec3(1, 1, 1), glm::vec3(1, 1, 1)));

	m_program.SetUniform("u_lights[0].pos", lights[0].pos);
	m_program.SetUniform("u_lights[0].col", lights[0].col);
	m_program.SetUniform("u_lights[1].pos", lights[1].pos);
	m_program.SetUniform("u_lights[1].col", lights[1].col);

	m_program.SetTexture("u_sun_texture",   0, m_SunTextureID);
	m_program.SetTexture("u_earth_texture", 1, m_EarthTextureID);
	m_program.SetTexture("u_moon_texture",  2, m_MoonTextureID);
	m_program.SetTexture("u_sky_texture",   3, m_SkyTextureID);

	for (int i = 0; i < spheres_count + triangles_count; ++i)
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