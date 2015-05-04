
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
var wallDist = 0.5;
function checkCollisionGravity(xpos1, ypos1, zpos1) {
	var groundElevations;
	var properties;
	var base = -cubeSideLength / 2;
	var ipos;
	var jpos;
	var hpos;
	var i, j;
	var flag = false;
	if (gravY < 0 || gravY > 0) {
		if (gravY < 0) {
			groundElevations = elevationStack[0];
			properties = mapPropertyStack[0];
		}
		else {
			groundElevations = elevationStack[1];
			properties = mapPropertyStack[1];
		}
		ipos = xPos;
		jpos = zPos;
		hpos = ypos1;
	} else if (gravX < 0 || gravX > 0) {
		if (gravX < 0) {
			groundElevations = elevationStack[2];
			properties = mapPropertyStack[2];
		}
		else {
			groundElevations = elevationStack[3];
			properties = mapPropertyStack[3];
		}
		ipos = yPos;
		jpos = zPos;
		hpos = xpos1;		
	} else if (gravZ < 0 || gravZ > 0) {
		if (gravZ < 0) {
			groundElevations = elevationStack[4];
			properties = mapPropertyStack[4];
		}
		else {
			groundElevations = elevationStack[5];
			properties = mapPropertyStack[5];
		}
		ipos = xPos;
		jpos = yPos;
		hpos = zpos1;
	}
	
	for (i = 0; i < tileNum; i++) {
		for (j = 0; j < tileNum; j++) {
			if (ipos+epsilon > base + i*tileLength && ipos-epsilon < base + (i+1)*tileLength
				&& jpos+epsilon > base + j*tileLength && jpos-epsilon < base + (j+1)*tileLength) {
				
				if (gravY < 0 || gravX < 0 || gravZ < 0) {
					if (hpos-height < groundElevations[i*tileNum + j] && properties[i*tileNum + j] != 'hole') {
						flag = true;
						break;
					}
				} else {
					if (hpos+height > groundElevations[i*tileNum + j] && properties[i*tileNum + j] != 'hole') {
						flag = true;
						break;
					}
				}
			}
		}
		if (flag)
			break;
	}
	
	if (flag) {
		if (gravY < 0)
			return [false, xpos1, groundElevations[i*tileNum+j]+height, zpos1];
		if (gravY > 0)
			return [false, xpos1, groundElevations[i*tileNum+j]-height, zpos1];
		if (gravX < 0)
			return [false, groundElevations[i*tileNum+j]+height, ypos1, zpos1];
		if (gravX > 0)
			return [false, groundElevations[i*tileNum+j]-height, ypos1, zpos1];
		if (gravZ < 0)
			return [false, xpos1, ypos1, groundElevations[i*tileNum+j]+height];
		if (gravZ > 0)
			return [false, xpos1, ypos1, groundElevations[i*tileNum+j]-height];		
	}
	return [true];
}




