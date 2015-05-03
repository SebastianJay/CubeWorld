
var tileNum = 20;
var cubeSideLength = 40.0;	//center at (0, 0, 0)
var tileLength = 2.0;

var mapPositionStack = [];
var mapNormalStack = [];
var mapTextureStack = [];
var mapVertexIndexStack = [];
var elevationStack = [];

var sidingPositionStack = [];
var sidingNormalStack = [];
var sidingTextureStack = [];
var sidingVertexIndexStack = [];

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function createMap()
{
	//order must be consistent here
	createFace(-1, 0);		//grass
	createFace(1, 1);		//shadow
	createFace(-1, 2);		//metal
	createFace(1, 3);		//earth
	createFace(-1, 4);		//fire
	createFace(1, 5);		//water
	
	createSiding(-1, 0);
	createSiding(1, 1);
	createSiding(-1, 2);
	createSiding(1, 3);
	createSiding(-1, 4);
	createSiding(1, 5);
}

function createFace(sign, num)
{
	var vertices = [];
	var textureCoords = [];
	var mapVertexIndices = [];
	var normals = [];
	var elevations = [];
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			var elevationNum; 
			if (i > 0 && j > 0 && i < tileNum-1 && j < tileNum-1)
				elevationNum = randInt(-2, 3);
			else
				elevationNum = 0;
			var base = -cubeSideLength / 2;
			var elevation = -sign*base + elevationNum * 0.2;
			elevations.push(elevation);
			
			var v1 = [], v2 = [], v3 = [], v4 = [];
			var normalVec = [];
			v1.push(base + i*tileLength);
			v1.push(base + j*tileLength);
			v2.push(base + (i+1)*tileLength);
			v2.push(base + j*tileLength);
			v3.push(base + i*tileLength);
			v3.push(base + (j+1)*tileLength);
			v4.push(base + (i+1)*tileLength);
			v4.push(base + (j+1)*tileLength);
			normalVec.push(0.0);
			normalVec.push(0.0);
			if (num == 0 || num == 1) {
				v1.splice(1, 0, elevation);
				v2.splice(1, 0, elevation);
				v3.splice(1, 0, elevation);
				v4.splice(1, 0, elevation);
				normalVec.splice(1, 0, -sign);
			} else if (num == 2 || num == 3) {
				v1.unshift(elevation);
				v2.unshift(elevation);
				v3.unshift(elevation);
				v4.unshift(elevation);
				normalVec.unshift(-sign);
			} else if (num == 4 || num == 5) {
				v1.push(elevation);
				v2.push(elevation);
				v3.push(elevation);
				v4.push(elevation);
				normalVec.push(-sign);
			}
			var allverts = v1.concat(v2).concat(v3).concat(v4);
			var allnorms = normalVec.concat(normalVec, normalVec, normalVec);
			for (var k = 0; k < allverts.length; k++)
				vertices.push(allverts[k]);
			for (var k = 0; k < allnorms.length; k++)
				normals.push(allnorms[k]);
			
			textureCoords.push(0.0);
			textureCoords.push(0.0);
			
			textureCoords.push(1.0);
			textureCoords.push(0.0);

			textureCoords.push(0.0);
			textureCoords.push(1.0);

			textureCoords.push(1.0);
			textureCoords.push(1.0);
			
			mapVertexIndices.push((i*tileNum + j)*4);
			mapVertexIndices.push((i*tileNum + j)*4+1);
			mapVertexIndices.push((i*tileNum + j)*4+3);
			mapVertexIndices.push((i*tileNum + j)*4);
			mapVertexIndices.push((i*tileNum + j)*4+3);
			mapVertexIndices.push((i*tileNum + j)*4+2);
		}
	}
	
	var mapBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	mapBuffer.itemSize = 3;
	mapBuffer.numItems = tileNum * tileNum * 4;
	
	var mapNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	mapNormalBuffer.itemSize = 3;
	mapBuffer.numItems = tileNum * tileNum * 4;

	var mapTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	mapTextureBuffer.itemSize = 2;
	mapTextureBuffer.numItems = tileNum * tileNum * 4;
	
	var mapVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mapVertexIndices), gl.STATIC_DRAW);
	mapVertexIndexBuffer.itemSize = 1;
	mapVertexIndexBuffer.numItems = tileNum * tileNum * 6;
	
	mapPositionStack.push(mapBuffer);
	mapNormalStack.push(mapNormalBuffer);
	mapTextureStack.push(mapTextureBuffer);
	mapVertexIndexStack.push(mapVertexIndexBuffer);
	elevationStack.push(elevations);
}

