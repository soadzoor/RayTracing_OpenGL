# Raytracing
## This project is a realtime raytracing application, using the openGL library.

##How to run
0. You need Microsoft Visual Studio 2013, or later (If you know your way around, you can probably get it work without Visual Studio, but this is the recommended, simplest way)
1. Download the project
2. Extract the *OGLPack_VS2015.zip* file to a folder, for example your C:\ drive.
3. Make a virtual drive of the folder where you extracted the zip. For example, if you extracted to *C:\*, then you should have a folder *OGLPack*. You can access it at *C:\OGLPack*, so you need to make C:\ a virtual drive called *T:\*. The simplest method is to open the windows command line (search for *cmd*) and type: *subst t: c:\*
4. You can open up the project and press *Build and run*. Tested on Visual Studio 2013 and 2015.
5. You can move with "WASD" and look around with your mouse, but you have to hold the left mousebutton on the window to do so.
6. Actions:  
"p": pause moving objects  
"n": toggle normalmaps  
"1": toggle shadows  
"t": toggle torus  
"g": toggle sunglow  
"v": toggle vsync  
"left arrow": decrease ray depth  
"right arrow": increase ray depth  