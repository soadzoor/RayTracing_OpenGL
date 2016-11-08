# Raytracing
## This project is a realtime raytracing application, using the openGL library.

## On Windows, I provide installers on http://vargapeter.info/opengl/raytracing/installers

## Compile from source on Linux
On debian-based systems (like ubuntu, xubuntu, etc...):  
Clone project, or download as zip, extract project folder, then run "install.sh". That should take care of everything (like installing dependencies, compiling source, etc). Tested on freshly installed Ubuntu (16.04 LTS) and Xubuntu (16.04 LTS).  
If you're using another distro, you should manually follow the commands line by line from "install.sh" (replace them with the appropriate commands based on your distribution).  

## Compile from source on Windows
0. You need Microsoft Visual Studio 2013, or later (If you know your way around, you can probably get it work without Visual Studio, but this is the recommended, simplest way)
1. Download (clone) the project (extract if it's zipped).
2. Extract the *OGLPack_VS2015.zip* file to a folder, for example your C:\ drive.
3. Make a virtual drive of the folder where you extracted the zip. For example, if you extracted to *C:\*, then you should have a folder *OGLPack*. You can access it at *C:\OGLPack*, so you need to make C:\ a virtual drive called *T:\*. The simplest method is to open the windows command line (search for *cmd*) and type: *subst t: c:\*
4. You can open up the project and press *Build and run*. Tested on Visual Studio 2013 and 2015.

## Actions:  
You can move with "WASD" and look around with your mouse, but you have to hold the left mousebutton on the window to do so.  
"left shift": while holding it, your speed is reduced to half
"p": pause moving objects  
"n": toggle normalmaps  
"1": toggle shadows  
"g": toggle sunglow  
"v": toggle vsync  
"left arrow": decrease ray depth  
"right arrow": increase ray depth  
"up arrow/down arrow": change color mode  