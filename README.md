CubeWorld
===

A 3D, first person perspective platforming game made for UVa Intro to Graphics (CS 4810).
This game was developed entirely with WebGL, with some help from the glMatrix library and code from tutorials at [Learning WebGL.com](http://learningwebgl.com/blog/?page_id=1217).
The game makes use of buffers for pretty much all the rendering -- the ground and siding tiles are in a series of buffers separated by texture. The objects on the map make use of common
buffers (i.e. one for a sphere, one for a cylinder, and one for a cone) whose positions, rotations, and scales are transformed using matrix math.
There is also some point lighting to make the lips of the platforms look darker. The physics and collisions were all hackishly put together, but they are of reasonable robustness for this application.

Link to game [here](http://sebastianjay.github.io/CubeWorld/index.html). I had to use Firefox to run it locally since Chrome doesn't allow loading the local images by default (also unsure how IE or other browsers react).

Controls
---
There are two sets of key bindings -- the former is recommended if the whole canvas cannot fit onto the screen (because the latter causes the page to scroll up or down).

* A/D or Left/Right- turn left or right
* W/S or Up/Down- move forward or backward
* Q/E or Page Up/Page Down - look up or down
* P or Space - Jump

Gameplay
---
The goal is to collect all six spheres from the six faces of the cube.
Each face of the cube-world has a theme with its own properties/hazards:

* Grass - tree obstructions
* Metal - repulsive sphere obstructions
* Fire - fire tiles which reduce health
* Earth - more hilly
* Water - water tiles which cause player to sink and sap health
* Shadow - bottomless pits

The amount of HP you have is shown on the canvas bottom right corner; this is affected by fire and water. When you win or lose, a message will render on screen around the same area. Parts of the world (tile elevations, obstruction placements) are procedurally generated when the page loads, so each "run" will be different. There is no way to restart the game aside from refreshing the page.