//lots of args... w/e
function createSidingHelper(v1, v2, v3, v4, ind, sign, normSign, counter, groundElevation, vertices, normals, textureCoords, vertexIndices) {
	var norm = [];
	norm.push(0.0);
	norm.push(0.0);
	if (ind == 0 || ind == 1) {
		v1.splice(1, 0, groundElevation);
		v2.splice(1, 0, groundElevation);
		v3.splice(1, 0, groundElevation + sign*tileLength);
		v4.splice(1, 0, groundElevation + sign*tileLength);
		norm.splice(1, 0, normSign);
	} else if (ind == 2 || ind == 3) {
		v1.unshift(groundElevation);
		v2.unshift(groundElevation);
		v3.unshift(groundElevation + sign*tileLength);
		v4.unshift(groundElevation + sign*tileLength);
		norm.unshift(normSign);
	} else if (ind == 4 || ind == 5) {
		v1.push(groundElevation);
		v2.push(groundElevation);
		v3.push(groundElevation + sign*tileLength);
		v4.push(groundElevation + sign*tileLength);	
		norm.push(normSign);
	}
	var allverts = v1.concat(v2).concat(v3).concat(v4);
	for (var k = 0; k < allverts.length; k++)
		vertices.push(allverts[k]);
	var allnorms = norm.concat(norm, norm, norm);
	for (var k = 0; k < allnorms.length; k++)
		normals.push(allnorms[k]);
	
	textureCoords.push(0.0);
	textureCoords.push(1.0);
	
	textureCoords.push(1.0);
	textureCoords.push(1.0);

	textureCoords.push(1.0);
	textureCoords.push(0.0);

	textureCoords.push(0.0);
	textureCoords.push(0.0);

	vertexIndices.push(counter*4);
	vertexIndices.push(counter*4+1);
	vertexIndices.push(counter*4+2);
	vertexIndices.push(counter*4);
	vertexIndices.push(counter*4+2);
	vertexIndices.push(counter*4+3);
}

function createSiding(sign, ind) {
	var groundElevations = elevationStack[ind];
	var vertices = [];
	var normals = [];
	var textureCoords = [];
	var vertexIndices = [];
	var counter = 0;
	var base = -cubeSideLength / 2;
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			if (i > 0 && -sign*(groundElevations[i*tileNum+j] - groundElevations[(i-1)*tileNum+j]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + i*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + i*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + j*tileLength);				

				createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, counter, groundElevations[i*tileNum + j],
						vertices, normals, textureCoords, vertexIndices);
				counter += 1;
			}
			if (i < tileNum-1 && -sign*(groundElevations[i*tileNum+j] - groundElevations[(i+1)*tileNum+j]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + (i+1)*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + (i+1)*tileLength);
				v4.push(base + j*tileLength);
				
				createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, counter, groundElevations[i*tileNum + j],
						vertices, normals, textureCoords, vertexIndices);
				counter += 1;
			}
			if (j > 0 && -sign*(groundElevations[i*tileNum+j] - groundElevations[i*tileNum+j-1]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + j*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + j*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + j*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + j*tileLength);

				createSidingHelper(v1,v2,v3,v4, ind, sign, -1.0, counter, groundElevations[i*tileNum + j],
						vertices, normals, textureCoords, vertexIndices);
				counter += 1;
			}
			if (j < tileNum-1 && -sign*(groundElevations[i*tileNum+j] - groundElevations[i*tileNum+j+1]) > 0) {
				var v1 = [], v2 = [], v3 = [], v4 = [];
				v1.push(base + i*tileLength);
				v1.push(base + (j+1)*tileLength);
				v2.push(base + (i+1)*tileLength);
				v2.push(base + (j+1)*tileLength);
				v3.push(base + (i+1)*tileLength);
				v3.push(base + (j+1)*tileLength);
				v4.push(base + i*tileLength);
				v4.push(base + (j+1)*tileLength);

				createSidingHelper(v1,v2,v3,v4, ind, sign, 1.0, counter, groundElevations[i*tileNum + j],
						vertices, normals, textureCoords, vertexIndices);
				counter += 1;
			}
		}
	}
	//console.log(counter);
	//console.log(groundElevations.length);
	//console.log(elevationStack.length);
	
	var sidingBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	sidingBuffer.itemSize = 3;
	sidingBuffer.numItems = counter * 4;

	var sidingNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	sidingNormalBuffer.itemSize = 3;
	sidingNormalBuffer.numItems = counter * 4;
	
	var sidingTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, sidingTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	sidingTextureBuffer.itemSize = 2;
	sidingTextureBuffer.numItems = counter * 4;
	
	var sidingVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sidingVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndices), gl.STATIC_DRAW);
	sidingVertexIndexBuffer.itemSize = 1;
	sidingVertexIndexBuffer.numItems = counter * 6;
	
	sidingPositionStack.push(sidingBuffer);
	sidingNormalStack.push(sidingNormalBuffer);
	sidingTextureStack.push(sidingTextureBuffer);
	sidingVertexIndexStack.push(sidingVertexIndexBuffer);
}

