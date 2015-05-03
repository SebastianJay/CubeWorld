
//globals from map_builder
// tileNum, cubeSideLength, tileLength, elevationStack, mapTextureStack

// taken from learningwebgl lesson 11 on drawing spheres

//webgl
var collectPositionStack = [];
var collectTextureStack = [];
var collectVertexIndexStack = [];
var collectNormalStack = [];

var collectLatitudeBands = 30;
var collectLongitudeBands = 30;
var collectRadius = 0.5;

//game-related
var collectWorldPosStack = [];
var collectFound = [];
var collectiblesRemaining = 0;

function createCollectibles()
{
	var counter = 0;
	for (var i = 0; i < elevationStack.length; i++) {
		var elevations = elevationStack[i];
		var base = -cubeSideLength / 2;
		var ind1 = randInt(5, 16);
		var ind2 = randInt(5, 16);
		var hpos = elevations[ind1*tileNum + ind2];
		var sign = 1;
		var collectHeight = 1.0;
		if (i % 2 == 0)
			sign = -1;
		if (i == 0 || i == 1)
			createSphere(base+tileLength*ind1 + tileLength/2, hpos - sign*collectHeight, base+tileLength*ind2 + tileLength/2);
		if (i == 2 || i == 3)
			createSphere(hpos - sign*collectHeight, base+tileLength*ind1 + tileLength/2, base+tileLength*ind2 + tileLength/2);
		if (i == 4 || i == 5)
			createSphere(base+tileLength*ind1 + tileLength/2, base+tileLength*ind2 + tileLength/2, hpos - sign*collectHeight);
		counter += 1;
	}
	collectiblesRemaining = counter;
}

function createSphere(xpos, ypos, zpos)
{
	var vertexPositionBuffer;
    var vertexNormalBuffer;
    var vertexTextureCoordBuffer;
    var vertexIndexBuffer;
	
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];
		
	var posVec = [xpos, ypos, zpos];
	//console.log(posVec[0] + ' ' + posVec[1] + ' ' + posVec[2]);
	collectWorldPosStack.push(posVec);
	collectFound.push(false);

	for (var latNumber=0; latNumber <= collectLatitudeBands; latNumber++) {
		var theta = latNumber * Math.PI / collectLatitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longNumber=0; longNumber <= collectLongitudeBands; longNumber++) {
			var phi = longNumber * 2 * Math.PI / collectLongitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNumber / collectLongitudeBands);
			var v = 1 - (latNumber / collectLatitudeBands);

			normalData.push(x);
			normalData.push(y);
			normalData.push(z);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(xpos + collectRadius * x);
			vertexPositionData.push(ypos + collectRadius * y);
			vertexPositionData.push(zpos + collectRadius * z);			
		}
	}

	var indexData = [];
	for (var latNumber=0; latNumber < collectLatitudeBands; latNumber++) {
		for (var longNumber=0; longNumber < collectLongitudeBands; longNumber++) {
			var first = (latNumber * (collectLongitudeBands + 1)) + longNumber;
			var second = first + collectLongitudeBands + 1;
			indexData.push(first);
			indexData.push(second);
			indexData.push(first + 1);

			indexData.push(second);
			indexData.push(second + 1);
			indexData.push(first + 1);
		}
	}

	vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	vertexNormalBuffer.itemSize = 3;
	vertexNormalBuffer.numItems = normalData.length / 3;

	vertexTextureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	vertexTextureCoordBuffer.itemSize = 2;
	vertexTextureCoordBuffer.numItems = textureCoordData.length / 2;

	vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	vertexPositionBuffer.itemSize = 3;
	vertexPositionBuffer.numItems = vertexPositionData.length / 3;

	vertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	vertexIndexBuffer.itemSize = 1;
	vertexIndexBuffer.numItems = indexData.length;
	
	collectPositionStack.push(vertexPositionBuffer);
	collectNormalStack.push(vertexNormalBuffer);
	collectTextureStack.push(vertexTextureCoordBuffer);
	collectVertexIndexStack.push(vertexIndexBuffer);
}


function drawCollectibles() {
	for (var i = 0; i < collectPositionStack.length; i++) {
		if (collectFound[i])
			continue;
		
		var vertexPositionBuffer = collectPositionStack[i];
		var vertexNormalBuffer = collectNormalStack[i];
		var vertexTextureBuffer = collectTextureStack[i];
		var vertexIndexBuffer = collectVertexIndexStack[i];
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureStack[12 + i]);
		gl.uniform1i(shaderProgram.samplerUniform, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vertexTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.uniform1i(shaderProgram.useLightingUniform, true);
		gl.uniform3f(shaderProgram.ambientColorUniform, 0.5, 0.5, 0.5);
		var lightingDir = [-1.0, -1.0, 0.0];
		var lightingDirNorm = vec3.create();
		vec3.normalize(lightingDir, lightingDirNorm);
		vec3.scale(lightingDirNorm, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightingDirNorm);
		gl.uniform3f(shaderProgram.directionalColorUniform, 0.7, 0.7, 0.7);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}

function checkCollisionCollectibles() {
	for (var i = 0; i < collectWorldPosStack.length; i++) {
		if (collectFound[i])
			continue;
		var posVec = collectWorldPosStack[i];
		//console.log(posVec[0] + ' ' + posVec[1] + ' ' + posVec[2]);
		if ( ((xPos - posVec[0])*(xPos - posVec[0]) + (yPos - posVec[1])*(yPos - posVec[1]) + (zPos - posVec[2])*(zPos - posVec[2])) < collectRadius*collectRadius ) {
			collectFound[i] = true;
			collectiblesRemaining -= 1;
		}
	}
}
