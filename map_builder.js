
var tileNum = 20;
var cubeSideLength = 40.0;	//center at (0, 0, 0)
var tileLength = 2.0;

var mapPositionStack = [];
var mapTextureStack = [];
var mapVertexIndexStack = [];
var elevationStack = [];

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function createMap()
{
	createFace(-1, 0);
	createFace(1, 0);
	createFace(-1, 1);
	createFace(1, 1);
	createFace(-1, 2);
	createFace(1, 2);
}

function createFace(sign, num)
{
	var vertices = [];
	var textureCoords = [];
	var mapVertexIndices = [];
	var elevations = [];
	for (var i = 0; i < tileNum; i++) {
		for (var j = 0; j < tileNum; j++) {
			var elevationNum; 
			if (i > 0 && j > 0 && i < tileNum-1 && j < tileNum-1)
				elevationNum = randInt(-1, 2);
			else
				elevationNum = 0;
			var base = -cubeSideLength / 2;
			var elevation = -sign*base + elevationNum * 0.2;
			elevations.push(elevation);
			
			//there's probably a smarter way to do this.
			if (num == 0) {
				vertices.push(base + (i*tileLength));
				vertices.push(elevation);
				vertices.push(base + (j*tileLength));
				
				vertices.push(base + ((i+1)*tileLength));
				vertices.push(elevation);
				vertices.push(base + (j*tileLength));

				vertices.push(base + (i*tileLength));
				vertices.push(elevation);
				vertices.push(base + ((j+1)*tileLength));

				vertices.push(base + ((i+1)*tileLength));
				vertices.push(elevation);
				vertices.push(base + ((j+1)*tileLength));
			}
			else if (num == 1) {
				vertices.push(elevation);
				vertices.push(base + (i*tileLength));
				vertices.push(base + (j*tileLength));

				vertices.push(elevation);				
				vertices.push(base + ((i+1)*tileLength));
				vertices.push(base + (j*tileLength));

				vertices.push(elevation);
				vertices.push(base + (i*tileLength));
				vertices.push(base + ((j+1)*tileLength));

				vertices.push(elevation);
				vertices.push(base + ((i+1)*tileLength));
				vertices.push(base + ((j+1)*tileLength));
			} else if (num == 2) {
				vertices.push(base + (i*tileLength));
				vertices.push(base + (j*tileLength));
				vertices.push(elevation);

				vertices.push(base + ((i+1)*tileLength));
				vertices.push(base + (j*tileLength));
				vertices.push(elevation);				

				vertices.push(base + (i*tileLength));
				vertices.push(base + ((j+1)*tileLength));
				vertices.push(elevation);				

				vertices.push(base + ((i+1)*tileLength));
				vertices.push(base + ((j+1)*tileLength));
				vertices.push(elevation);				
			}
			
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
	mapTextureStack.push(mapTextureBuffer);
	mapVertexIndexStack.push(mapVertexIndexBuffer);
	elevationStack.push(elevations);
}

function drawMap() 
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
	
	for (i = 0; i < mapPositionStack.length; i++) {
		var mapBuffer = mapPositionStack[i];
		var mapTextureBuffer = mapTextureStack[i];
		var mapVertexIndexBuffer = mapVertexIndexStack[i];
		
		gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mapBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mapTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, neheTexture);
		gl.uniform1i(shaderProgram.samplerUniform, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
		setMatrixUniforms();
		gl.drawElements(gl.TRIANGLES, mapVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
}