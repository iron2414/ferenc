var amplitude;
var box={};
var color;
var directions={};
var Float32Array;
var gl;
var glcanvas;
var mat4;
var normalize={"enabled": true, "x": 0.0, "y": 0.0, "z": 0.0};
var planeXZ={"enabled": true};
var radiators={source:
`{"amplitude": 0.5,
"angle": Math.PI/2.0,
"frequency": 1.0,
"normal": [0.0, 0.0, -1.0],
"position": [-0.125, 0.0, 0.0],
"shift": 0.0,
"type": "isotropic",
"wavelength": 0.5,
"switchShift": 0.0,
"switchOn": 5.0,
"switchOff": 2.0,
"switchSpeed": 2.0},

{"amplitude": 0.5,
"angle": Math.PI/2.0,
"frequency": 1.0,
"normal": [0.0, 0.0, -1.0],
"position": [0.125, 0.0, 0.0],
"shift": 0.0,
"type": "isotropic",
"wavelength": 0.5,
"switchShift": 0.0,
"switchOn": 5.0,
"switchOff": 2.0,
"switchSpeed": 2.0},
`};
var start;
var supreme;
var texture;
var transparent={"enabled": false};
var Uint8Array;
var user;
var view;

function initDraw() {
	normalize.enabledCheckbox=document.getElementById("normalizeEnabled");
	normalize.enabledX=document.getElementById("normalizeX");
	normalize.enabledY=document.getElementById("normalizeY");
	normalize.enabledZ=document.getElementById("normalizeZ");
	normalize.enabledCheckbox.onchange=function(event) {
		normalize.enabled=normalize.enabledCheckbox.checked;
		amplitude.dirty=true;
	};
	normalize.enabledX.onchange=function(event) {
		normalize.x=normalize.enabledX.value;
		amplitude.dirty=true;
	};
	normalize.enabledY.onchange=function(event) {
		normalize.y=normalize.enabledY.value;
		amplitude.dirty=true;
	};
	normalize.enabledZ.onchange=function(event) {
		normalize.z=normalize.enabledZ.value;
		amplitude.dirty=true;
	};
	normalize.enabledCheckbox.checked=normalize.enabled;
	normalize.enabledX.value=normalize.x;
	normalize.enabledY.value=normalize.y;
	normalize.enabledZ.value=normalize.z;
	radiators.button=document.getElementById("radiatorsButton");
	radiators.input=document.getElementById("radiatorsText");
	radiators.button.onclick=function(event) {
		amplitude.dirty=true;
	};
	radiators.input.value=radiators.source;
	planeXZ.checkbox=document.getElementById("planeXZ");
	planeXZ.checkbox.onchange=function(event) {
		planeXZ.enabled=planeXZ.checkbox.checked;
	};
	planeXZ.checkbox.checked=planeXZ.enabled;
	transparent.checkbox=document.getElementById("transparent");
	transparent.checkbox.onchange=function(event) {
		transparent.enabled=transparent.checkbox.checked;
	};
	transparent.checkbox.checked=transparent.enabled;
	
	gl.viewport(0, 0, glcanvas.width, glcanvas.height);
			
	color.program=gl.loadProgram(
			"color", color.fragment, color.vertex,
			["aColors", "aCoordinates"], ["uProjectionMatrix"]);
			
	texture.program=gl.loadProgram(
			"texture", texture.fragment, texture.vertex,
			["aCoordinates", "aTextureCoordinates"],
			["uProjectionMatrix", "uTextureUnit"]);
	
	box.indexBuffer=gl.loadBuffer(
			gl.ELEMENT_ARRAY_BUFFER,
			Uint8Array.prototype.constructor,
			gl.STATIC_DRAW,
			[0, 1, 2, 0, 2, 3,
			4, 5, 6, 4, 6, 7,
			0, 1, 5, 0, 5, 4,
			3, 2, 6, 3, 6, 7,
			1, 5, 6, 1, 6, 2,
			0, 4, 7, 0, 7, 3]);
	
	box.vertexBuffer=gl.loadBuffer(
			gl.ARRAY_BUFFER,
			Float32Array.prototype.constructor,
			gl.STATIC_DRAW,
			[10.0, 10.0, 10.0,
			-10.0, 10.0, 10.0,
			-10.0, -10.0, 10.0,
			10.0, -10.0, 10.0,
			10.0, 10.0, -10.0,
			-10.0, 10.0, -10.0,
			-10.0, -10.0, -10.0,
			10.0, -10.0, -10.0]);
	
	directions.buffer=gl.loadBuffer(
			gl.ARRAY_BUFFER,
			Float32Array.prototype.constructor,
			gl.STATIC_DRAW,
			[0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,
			0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,
			0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
	
	planeXZ.indexBuffer=gl.loadBuffer(
			gl.ELEMENT_ARRAY_BUFFER,
			Uint8Array.prototype.constructor,
			gl.STATIC_DRAW,
			[0, 1, 2, 0, 2, 3]);
	
	planeXZ.vertexBuffer=gl.loadBuffer(
			gl.ARRAY_BUFFER,
			Float32Array.prototype.constructor,
			gl.STATIC_DRAW,
			[10.0, 0.0, 10.0,
			-10.0, 0.0, 10.0,
			-10.0, 0.0, -10.0,
			10.0, 0.0, -10.0]);
	
	supreme.texture=gl.loadTexture(supreme.image);
	
	supreme.indexBuffer=gl.loadBuffer(
			gl.ELEMENT_ARRAY_BUFFER,
			Uint8Array.prototype.constructor,
			gl.STATIC_DRAW,
			[0, 1, 2, 0, 2, 3]);
	
	supreme.vertexBuffer=gl.loadBuffer(
			gl.ARRAY_BUFFER,
			Float32Array.prototype.constructor,
			gl.STATIC_DRAW,
			[10.0, 10.0, 100.0, 0.0, 0.0,
			-10.0, 10.0, 100.0, 1.0, 0.0,
			-10.0, -10.0, 100.0, 1.0, 1.0,
			10.0, -10.0, 100.0, 0.0, 1.0]);
}

function draw() {
	if (amplitude.dirty) {
		recompile();
		amplitude.dirty=false;
	}
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	if (transparent.enabled) {
		gl.disable(gl.DEPTH_TEST);
		gl.enable(gl.BLEND);
		gl.blendEquation(gl.FUNC_ADD);
		gl.blendFunc(gl.ONE, gl.ONE);
		gl.cullFace(gl.FRONT_AND_BACK);
	}
	else {
		gl.disable(gl.BLEND);
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LESS);
		gl.cullFace(gl.FRONT);
	}
	
	var now=(Date.now()-start)/1000.0;
	
	var perspectiveMatrix=mat4.create();
	mat4.identity(perspectiveMatrix);
	mat4.perspective(perspectiveMatrix, view.fieldOfView,
			glcanvas.width/glcanvas.height,
			0.1, 1000.0);
	var viewMatrix=mat4.create();
	mat4.identity(viewMatrix);
    mat4.rotate(viewMatrix, viewMatrix, view.rotation.x, [1.0, 0.0, 0.0]);
    mat4.rotate(viewMatrix, viewMatrix, view.rotation.y, [0.0, 1.0, 0.0]);
	mat4.translate(viewMatrix, viewMatrix,
			[-view.position.x, -view.position.y, -view.position.z]);
	var projectionMatrix=mat4.create();
	mat4.multiply(projectionMatrix, perspectiveMatrix, viewMatrix);
	
	color.program.use();
	gl.uniformMatrix4fv(
			color.program.uProjectionMatrix, false, projectionMatrix);
	gl.bindBuffer(gl.ARRAY_BUFFER, directions.buffer);
	gl.enableVertexAttribArray(color.program.aColors);
	gl.enableVertexAttribArray(color.program.aCoordinates);
	gl.vertexAttribPointer(color.program.aColors, 3, gl.FLOAT, false, 24, 12);
	gl.vertexAttribPointer(
			color.program.aCoordinates, 3, gl.FLOAT, false, 24, 0);
	gl.drawArrays(gl.LINES, 0, 6);
	gl.disableVertexAttribArray(color.program.aCoordinates);
	gl.disableVertexAttribArray(color.program.aColors);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.useProgram(null);
	
	amplitude.program.use();
	gl.uniformMatrix4fv(
			amplitude.program.uProjectionMatrix, false, projectionMatrix);
	gl.uniform1f(amplitude.program.uTime, now);
	gl.enableVertexAttribArray(amplitude.program.aCoordinates);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, box.vertexBuffer);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, box.indexBuffer);
	gl.vertexAttribPointer(
			amplitude.program.aCoordinates, 3, gl.FLOAT, false, 12, 0);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
	
	if (planeXZ.enabled) {
		gl.bindBuffer(gl.ARRAY_BUFFER, planeXZ.vertexBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeXZ.indexBuffer);
		gl.vertexAttribPointer(
				amplitude.program.aCoordinates, 3, gl.FLOAT, false, 12, 0);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
	}
	
	gl.disableVertexAttribArray(amplitude.program.aCoordinates);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	
	gl.useProgram(null);
	
	if (supreme.enabled) {
		if (!transparent.enabled) {
			gl.enable(gl.BLEND);
			gl.blendEquation(gl.FUNC_ADD);
			gl.blendFunc(
					gl.SRC_ALPHA,
					gl.ONE_MINUS_SRC_ALPHA);
			gl.cullFace(gl.FRONT_AND_BACK);
		}

		texture.program.use();
		gl.uniformMatrix4fv(
				texture.program.uProjectionMatrix, false, projectionMatrix);
		gl.uniform1i(texture.program.uTextureUnit, 0);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, supreme.texture);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, supreme.indexBuffer);
		gl.bindBuffer(gl.ARRAY_BUFFER, supreme.vertexBuffer);
		gl.enableVertexAttribArray(texture.program.aCoordinates);
		gl.enableVertexAttribArray(texture.program.aTextureCoordinates);
		gl.vertexAttribPointer(
				texture.program.aCoordinates, 3, gl.FLOAT, false, 20, 0);
		gl.vertexAttribPointer(
				texture.program.aTextureCoordinates, 2, gl.FLOAT, false, 20, 12);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
		gl.disableVertexAttribArray(texture.program.aTextureCoordinates);
		gl.disableVertexAttribArray(texture.program.aCoordinates);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.useProgram(null);
	}
	
	window.requestAnimationFrame(draw);
}

