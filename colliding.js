
//Globals to work with
//xPos, yPos, zPos
// elevationStack

//1 - negative y
//0 - positive y
//3 - negative x
//2 - positive x
//5 - negative z
//4 - positive z

var epsilon = 0.0001;
function checkCollisionGravity(xpos1, ypos1, zpos1) {
	if (gravY < 0 && ypos1 - yPos < 0) {
		var groundElevations = elevationStack[1];
		var base = -cubeSideLength / 2;
		var flag = false;
		for (var i = 0; i < tileNum; i++) {
			for (var j = 0; j < tileNum; j++) {
				if (xPos+epsilon > base + i*2.0 && xPos-epsilon < base + (i+1)*2.0
					&& zPos+epsilon > base + j*2.0 && zPos-epsilon < base + (j+1)*2.0) {
					//console.log(i);
					//console.log(j);
					//console.log(groundElevations[i*tileNum + j]);
					if (ypos1-height < groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return !flag;
	}
	else if (gravY > 0) {
		
	}
	return false;
}

function checkCollisionGeneral(xpos1, ypos1, zpos1) {
	
}