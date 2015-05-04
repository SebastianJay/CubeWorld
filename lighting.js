
//globals from map_builder
// 

var ambientLightFlat = [];
var dirLightDirectionFlat = [];
var dirLightColorFlat = [];
var pointLightPositionFlat = [];
var pointLightColorFlat = [];
//var lightNum = 0;

function createLights()
{
	createDirLight(0.0, -1.0, 0.0, 0.0, 0.0, 0.0);
	pointLightPositionFlat.push(0.0, 0.0, 0.0);
	pointLightColorFlat.push(1.0, 1.0, 1.0);
	ambientLightFlat.push(1.0, 1.0, 1.0);
}

function createDirLight(xdir, ydir, zdir, rcolor, gcolor, bcolor)
{
	var mag = Math.sqrt(xdir*xdir + ydir*ydir + zdir*zdir);
	var lightingDirNorm = [-xdir / mag, -ydir / mag, -zdir / mag];
	
	dirLightDirectionFlat.push(lightingDirNorm[0], lightingDirNorm[1], lightingDirNorm[2]);
	dirLightColorFlat.push(rcolor, gcolor, bcolor);
}