function checkCollisionGeneral(xpos1, ypos1, zpos1) {
	var groundElevations;
	var properties;
	var base = -cubeSideLength / 2;
	var iPos, jPos, hPos;
	var ipos, jpos, hpos;
	var i, j;
	var flag = false;
	if (gravY < 0 || gravY > 0) {
		if (gravY < 0) {
			groundElevations = elevationStack[0];
			properties = mapPropertyStack[0];
		}
		else {
			groundElevations = elevationStack[1];
			properties = mapPropertyStack[1];
		}
		iPos = xPos;
		jPos = zPos;
		hPos = yPos;
		ipos = xpos1;
		jpos = zpos1;
		hpos = ypos1;
	} else if (gravX < 0 || gravX > 0) {
		if (gravX < 0) {
			groundElevations = elevationStack[2];
			properties = mapPropertyStack[2];
		}
		else {
			groundElevations = elevationStack[3];
			properties = mapPropertyStack[3];
		}
		iPos = yPos;
		jPos = zPos;
		hPos = xPos;
		ipos = ypos1;
		jpos = zpos1;
		hpos = xpos1;
	} else if (gravZ < 0 || gravZ > 0) {
		if (gravZ < 0) {
			groundElevations = elevationStack[4];
			properties = mapPropertyStack[4];
		}
		else {
			groundElevations = elevationStack[5];
			properties = mapPropertyStack[5];
		}
		iPos = xPos;
		jPos = yPos;
		hPos = zPos;
		ipos = xpos1;
		jpos = ypos1;
		hpos = zpos1;
	}
	
	if (ipos < base+wallDist || ipos > base + cubeSideLength -wallDist || jpos < base +wallDist || jpos > base + cubeSideLength - wallDist) {
		if (gravY < 0 || gravY > 0)
			return [false, Math.min(Math.max(ipos, base+wallDist), base+cubeSideLength-wallDist), hpos, Math.min(Math.max(jpos, base+wallDist), base+cubeSideLength-wallDist) ]
		if (gravX < 0 || gravX > 0)
			return [false, hpos, Math.min(Math.max(ipos, base+wallDist), base+cubeSideLength-wallDist), Math.min(Math.max(jpos, base+wallDist), base+cubeSideLength-wallDist) ]	
		if (gravZ < 0 || gravZ > 0)
			return [false, Math.min(Math.max(ipos, base+wallDist), base+cubeSideLength-wallDist), Math.min(Math.max(jpos, base+wallDist), base+cubeSideLength-wallDist), hpos ]			
	} 
	
	for (i = 0; i < tileNum; i++) {
		for (j = 0; j < tileNum; j++) {
			if (ipos+epsilon > base + i*tileLength && ipos-epsilon < base + (i+1)*tileLength
				&& jpos+epsilon > base + j*tileLength && jpos-epsilon < base + (j+1)*tileLength) {
				if (gravY < 0 || gravX < 0 || gravZ < 0) {
					//todo: add tree, pole collisions to rest of logic
					if (hpos-height < groundElevations[i*tileNum + j] || properties[i*tileNum + j] == 'tree' || properties[i*tileNum + j] == 'pole') {
						flag = true;
						break;
					} else if (iPos+epsilon < base + i*tileLength && jPos+epsilon < base+j*tileLength && 
						(hpos-height < groundElevations[i*tileLength+j+1] || hpos-height < groundElevations[(i+1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos-epsilon > base + (i+1)*tileLength && jPos-epsilon > base+(j+1)*tileLength && 
						(hpos-height < groundElevations[i*tileLength+j-1] || hpos-height < groundElevations[(i-1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos+epsilon < base + i*tileLength && jPos-epsilon > base+(j+1)*tileLength && 
						(hpos-height < groundElevations[i*tileLength+j+1] || hpos-height < groundElevations[(i-1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos-epsilon > base + (i+1)*tileLength && jPos+epsilon < base+j*tileLength && 
						(hpos-height < groundElevations[i*tileLength+j-1] || hpos-height < groundElevations[(i+1)*tileLength+j])) {
						flag = true;
						break;
					}				
				} else {
					if (hpos+height > groundElevations[i*tileNum + j]) {
						flag = true;
						break;
					} else if (iPos+epsilon < base + i*tileLength && jPos+epsilon < base+j*tileLength && 
						(hpos+height > groundElevations[i*tileLength+j+1] || hpos+height > groundElevations[(i+1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos-epsilon > base + (i+1)*tileLength && jPos-epsilon > base+(j+1)*tileLength && 
						(hpos+height > groundElevations[i*tileLength+j-1] || hpos+height > groundElevations[(i-1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos+epsilon < base + i*tileLength && jPos-epsilon > base+(j+1)*tileLength && 
						(hpos+height > groundElevations[i*tileLength+j+1] || hpos+height > groundElevations[(i-1)*tileLength+j])) {
						flag = true;
						break;
					} else if (iPos-epsilon > base + (i+1)*tileLength && jPos+epsilon < base+j*tileLength && 
						(hpos+height > groundElevations[i*tileLength+j-1] || hpos+height > groundElevations[(i+1)*tileLength+j])) {
						flag = true;
						break;
					}	
				}
			}
		}
		if (flag)
			break;
	}
	
	if (flag) {
		var iret, jret;
		if (iPos+epsilon < base + i*tileLength) {
			iret = base+i*tileLength - 2*epsilon;
		} else if (iPos-epsilon > base + (i+1)*tileLength) {
			iret = base+(i+1)*tileLength + 2*epsilon;
		} else {
			iret = ipos;
		}
		
		if (jPos+epsilon < base+j*tileLength) {
			jret = base+j*tileLength - 2*epsilon;
		} else if (jPos-epsilon > base+(j+1)*tileLength) {
			jret = base+(j+1)*tileLength + 2*epsilon;
		} else {
			jret = jpos;
		}
		
		if (gravY < 0 || gravY > 0)
			return [!flag, iret, hpos, jret];
		if (gravX < 0 || gravX > 0)
			return [!flag, hpos, iret, jret];
		if (gravZ < 0 || gravZ > 0)
			return [!flag, iret, jret, hpos];	
	}
	return [true];
}


//uses xPos, yPos, zPos, 
// uses/modifies gravX, gravY, gravZ
function checkGravitySwitch() {
	var base = -cubeSideLength / 2;
	var end = cubeSideLength / 2;
	if (gravY < 0 || gravY > 0) {
		if (xPos < base + tileLength) {
			gravY = 0.0;
			gravX = -1.0;
		} else if (xPos > end - tileLength) {
			gravY = 0.0;
			gravX = 1.0;
		} else if (zPos < base + tileLength) {
			gravY = 0.0;
			gravZ = -1.0;
		} else if (zPos > end - tileLength) {
			gravY = 0.0;
			gravZ = 1.0;
		}
	} else if (gravX < 0 || gravX > 0) {
		if (yPos < base + tileLength) {
			gravX = 0.0;
			gravY = -1.0;
		} else if (yPos > end - tileLength) {
			gravX = 0.0;
			gravY = 1.0;
		} else if (zPos < base + tileLength) {
			gravX = 0.0;
			gravZ = -1.0;
		} else if (zPos > end - tileLength) {
			gravX = 0.0;
			gravZ = 1.0;
		}
	} else if (gravZ < 0 || gravZ > 0) {
		if (xPos < base + tileLength) {
			gravZ = 0.0;
			gravX = -1.0;
		} else if (xPos > end - tileLength) {
			gravZ = 0.0;
			gravX = 1.0;
		} else if (yPos < base + tileLength) {
			gravZ = 0.0;
			gravY = -1.0;
		} else if (yPos > end - tileLength) {
			gravZ = 0.0;
			gravY = 1.0;
		}
	}	
}