function floatToString(value) {
	var result=value.toString();
	if (0>result.indexOf('.')) {
		result+=".0";
	}
	return result;
}

function recompile() {
	radiators.source=radiators.input.value.trim();
	while (radiators.source.startsWith(",")) {
		radiators.source=radiators.source.substring(1).trim();
	}
	while (radiators.source.endsWith(",")) {
		radiators.source=radiators.source
				.substring(0, radiators.source.length-1).trim();
	}
	try {
		radiators.array=eval("["+radiators.source+"]");
	}
	catch (error) {
		radiators.array=[];
		alert(error);
	}
	var funcs=[];
	for (var ii=0; radiators.array.length>ii; ++ii) {
		var radiator=radiators.array[ii];
		var amplitude2=floatToString(parseFloat(radiator.amplitude));
		var angle=floatToString(parseFloat(radiator.angle));
		var frequency=floatToString(parseFloat(radiator.frequency));
		var normal="vec3("
				+floatToString(parseFloat(radiator.normal[0]))+", "
				+floatToString(parseFloat(radiator.normal[1]))+", "
				+floatToString(parseFloat(radiator.normal[2]))+")";
		var position="vec3("
				+floatToString(parseFloat(radiator.position[0]))+", "
				+floatToString(parseFloat(radiator.position[1]))+", "
				+floatToString(parseFloat(radiator.position[2]))+")";
		var shift=floatToString(parseFloat(radiator.shift));
		var type=radiator.type;
		var wavelength=floatToString(parseFloat(radiator.wavelength));
		var switchShift=floatToString(parseFloat(radiator.switchShift));
		var switchOn=floatToString(parseFloat(radiator.switchOn));
		var switchOff=floatToString(parseFloat(radiator.switchOff));
		var switchSpeed=floatToString(parseFloat(radiator.switchSpeed));
		switch (type) {
			case "dipole":
				funcs.push("dipole("+amplitude2+", "+frequency+", "+normal
						+", "+position+", "+shift+", "+wavelength
						+", "+switchShift+", "+switchOn
						+", "+switchOff+", "+switchSpeed+")");
				break;
			case "isotropic":
				funcs.push("isotropic("+amplitude2+", "+frequency
						+", "+position+", "+shift+", "+wavelength
						+", "+switchShift+", "+switchOn
						+", "+switchOff+", "+switchSpeed+")");
				break;
			case "spot":
				funcs.push("spot("+amplitude2+", "+angle+", "+frequency
						+", "+normal+", "+position+", "+shift
						+", "+wavelength
						+", "+switchShift+", "+switchOn
						+", "+switchOff+", "+switchSpeed+")");
				break;
			default:
				alert("unknown type "+type);
				break;
		}
	}
	if (0>=funcs.length) {
		funcs=["isotropic(1.0, 1.0, vec3(0.0, 0.0, 0.0), 0.0, 0.5)"];
	}
	var output="amplitude=\n"+sum(funcs, 0, funcs.length)+";\n";
	if (normalize.enabled) {
		output+="vec3 position=vCoordinates-vec3("
				+floatToString(normalize.x)+", "
				+floatToString(normalize.y)+", "
				+floatToString(normalize.z)+");\n";
		output+="amplitude*=position.x*position.x"
				+"+position.y*position.y"
				+"+position.z*position.z;\n";
	}
	amplitude.program=gl.loadProgram(
			"amplitude",
			amplitude.fragment
					.split("$isotropic")
					.join(amplitude.isotropic)
					.split("$switch")
					.join(amplitude.switch)
					.split("$amplitude")
					.join(output),
			amplitude.vertex,
			["aCoordinates"], ["uProjectionMatrix", "uTime"]);
}

function sum(funcs, from, length) {
	if (0>=length) {
		throw "illegal state";
	}
	if (1===length) {
		return funcs[from];
	}
	var half=Math.trunc(length/2);
	return "("+sum(funcs, from, half)
			+")\n+("+sum(funcs, from+half, length-half)+")";
}

supreme.image=new Image();
supreme.image.src=supreme.source;
initDraw();
window.requestAnimationFrame(draw);
