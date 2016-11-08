#!/bin/bash

GREEN=`tput setaf 2`
NC=`tput sgr0` # No color

echo ${GREEN}Installing dependencies...${NC}
sudo apt -y -qq update
sudo apt -y -qq install g++ 
sudo apt -y -qq install build-essential
sudo apt -y -qq install xorg-dev
sudo apt -y -qq install libudev-dev
sudo apt -y -qq install libgl1-mesa-dev
sudo apt -y -qq install libglu1-mesa-dev
sudo apt -y -qq install libasound2-dev
sudo apt -y -qq install libpulse-dev
sudo apt -y -qq install libogg-dev
sudo apt -y -qq install libvorbis-dev
sudo apt -y -qq install libpng12-dev
sudo apt -y -qq install libfreetype6-dev
sudo apt -y -qq install libusb-dev
sudo apt -y -qq install libdbus-1-dev
sudo apt -y -qq install zlib1g-dev
sudo apt -y -qq install libjpeg-dev
sudo apt -y -qq install libglew-dev
echo ${GREEN}Installing unzip...${NC}
sudo apt -y -qq install unzip

echo ${GREEN}Installing SDL2...${NC}
if sudo apt -y -qq install libsdl2-dev ; then
	echo ${GREEN}SDL2 successfully installed!${NC}
else
	echo ${GREEN}SDL2 cannot be installed! Trying to compile from source...${NC}
	wget https://www.libsdl.org/release/SDL2-2.0.5.zip
	unzip SDL2-2.0.5.zip
	cd SDL2-2.0.5
	./configure
	make
	sudo make install
	sudo ldconfig
	cd ..
	rm -rf SDL2-2.0.5.zip
	rm -rf SDL2-2.0.5
	echo ${GREEN}SDL2 has been successfully compiled from source and installed on your system!${NC}
fi

echo ${GREEN}Installing SDL-2 Image...${NC}
if sudo apt -y -qq install libsdl2-image-dev ; then
	echo ${GREEN}SDL-2 Image successfully installed!${NC}
else
	echo ${GREEN}SDL-2 Image cannot be installed! Trying to compile from source...${NC}
	wget https://www.libsdl.org/projects/SDL_image/release/SDL2_image-2.0.1.zip
	unzip SDL2_image-2.0.1.zip
	cd SDL2_image-2.0.1
	./configure
	make
	sudo make install
	sudo ldconfig
	cd ..
	rm -rf SDL2_image-2.0.1.zip
	rm -rf SDL2_image-2.0.1
	echo ${GREEN}SDL2-Image has been successfully compiled from source and installed on your system!${NC}
fi


echo ${GREEN}Unzipping contents...${NC}
mkdir include
unzip ../OGLPack_VS2015.zip
cp -r OGLPack/include/* include
rm -rf OGLPack

echo ${GREEN}Compiling source...${NC}
g++ *.cpp -c -std=c++11 -I./include
echo ${GREEN}Linking program...${NC}
g++ *.o -lSDL2 -lSDL2_image -lGL -lGLU -lGLEW -o raytracing
echo ${GREEN}Program has been built successfully! You can run it with the following command:${NC}
echo ${GREEN}./raytracing${NC}
