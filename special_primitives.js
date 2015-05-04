
//webgl
var cylinderPositionBuffer;
var cylinderNormalBuffer;
var cylinderVertexIndexBuffer;
var cylinderTextureBuffer;

var conePositionBuffer;
var coneNormalBuffer;
var coneVertexIndexBuffer;
var coneTextureBuffer;

//game-related
var cylinderLongitudeBands = 30;
var cylinderRadius = 1.0;
var cylinderHeight = 1.0;

var coneLatitudeBands = 30;
var coneLongitudeBands = 30;
var coneRadius = 1.0;
var coneHeight = 1.0;

function createSolids()
{
	createCylinder();
	createCone();
}

//creates open-ended cylinder
function createCylinder()
{
	/*
	var vertexPositionBuffer;
    var vertexNormalBuffer;
    var vertexTextureCoordBuffer;
    var vertexIndexBuffer;
	*/
	
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];
	var indexData = [];
	
/*	
	var posVec = [xpos, ypos, zpos];
	collectWorldPosStack.push(posVec);
	collectFound.push(false);
*/

	//initial point
	//var counter = 2;
	var prevSinTheta = 0;
	var prevCosTheta = 1;
	normalData.push(prevCosTheta, 0, prevSinTheta);
	normalData.push(prevCosTheta, 0, prevSinTheta);
	textureCoordData.push(0, 0);
	textureCoordData.push(0, 1);
	vertexPositionData.push(cylinderRadius * prevCosTheta, 0, cylinderRadius * prevSinTheta);
	vertexPositionData.push(cylinderRadius * prevCosTheta, cylinderHeight, cylinderRadius * prevSinTheta);	
	for (var longNumber=1; longNumber <= collectLongitudeBands; longNumber++) {
		var theta = longNumber * 2 * Math.PI / collectLongitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		var x = cosTheta;
		var z = sinTheta;
		var u = (longNumber / collectLongitudeBands);
		//var v = 1 - (latNumber / collectLatitudeBands);

		normalData.push(cosTheta);
		normalData.push(0);
		normalData.push(sinTheta);
		normalData.push(cosTheta);
		normalData.push(0);
		normalData.push(sinTheta);
		textureCoordData.push(u);
		textureCoordData.push(0);
		textureCoordData.push(u);
		textureCoordData.push(1);
		vertexPositionData.push(cylinderRadius * x);
		vertexPositionData.push(0);
		vertexPositionData.push(cylinderRadius * z);			
		vertexPositionData.push(cylinderRadius * x);
		vertexPositionData.push(cylinderHeight);
		vertexPositionData.push(cylinderRadius * z);			
		
		indexData.push((longNumber-1)*2);
		indexData.push((longNumber-1)*2 + 1);
		indexData.push((longNumber)*2);
		indexData.push((longNumber)*2 + 1);
		indexData.push((longNumber)*2);
		indexData.push((longNumber-1)*2 + 1);
		
		prevSinTheta = sinTheta;
		prevCosTheta = cosTheta;
		//counter += 2;
	}

	/*
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
	*/
	
	cylinderNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	cylinderNormalBuffer.itemSize = 3;
	cylinderNormalBuffer.numItems = normalData.length / 3;

	cylinderTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	cylinderTextureBuffer.itemSize = 2;
	cylinderTextureBuffer.numItems = textureCoordData.length / 2;

	cylinderPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	cylinderPositionBuffer.itemSize = 3;
	cylinderPositionBuffer.numItems = vertexPositionData.length / 3;

	cylinderIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	cylinderIndexBuffer.itemSize = 1;
	cylinderIndexBuffer.numItems = indexData.length;
	
	/*
	collectPositionStack.push(vertexPositionBuffer);
	collectNormalStack.push(vertexNormalBuffer);
	collectTextureStack.push(vertexTextureCoordBuffer);
	collectVertexIndexStack.push(vertexIndexBuffer);
	*/
}

function createCone()
{	
	var vertexPositionData = [];
	var normalData = [];
	var textureCoordData = [];
	var indexData = [];
	
	for (var latNumber=0; latNumber <= coneLatitudeBands; latNumber++) {
		var midHeight = latNumber * coneHeight / coneLatitudeBands;
		var midRadius = (coneHeight - midHeight) * coneRadius / coneHeight;
		for (var longNumber=0; longNumber <= coneLongitudeBands; longNumber++) {
			var theta = longNumber * 2 * Math.PI / collectLongitudeBands;
			var sinTheta = Math.sin(theta);
			var cosTheta = Math.cos(theta);

			var x = midRadius * cosTheta;
			var y = midHeight;
			var z = midRadius * sinTheta;
			var u = 0.5 + (0.5 * cosTheta * midRadius / coneRadius);
			var v = 0.5 + (0.5 * sinTheta * midRadius / coneRadius);

			var nx = x*coneHeight/coneRadius;
			var ny = coneRadius/coneHeight;
			var nz = z*coneHeight/coneRadius;
			var nmag = Math.sqrt(nx*nx + ny*ny + nz*nz);
			
			normalData.push(nx/nmag);
			normalData.push(ny/nmag);
			normalData.push(nz/nmag);
			textureCoordData.push(u);
			textureCoordData.push(v);
			vertexPositionData.push(x);
			vertexPositionData.push(y);
			vertexPositionData.push(z);			
		}
	}

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

	coneNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
	coneNormalBuffer.itemSize = 3;
	coneNormalBuffer.numItems = normalData.length / 3;

	coneTextureBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, coneTextureBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);
	coneTextureBuffer.itemSize = 2;
	coneTextureBuffer.numItems = textureCoordData.length / 2;

	conePositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, conePositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);
	conePositionBuffer.itemSize = 3;
	conePositionBuffer.numItems = vertexPositionData.length / 3;

	coneVertexIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
	coneVertexIndexBuffer.itemSize = 1;
	coneVertexIndexBuffer.numItems = indexData.length;	
}

function drawCylinder() {
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureStack[12]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderPositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cylinderPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cylinderTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, cylinderNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cylinderNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLightFlat);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, dirLightDirectionFlat);
	gl.uniform3fv(shaderProgram.directionalColorUniform, dirLightColorFlat);
	gl.uniform3fv(shaderProgram.pointLightingPositionUniform, pointLightPositionFlat);
	gl.uniform3fv(shaderProgram.pointLightingColorUniform, pointLightColorFlat);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cylinderIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, cylinderIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
}


function drawCone(translateVec, rotateAngle, rotateVec, scaleVec) {
	var localMat = mat4.create();
	mat4.identity(localMat);
	mat4.scale(localMat, scaleVec);
	mat4.translate(localMat, translateVec);
	mat4.rotate(localMat, degToRad(rotateAngle), rotateVec);
	mvPushMatrix();
	mat4.multiply(mvMatrix, localMat, mvMatrix);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureStack[12]);
	gl.uniform1i(shaderProgram.samplerUniform, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, conePositionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, conePositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, coneTextureBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, coneTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, coneNormalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, coneNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.uniform1i(shaderProgram.useLightingUniform, true);
	gl.uniform3fv(shaderProgram.ambientColorUniform, ambientLightFlat);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, dirLightDirectionFlat);
	gl.uniform3fv(shaderProgram.directionalColorUniform, dirLightColorFlat);
	gl.uniform3fv(shaderProgram.pointLightingPositionUniform, pointLightPositionFlat);
	gl.uniform3fv(shaderProgram.pointLightingColorUniform, pointLightColorFlat);
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneVertexIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, coneVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);	
	
	mvPopMatrix();
}
