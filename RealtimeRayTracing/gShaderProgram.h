#pragma once

#include <GL/glew.h>
#include <SDL_opengl.h>

#include <map>
#include <string>
#include <list>

#include <glm/glm.hpp>

class gShaderProgram
{
public:
	gShaderProgram(void);
	~gShaderProgram(void);

	bool AttachShader(GLenum _shaderType, const char* _filename);
	void BindAttribLoc(int _index, const char* _uniform);
	void BindFragDataLoc(int _index, const char* _uniform);
	bool LinkProgram();
	GLuint getProgramId();

	void SetVerbose(bool);

	void On();
	void Off();

	void Clean();

	void SetUniform(GLint loc, glm::vec2& _vec);
	void SetUniform(GLint loc, glm::vec3& _vec);
	void SetUniform(GLint loc, glm::vec4& _vec);
	void SetUniform(GLint loc, glm::mat4& _mat);
	void SetUniform(GLint loc, int _i);
	void SetUniform(GLint loc, float _f);
	void SetUniform(GLint loc, float _a, float _b, float _c, float _d);
	void SetUniform(GLint loc, float _a, float _b, float _c);
	void SetUniform(GLint loc, float _a, float _b);
	void SetTexture(GLint loc, int _sampler, GLuint _textureID);
	void SetCubeTexture(GLint loc, int _sampler, GLuint _textureID);
protected:
	GLuint	getLocation(const char* _uniform);
	GLuint	loadShader(GLenum _shaderType, const char* _fileName);

	GLuint							m_id_program;
	std::map< std::string, GLint >	m_map_uniform_locations;
	std::list< GLuint >				m_list_shaders_attached;

	bool	m_verbose;
};

