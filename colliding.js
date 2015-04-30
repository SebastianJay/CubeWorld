
//Globals to work with
//xPos, yPos, zPos, height
// elevationStack
// cubeSideLength
// tileLength

//0 - negative y
//1 - positive y
//2 - negative x
//3 - positive x
//4 - negative z
//5 - positive z

var epsilon = 0.0001;
function checkCollisionGravity(xpos1, ypos1, zpos1) {
	if (gravY < 0) {
		var groundElevations = elevationStack[0];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (xPos+epsilon > base + i*2.0 && xPos-epsilon < base + (i+1)*2.0
					&& zPos+epsilon > base + j*2.0 && zPos-epsilon < base + (j+1)*2.0) {
					if (ypos1-height < groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, xpos1, groundElevations[i*tileNum+j]+height, zpos1];
	}
	else if (gravY > 0) {
		var groundElevations = elevationStack[1];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (xPos+epsilon > base + i*2.0 && xPos-epsilon < base + (i+1)*2.0
					&& zPos+epsilon > base + j*2.0 && zPos-epsilon < base + (j+1)*2.0) {
					if (ypos1+height > groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, xpos1, groundElevations[i*tileNum+j]-height, zpos1];		
	}
	else if (gravX < 0) {
		var groundElevations = elevationStack[2];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (yPos+epsilon > base + i*2.0 && yPos-epsilon < base + (i+1)*2.0
					&& zPos+epsilon > base + j*2.0 && zPos-epsilon < base + (j+1)*2.0) {
					if (xpos1-height < groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, groundElevations[i*tileNum+j]+height, ypos1, zpos1];		
	}
	else if (gravX > 0) {
		var groundElevations = elevationStack[3];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (yPos+epsilon > base + i*2.0 && yPos-epsilon < base + (i+1)*2.0
					&& zPos+epsilon > base + j*2.0 && zPos-epsilon < base + (j+1)*2.0) {
					if (xpos1+height > groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, groundElevations[i*tileNum+j]-height, ypos1, zpos1];		
	}
	else if (gravZ < 0) {
		var groundElevations = elevationStack[4];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (xPos+epsilon > base + i*2.0 && xPos-epsilon < base + (i+1)*2.0
					&& yPos+epsilon > base + j*2.0 && yPos-epsilon < base + (j+1)*2.0) {
					if (zpos1-height < groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, xpos1, ypos1, groundElevations[i*tileNum+j]+height];		
	}	
	else if (gravZ > 0) {
		var groundElevations = elevationStack[5];
		var base = -cubeSideLength / 2;
		var flag = false;
		var i, j;
		for (i = 0; i < tileNum; i++) {
			for (j = 0; j < tileNum; j++) {
				if (xPos+epsilon > base + i*2.0 && xPos-epsilon < base + (i+1)*2.0
					&& yPos+epsilon > base + j*2.0 && yPos-epsilon < base + (j+1)*2.0) {
					if (zpos1+height > groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					}
				}
			}
			if (flag)
				break;
		}
		return [!flag, xpos1, ypos1, groundElevations[i*tileNum+j]-height];		
	}	
	return [false];
}

function checkCollisionGeneral(xpos1, ypos1, zpos1) {
	
}