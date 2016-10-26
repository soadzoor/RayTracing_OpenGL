// GLEW
#include <GL/glew.h>

// SDL
#include <SDL.h>
#include <SDL_opengl.h>

#include <iostream>
#include <sstream>

#include "MyApp.h"

void exitProgram()
{
	SDL_Quit();

	system("pause");
}

int main( int argc, char* args[] )
{
	// �ll�tsuk be, hogy kil�p�s el�tt h�vja meg a rendszer az exitProgram() f�ggv�nyt - K�rd�s: mi lenne en�lk�l?
	atexit( exitProgram );

	//
	// 1st step: Initialize SDL
	//

	// Turn on graphics subsystem, check for errors
	if ( SDL_Init( SDL_INIT_VIDEO ) == -1 )
	{
		// Write out errors, then exit.
		std::cout << "[init SDL]Error while initializing SDL: " << SDL_GetError() << std::endl;
		return 1;
	}
			
	//
	// 2. l�p�s: �ll�tsuk be az OpenGL-es ig�nyeinket, hozzuk l�tre az ablakunkat, ind�tsuk el az OpenGL-t
	//

	// 2a: OpenGL ind�t�s�nak konfigur�l�sa, ezt az ablak l�trehoz�sa el�tt kell megtenni!

	// be�ll�thatjuk azt, hogy pontosan milyen OpenGL context-et szeretn�nk l�trehozni - ha nem tessz�k, akkor
	// automatikusan a legmagasabb el�rhet� verzi�j�t kapjuk
    //SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 3);
    //SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 2);

	// �ll�tsuk be, hogy h�ny biten szeretn�nk t�rolni a piros, z�ld, k�k �s �tl�tszatlans�gi inform�ci�kat pixelenk�nt
    SDL_GL_SetAttribute(SDL_GL_BUFFER_SIZE,         32);
    SDL_GL_SetAttribute(SDL_GL_RED_SIZE,            8);
    SDL_GL_SetAttribute(SDL_GL_GREEN_SIZE,          8);
    SDL_GL_SetAttribute(SDL_GL_BLUE_SIZE,           8);
    SDL_GL_SetAttribute(SDL_GL_ALPHA_SIZE,          8);
	// duplapufferel�s
	SDL_GL_SetAttribute(SDL_GL_DOUBLEBUFFER,		1);
	// m�lys�gi puffer h�ny bites legyen
    SDL_GL_SetAttribute(SDL_GL_DEPTH_SIZE,          24);

	// antialiasing - ha kell
	//SDL_GL_SetAttribute(SDL_GL_MULTISAMPLEBUFFERS,  1);
	//SDL_GL_SetAttribute(SDL_GL_MULTISAMPLESAMPLES,  2);

	// hozzuk l�tre az ablakunkat
	SDL_Window *win = 0;
	int width = 800;
	int height = 600;
    win = SDL_CreateWindow( "Hello SDL&OpenGL!",		// az ablak fejl�ce
							100,						// az ablak bal-fels� sark�nak kezdeti X koordin�t�ja
							100,						// az ablak bal-fels� sark�nak kezdeti Y koordin�t�ja
							width,						// ablak sz�less�ge
							height,						// �s magass�ga
							SDL_WINDOW_OPENGL | SDL_WINDOW_SHOWN | SDL_WINDOW_RESIZABLE);			// megjelen�t�si tulajdons�gok


	// ha nem siker�lt l�trehozni az ablakot, akkor �rjuk ki a hib�t, amit kaptunk �s l�pj�nk ki
    if (win == 0)
	{
		std::cout << "[Creating window]Error while initializing window: " << SDL_GetError() << std::endl;
        return 1;
    }

	//
	// 3rd step: creating OpenGL context
	//

	SDL_GLContext	context	= SDL_GL_CreateContext(win);
    if (context == 0)
	{
		std::cout << "[Creating OGL context]Error while initializing SDL: " << SDL_GetError() << std::endl;
        return 1;
    }	

	// Vsync: ON

	SDL_GL_SetSwapInterval(1);

	// start GLEW
	GLenum error = glewInit();
	if ( error != GLEW_OK )
	{
		std::cout << "[GLEW] Error while initializing!" << std::endl;
		return 1;
	}

	// Request OpenGL version number
	int glVersion[2] = {-1, -1}; 
	glGetIntegerv(GL_MAJOR_VERSION, &glVersion[0]); 
	glGetIntegerv(GL_MINOR_VERSION, &glVersion[1]); 
	std::cout << "Running OpenGL " << glVersion[0] << "." << glVersion[1] << std::endl;

	printf("Vendor (%s), Renderer (%s)\n", glGetString(GL_VENDOR), glGetString(GL_RENDERER));

	if ( glVersion[0] == -1 && glVersion[1] == -1 )
	{
		SDL_GL_DeleteContext(context);
		SDL_DestroyWindow( win );

		std::cout << "[Creating OGL context] Error while creating OpenGL context! Some options in SDL_GL_SetAttribute(...) calls might be wrong." << std::endl;

		return 1;
	}

	std::stringstream window_title;
	window_title << "OpenGL " << glVersion[0] << "." << glVersion[1];
	SDL_SetWindowTitle(win, window_title.str().c_str());

	//
	// 4th step: start the loop
	// 

	// set it true and the program will terminate
	bool quit = false;
	// message to be processed
	SDL_Event ev;
	
	// instance of the app
	CMyApp app;
	if (!app.Init())
	{
		SDL_DestroyWindow(win);
		std::cout << "Error while initializing app!" << std::endl;
		return 1;
	}
	Uint32	lastUpdate = SDL_GetTicks();
	int		frameCount = 0;

	while (!quit)
	{
		// while there are messages to process, process them:
		while ( SDL_PollEvent(&ev) )
		{
			switch (ev.type)
			{
			case SDL_QUIT:
				quit = true;
				break;
			case SDL_KEYDOWN:
				if (ev.key.keysym.sym == SDLK_ESCAPE)
				{
					//quit = true;
					if (SDL_GetWindowFlags(win) & SDL_WINDOW_FULLSCREEN) // if window is fullscreen
					{
						std::cout << "Back to Window Mode" << std::endl;
						SDL_SetWindowFullscreen(win, 0);
						SDL_SetWindowSize(win, width, height);
						SDL_SetWindowPosition(win, 100, 100);
						app.Resize(width, height);
					}
				}
					
				app.KeyboardDown(ev.key);
				break;
			case SDL_KEYUP:
				app.KeyboardUp(ev.key);
				break;
			case SDL_MOUSEBUTTONDOWN:
				app.MouseDown(ev.button);
				break;
			case SDL_MOUSEBUTTONUP:
				app.MouseUp(ev.button);
				break;
			case SDL_MOUSEWHEEL:
				app.MouseWheel(ev.wheel);
				break;
			case SDL_MOUSEMOTION:
				app.MouseMove(ev.motion);
				break;
			case SDL_WINDOWEVENT:
				if ( ev.window.event == SDL_WINDOWEVENT_SIZE_CHANGED )
				{
					app.Resize(ev.window.data1, ev.window.data2);
					std::cout << "Resolution changed to: " << ev.window.data1 << "x" << ev.window.data2 << std::endl;
				}
				if (ev.window.event == SDL_WINDOWEVENT_MAXIMIZED)
				{
					SDL_SetWindowFullscreen(win, SDL_WINDOW_FULLSCREEN);
					std::cout << "MAXIMIZED" << std::endl;
				}
				break;
			}
		}

		app.Update();
		app.Render();

		++frameCount;

		if (SDL_GetTicks() - lastUpdate > 1000)
		{

			window_title.str(std::string());
			window_title << "OpenGL " << glVersion[0] << "." << glVersion[1] << ", FPS: " << --frameCount;
			SDL_SetWindowTitle(win, window_title.str().c_str());

			lastUpdate = SDL_GetTicks();
			frameCount = 0;
		}

		SDL_GL_SwapWindow(win);
	}


	//
	// 5th step: quit
	// 

	// Clean
	app.Clean();

	SDL_GL_DeleteContext(context);
	SDL_DestroyWindow( win );

	return 0;
}