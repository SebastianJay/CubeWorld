
var mapBuffer;
var mapTextureBuffer;
var mapVertexIndexBuffer;
function createMap()
{
	//alert("creating arrays");

	var vertices = [];
	var textureCoords = [];
	var mapVertexIndices = [];
	var tileLength = 20;
	for (i = 0; i < tileLength; i++) {
		for (j = 0; j < tileLength; j++) {
			vertices.push(-20.0 + (i*2.0));
			vertices.push(0.0);
			vertices.push(-20.0 + (j*2.0));
			//vertices.push(0.0);

			vertices.push(-20.0 + ((i+1)*2.0));
			vertices.push(0.0);
			vertices.push(-20.0 + (j*2.0));
			//vertices.push(0.0);

			vertices.push(-20.0 + (i*2.0));
			vertices.push(0.0);
			vertices.push(-20.0 + ((j+1)*2.0));
			//vertices.push(0.0);

			vertices.push(-20.0 + ((i+1)*2.0));
			vertices.push(0.0);
			vertices.push(-20.0 + ((j+1)*2.0));
	//		vertices.push(0.0);
			
			textureCoords.push(0.0);
			textureCoords.push(0.0);
			
			textureCoords.push(1.0);
			textureCoords.push(0.0);

			textureCoords.push(0.0);
			textureCoords.push(1.0);

			textureCoords.push(1.0);
			textureCoords.push(1.0);
			
			mapVertexIndices.push((i*tileLength + j)*4);
			mapVertexIndices.push((i*tileLength + j)*4+1);
			mapVertexIndices.push((i*tileLength + j)*4+3);
			mapVertexIndices.push((i*tileLength + j)*4);
			mapVertexIndices.push((i*tileLength + j)*4+3);
			mapVertexIndices.push((i*tileLength + j)*4+2);
			
			/*
			mapVertexIndices.push((i)*4);
			mapVertexIndices.push((i)*4+1);
			mapVertexIndices.push((i)*4+3);
			mapVertexIndices.push((i)*4);
			mapVertexIndices.push((i)*4+3);
			mapVertexIndices.push((i)*4+2);
			*/
		}
	}
	//alert("All done");
	
	//var vertices = [
	//	0.0, 0.0, 1.0,
	//	1.0, 0.0, 1.0,
	//	0.0, 1.0, 1.0,
	//	1.0, 1.0, 1.0,
	//];
	
	mapBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	mapBuffer.itemSize = 3;
	mapBuffer.numItems = tileLength * tileLength * 4;

	mapTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, mapTextureBuffer);
	//var textureCoords = [
	//	0.0, 0.0,
	//	1.0, 0.0,
	//	0.0, 1.0,
	//	1.0, 1.0,
	//];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	mapTextureBuffer.itemSize = 2;
	mapTextureBuffer.numItems = tileLength * tileLength * 4;
	
	mapVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mapVertexIndexBuffer);
	//var mapVertexIndices = [
	//	0, 1, 3,      0, 3, 2,    // Front face
	//];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mapVertexIndices), gl.STATIC_DRAW);
	mapVertexIndexBuffer.itemSize = 1;
	mapVertexIndexBuffer.numItems = tileLength * tileLength * 6;

	//alert("GOT TO END");
}

function drawMap() 
{
	mat4.identity(mvMatrix);
	mat4.rotate(mvMatrix, degToRad(-pitch), [1, 0, 0]);
	mat4.rotate(mvMatrix, degToRad(-yaw), [0, 1, 0]);
	mat4.translate(mvMatrix, [-xPos, -yPos, -zPos]);
	
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