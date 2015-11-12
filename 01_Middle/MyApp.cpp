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
	lights[0].pos = glm::vec3(0.0, 0.0, 0);
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

	m_program.SetUniform("world", matWorld);
	m_program.SetUniform("worldIT", matWorldIT);
	m_program.SetUniform("MVP", mvp);
	m_program.SetUniform("u_eye", eye);
	m_program.SetUniform("u_up", up);
	m_program.SetUniform("u_fw", fw);
	m_program.SetUniform("u_ratio", m_camera.GetRatio());

	
	//Gombok atadasa
	m_program.SetUniform("u_spheres[0]", arrayOfSpheres[0]);
	m_program.SetUniform("u_spheres[1]", arrayOfSpheres[1]);
	m_program.SetUniform("u_spheres[2]", arrayOfSpheres[2]);
	m_program.SetUniform("u_spheres[3]", arrayOfSpheres[3]);
	m_program.SetUniform("u_spheres[4]", arrayOfSpheres[4]);
	m_program.SetUniform("u_spheres[5]", arrayOfSpheres[5]);
	m_program.SetUniform("u_spheres[6]", arrayOfSpheres[6]);
	m_program.SetUniform("u_spheres[7]", arrayOfSpheres[7]);
	m_program.SetUniform("u_spheres[8]", arrayOfSpheres[8]);
	m_program.SetUniform("u_spheres[9]", arrayOfSpheres[9]);

	//Haromszogek atadasa
	m_program.SetUniform("u_triangles[0].A", arrayOfTriangles[0].A);
	m_program.SetUniform("u_triangles[0].B", arrayOfTriangles[0].B);
	m_program.SetUniform("u_triangles[0].C", arrayOfTriangles[0].C);

	m_program.SetUniform("u_triangles[1].A", arrayOfTriangles[1].A);
	m_program.SetUniform("u_triangles[1].B", arrayOfTriangles[1].B);
	m_program.SetUniform("u_triangles[1].C", arrayOfTriangles[1].C);

	glm::inverse(glm::mat3(glm::vec3(1, 1, 1), glm::vec3(1, 1, 1), glm::vec3(1, 1, 1)));

	m_program.SetUniform("u_lights[0].pos", lights[0].pos);
	m_program.SetUniform("u_lights[0].col", lights[0].col);
	m_program.SetUniform("u_lights[1].pos", lights[1].pos);
	m_program.SetUniform("u_lights[1].col", lights[1].col);

	m_program.SetTexture("u_sun_texture",   0, m_SunTextureID);
	m_program.SetTexture("u_earth_texture", 1, m_EarthTextureID);
	m_program.SetTexture("u_moon_texture",  2, m_MoonTextureID);
	m_program.SetTexture("u_sky_texture",   3, m_SkyTextureID);

	m_program.SetUniform("u_materials[0].amb",  materials[0].amb);
	m_program.SetUniform("u_materials[0].dif",  materials[0].dif);
	m_program.SetUniform("u_materials[0].spec", materials[0].spec);
	m_program.SetUniform("u_materials[0].pow",  materials[0].pow);

	m_program.SetUniform("u_materials[1].amb",  materials[1].amb);
	m_program.SetUniform("u_materials[1].dif",  materials[1].dif);
	m_program.SetUniform("u_materials[1].spec", materials[1].spec);
	m_program.SetUniform("u_materials[1].pow",  materials[1].pow);

	m_program.SetUniform("u_materials[2].amb",  materials[2].amb);
	m_program.SetUniform("u_materials[2].dif",  materials[2].dif);
	m_program.SetUniform("u_materials[2].spec", materials[2].spec);
	m_program.SetUniform("u_materials[2].pow",  materials[2].pow);

	m_program.SetUniform("u_materials[3].amb",  materials[3].amb);
	m_program.SetUniform("u_materials[3].dif",  materials[3].dif);
	m_program.SetUniform("u_materials[3].spec", materials[3].spec);
	m_program.SetUniform("u_materials[3].pow",  materials[3].pow);

	m_program.SetUniform("u_materials[4].amb",  materials[4].amb);
	m_program.SetUniform("u_materials[4].dif",  materials[4].dif);
	m_program.SetUniform("u_materials[4].spec", materials[4].spec);
	m_program.SetUniform("u_materials[4].pow",  materials[4].pow);

	m_program.SetUniform("u_materials[5].amb",  materials[5].amb);
	m_program.SetUniform("u_materials[5].dif",  materials[5].dif);
	m_program.SetUniform("u_materials[5].spec", materials[5].spec);
	m_program.SetUniform("u_materials[5].pow",  materials[5].pow);

	m_program.SetUniform("u_materials[6].amb",  materials[6].amb);
	m_program.SetUniform("u_materials[6].dif",  materials[6].dif);
	m_program.SetUniform("u_materials[6].spec", materials[6].spec);
	m_program.SetUniform("u_materials[6].pow",  materials[6].pow);

	m_program.SetUniform("u_materials[7].amb",  materials[7].amb);
	m_program.SetUniform("u_materials[7].dif",  materials[7].dif);
	m_program.SetUniform("u_materials[7].spec", materials[7].spec);
	m_program.SetUniform("u_materials[7].pow",  materials[7].pow);

	m_program.SetUniform("u_materials[8].amb",  materials[8].amb);
	m_program.SetUniform("u_materials[8].dif",  materials[8].dif);
	m_program.SetUniform("u_materials[8].spec", materials[8].spec);
	m_program.SetUniform("u_materials[8].pow",  materials[8].pow);

	m_program.SetUniform("u_materials[9].amb",  materials[9].amb);
	m_program.SetUniform("u_materials[9].dif",  materials[9].dif);
	m_program.SetUniform("u_materials[9].spec", materials[9].spec);
	m_program.SetUniform("u_materials[9].pow",  materials[9].pow);

	m_program.SetUniform("u_materials[10].amb",  materials[10].amb);
	m_program.SetUniform("u_materials[10].dif",  materials[10].dif);
	m_program.SetUniform("u_materials[10].spec", materials[10].spec);
	m_program.SetUniform("u_materials[10].pow",  materials[10].pow);

	m_program.SetUniform("u_materials[11].amb",  materials[11].amb);
	m_program.SetUniform("u_materials[11].dif",  materials[11].dif);
	m_program.SetUniform("u_materials[11].spec", materials[11].spec);
	m_program.SetUniform("u_materials[11].pow",  materials[11].pow);

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