function prepMatrixTransforms()
{
	mat4.identity(mvMatrix);
	if (gravX < 0) {
		mat4.rotate(mvMatrix, degToRad(90), [0, 0, 1]);
		mat4.rotate(mvMatrix, degToRad(pitch), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [1, 0, 0]);
	} 
	else if (gravX > 0) {
		mat4.rotate(mvMatrix, degToRad(-90), [0, 0, 1]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [0, 1, 0]);
		mat4.rotate(mvMatrix, degToRad(+yaw), [1, 0, 0]);
	} 
	else if (gravZ < 0) {
		mat4.rotate(mvMatrix, degToRad(-90), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [0, 0, 1]);		
	}
	else if (gravZ > 0) {
		mat4.rotate(mvMatrix, degToRad(90), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(yaw), [0, 0, 1]);				
	}
	else if (gravY > 0) {
		mat4.rotate(mvMatrix, degToRad(180), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(yaw), [0, 1, 0]);						
	} else {
		mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
		mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	}
	mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
}

function drawMap() 
{	
	for (var i = 0; i < mapPositionStack.length; i++) {
		var mapBuffer = mapPositionStack[i];
		var mapNormalBuffer = mapNormalStack[i];
		var mapTextureBuffer = mapTextureStack[i];
		var mapVertexIndexBuffer = mapVertexIndexStack[i];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mapBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mapNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mapNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mapTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureStack[i]);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		gl.uniform1i(shaderProgram.useLightingUniform, true);
		gl.uniform3f(shaderProgram.ambientColorUniform, 0.5, 0.5, 0.5);
		var lightingDir = [-1.0, -1.0, 0.0];
		var lightingDirNorm = vec3.create();
		vec3.normalize(lightingDir, lightingDirNorm);
		vec3.scale(lightingDirNorm, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightingDirNorm);
		gl.uniform3f(shaderProgram.directionalColorUniform, 0.7, 0.7, 0.7);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, mapVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
	
	for (var i = 0; i < sidingPositionStack.length; i++) {
		var sidingBuffer = sidingPositionStack[i];
		var sidingNormalBuffer = sidingNormalStack[i];
		var sidingTextureBuffer = sidingTextureStack[i];
		var sidingVertexIndexBuffer = sidingVertexIndexStack[i];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, sidingBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, sidingBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, sidingNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, sidingNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, sidingTextureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, sidingTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textureStack[i+6]);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		
		gl.uniform1i(shaderProgram.useLightingUniform, true);
		gl.uniform3f(shaderProgram.ambientColorUniform, 0.5, 0.5, 0.5);
		var lightingDir = [-1.0, -1.0, 0.0];
		var lightingDirNorm = vec3.create();
		vec3.normalize(lightingDir, lightingDirNorm);
		vec3.scale(lightingDirNorm, -1);
		gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightingDirNorm);
		gl.uniform3f(shaderProgram.directionalColorUniform, 0.7, 0.7, 0.7);
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sidingVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, sidingVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}